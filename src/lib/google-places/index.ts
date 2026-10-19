// ==============================================================================
// SERVICE GOOGLE PLACES API (NEW) AVEC CACHE ET FILTRAGE SANS SITE WEB
// ==============================================================================

export interface PlaceResult {
  id: string // Google Place ID
  name: string
  category: "restaurant" | "barber" | "beauty"
  address: string
  city: string
  phone: string | null
  rating: number | null
  userRatingsTotal: number
  hasWebsite: boolean
  websiteUri?: string | null
  openingHours?: string[]
  location?: {
    latitude: number
    longitude: number
  }
}

// Cache en mémoire pour respecter les coûts et limiter les appels API
interface CacheEntry {
  timestamp: number
  data: PlaceResult[]
}

const searchCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes

// Mappings des types Google Places New vers nos 3 catégories
const CATEGORY_KEYWORDS: Record<string, { query: string; types: string[]; label: "restaurant" | "barber" | "beauty" }> = {
  restaurant: {
    query: "restaurant snack brasserie",
    types: ["restaurant", "meal_takeaway", "fast_food_restaurant"],
    label: "restaurant",
  },
  barber: {
    query: "barber coiffeur barbier salon de coiffure",
    types: ["barber_shop", "hair_salon", "hair_care"],
    label: "barber",
  },
  beauty: {
    query: "institut de beauté salon esthétique spa onglerie",
    types: ["beauty_salon", "spa", "nail_salon"],
    label: "beauty",
  },
}

/**
 * Recherche les commerces locaux sans site web via l'API officielle Google Places (New).
 * Si aucune clé API n'est configurée, bascule automatiquement sur des données réalistes de démo.
 */
export async function searchPlacesWithoutWebsite(
  city: string,
  category: "restaurant" | "barber" | "beauty" | "all" = "all"
): Promise<{ places: PlaceResult[]; source: "google_places_api" | "demo_data" }> {
  const normalizedCity = city.trim().toLowerCase()
  const cacheKey = `${normalizedCity}_${category}`

  // 1. Vérification du cache en mémoire
  const cached = searchCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { places: cached.data, source: "google_places_api" }
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const hasValidApiKey = apiKey && !apiKey.startsWith("AIzaSy...") && apiKey.length > 20

  // 2. Si pas de clé Google configurée -> Générateur de prospects réalistes
  if (!hasValidApiKey) {
    const mockResults = generateRealisticLocalPlaces(city, category)
    searchCache.set(cacheKey, { timestamp: Date.now(), data: mockResults })
    return { places: mockResults, source: "demo_data" }
  }

  // 3. Appel à la nouvelle API Google Places Text Search (v1)
  try {
    const categoriesToSearch =
      category === "all"
        ? (["restaurant", "barber", "beauty"] as const)
        : ([category] as const)

    let allPlaces: PlaceResult[] = []

    for (const cat of categoriesToSearch) {
      const config = CATEGORY_KEYWORDS[cat]
      const textQuery = `${config.query} à ${city}`

      // Request avec Field Mask minimal pour optimiser les coûts Google Cloud
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.regularOpeningHours,places.websiteUri,places.primaryType,places.location",
        },
        body: JSON.stringify({
          textQuery,
          languageCode: "fr",
          maxResultCount: 20,
        }),
      })

      if (!response.ok) {
        console.error("Google Places API error:", response.status, await response.text())
        continue
      }

      const data = await response.json()
      const rawPlaces = data.places || []

      // FILTRAGE STRICT CÔTÉ SERVEUR : UNIQUEMENT LES COMMERCES SANS SITE WEB
      const filtered = rawPlaces
        .filter((p: any) => !p.websiteUri || p.websiteUri.trim() === "")
        .map((p: any): PlaceResult => ({
          id: p.id,
          name: p.displayName?.text || "Commerce sans nom",
          category: cat,
          address: p.formattedAddress || `${city}`,
          city: city,
          phone: p.nationalPhoneNumber || null,
          rating: p.rating ? Number(p.rating.toFixed(1)) : null,
          userRatingsTotal: p.userRatingCount || 0,
          hasWebsite: false,
          websiteUri: null,
          openingHours: p.regularOpeningHours?.weekdayDescriptions || [
            "Lundi - Vendredi : 09:00 - 19:00",
            "Samedi : 10:00 - 18:00",
            "Dimanche : Fermé",
          ],
          location: p.location
            ? {
                latitude: p.location.latitude,
                longitude: p.location.longitude,
              }
            : undefined,
        }))

      allPlaces = [...allPlaces, ...filtered]
    }

    // Déduplication par Google Place ID
    const uniqueMap = new Map<string, PlaceResult>()
    for (const p of allPlaces) {
      uniqueMap.set(p.id, p)
    }
    const finalResults = Array.from(uniqueMap.values())

    searchCache.set(cacheKey, { timestamp: Date.now(), data: finalResults })
    return { places: finalResults, source: "google_places_api" }
  } catch (error) {
    console.error("Erreur lors de la recherche Places :", error)
    // Fallback gracieux en cas de panne réseau
    const fallback = generateRealisticLocalPlaces(city, category)
    return { places: fallback, source: "demo_data" }
  }
}

/**
 * Générateur de données de prospection hyper-réalistes pour tester sans clé Google Places
 */
function generateRealisticLocalPlaces(
  city: string,
  category: "restaurant" | "barber" | "beauty" | "all"
): PlaceResult[] {
  const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()

  // Coordonnées approximatives des grandes villes françaises pour la carte
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    paris: { lat: 48.8566, lng: 2.3522 },
    lyon: { lat: 45.764, lng: 4.8357 },
    marseille: { lat: 43.2965, lng: 5.3698 },
    bordeaux: { lat: 44.8378, lng: -0.5792 },
    toulouse: { lat: 43.6047, lng: 1.4442 },
    lille: { lat: 50.6292, lng: 3.0573 },
    nantes: { lat: 47.2184, lng: -1.5536 },
    strasbourg: { lat: 48.5734, lng: 7.7521 },
    nice: { lat: 43.7102, lng: 7.262 },
    rennes: { lat: 48.1173, lng: -1.6778 },
  }

  const baseCoord = cityCoords[cityName.toLowerCase()] || { lat: 48.8566, lng: 2.3522 }

  const database = [
    // RESTAURANTS
    {
      name: "Le Bistro Gourmand",
      category: "restaurant" as const,
      address: `14 Rue de la République, ${cityName}`,
      phone: "01 42 68 90 12",
      rating: 4.8,
      reviews: 58,
      offset: { lat: 0.002, lng: 0.003 },
    },
    {
      name: "L'Atelier Burger & Grill",
      category: "restaurant" as const,
      address: `27 Avenue Jean Jaurès, ${cityName}`,
      phone: "01 45 89 23 11",
      rating: 4.6,
      reviews: 74,
      offset: { lat: -0.003, lng: 0.004 },
    },
    {
      name: "Pizzeria Da Marco",
      category: "restaurant" as const,
      address: `8 Place des Carmes, ${cityName}`,
      phone: "01 49 12 45 67",
      rating: 4.7,
      reviews: 92,
      offset: { lat: 0.004, lng: -0.002 },
    },
    {
      name: "Brasserie Le Saint-Germain",
      category: "restaurant" as const,
      address: `45 Boulevard Gambetta, ${cityName}`,
      phone: "01 43 55 78 90",
      rating: 4.5,
      reviews: 43,
      offset: { lat: -0.002, lng: -0.003 },
    },

    // BARBERS / COIFFEURS
    {
      name: "Gentleman Barber Club",
      category: "barber" as const,
      address: `18 Rue Victor Hugo, ${cityName}`,
      phone: "01 47 88 12 34",
      rating: 4.9,
      reviews: 67,
      offset: { lat: 0.003, lng: 0.001 },
    },
    {
      name: "L'Atelier du Barbier",
      category: "barber" as const,
      address: `32 Rue Nationale, ${cityName}`,
      phone: "01 44 23 67 89",
      rating: 4.8,
      reviews: 81,
      offset: { lat: -0.004, lng: 0.002 },
    },
    {
      name: "Fade & Blade Studio",
      category: "barber" as const,
      address: `5 Rue des Teinturiers, ${cityName}`,
      phone: "01 48 90 34 56",
      rating: 4.7,
      reviews: 39,
      offset: { lat: 0.001, lng: -0.004 },
    },

    // INSTITUTS DE BEAUTÉ
    {
      name: "L'Institut Sublime Beauté",
      category: "beauty" as const,
      address: `12 Rue Saint-Antoine, ${cityName}`,
      phone: "01 40 29 45 78",
      rating: 4.9,
      reviews: 52,
      offset: { lat: -0.001, lng: 0.003 },
    },
    {
      name: "Oasis Spa & Esthétique",
      category: "beauty" as const,
      address: `22 Rue Paradis, ${cityName}`,
      phone: "01 46 78 90 23",
      rating: 4.8,
      reviews: 46,
      offset: { lat: 0.002, lng: -0.003 },
    },
    {
      name: "Studio Onglerie & Regard",
      category: "beauty" as const,
      address: `9 Rue Voltaire, ${cityName}`,
      phone: "01 41 56 78 99",
      rating: 4.7,
      reviews: 34,
      offset: { lat: -0.003, lng: -0.001 },
    },
  ]

  const filtered =
    category === "all"
      ? database
      : database.filter((item) => item.category === category)

  return filtered.map((item, index) => ({
    id: `mock_place_${cityName.toLowerCase()}_${item.category}_${index + 1}`,
    name: item.name,
    category: item.category,
    address: item.address,
    city: cityName,
    phone: item.phone,
    rating: item.rating,
    userRatingsTotal: item.reviews,
    hasWebsite: false,
    websiteUri: null,
    openingHours: [
      "Lundi - Vendredi : 09:30 - 19:30",
      "Samedi : 09:00 - 19:00",
      "Dimanche : Fermé",
    ],
    location: {
      latitude: baseCoord.lat + item.offset.lat,
      longitude: baseCoord.lng + item.offset.lng,
    },
  }))
}
