"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlaceResult } from "@/lib/google-places"
import dynamic from "next/dynamic"
import {
  Compass,
  Search,
  MapPin,
  Star,
  Phone,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Sparkles,
  Map as MapIcon,
  List as ListIcon,
  Check,
  BookmarkPlus,
} from "lucide-react"

// Import dynamique de la carte Leaflet côté client
const PlacesMap = dynamic(() => import("@/components/finder/PlacesMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] sm:h-[420px] rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 text-sm">
      <Loader2 className="w-6 h-6 animate-spin mr-2 text-indigo-500" />
      <span>Chargement de la carte interactive...</span>
    </div>
  ),
})

const QUICK_CITIES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Bordeaux",
  "Lille",
  "Toulouse",
  "Nantes",
  "Nice",
]

const CATEGORIES = [
  { id: "all", label: "Tous", emoji: "🌟" },
  { id: "restaurant", label: "Restaurants & Snacks", emoji: "🍽️" },
  { id: "barber", label: "Barbers & Coiffure", emoji: "✂️" },
  { id: "beauty", label: "Instituts & Beauté", emoji: "💅" },
]

export default function TrouverPage() {
  const router = useRouter()
  const [city, setCity] = useState("Lyon")
  const [category, setCategory] = useState<"all" | "restaurant" | "barber" | "beauty">("all")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PlaceResult[]>([])
  const [searchedCity, setSearchedCity] = useState("")
  const [source, setSource] = useState<"google_places_api" | "demo_data">("demo_data")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [savingPlaceId, setSavingPlaceId] = useState<string | null>(null)
  const [savedProspectIds, setSavedProspectIds] = useState<Record<string, boolean>>({})

  // Recherche initiale par défaut au premier chargement
  useEffect(() => {
    handleSearch("Lyon", "all")
  }, [])

  async function handleSearch(targetCity = city, targetCategory = category) {
    if (!targetCity.trim()) return

    setLoading(true)
    setSelectedPlaceId(null)

    try {
      const res = await fetch(
        `/api/places/search?city=${encodeURIComponent(targetCity.trim())}&category=${targetCategory}`
      )
      const data = await res.json()

      if (data.places) {
        setResults(data.places)
        setSearchedCity(targetCity.trim())
        setSource(data.source)
      }
    } catch (err) {
      console.error("Erreur de recherche :", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateDemo(place: PlaceResult) {
    setSavingPlaceId(place.id)

    try {
      // 1. Enregistre le prospect dans la base de données Supabase
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_place_id: place.id,
          name: place.name,
          category: place.category,
          address: place.address,
          city: place.city,
          phone: place.phone,
          rating: place.rating,
          user_ratings_total: place.userRatingsTotal,
        }),
      })

      const data = await res.json()

      if (data.success && data.prospectId) {
        // Redirection vers le générateur de démo (Étape 4)
        router.push(`/demos/creer?prospect_id=${data.prospectId}`)
      } else {
        alert("Erreur lors de la préparation de la démo.")
      }
    } catch (err) {
      console.error("Erreur création démo :", err)
    } finally {
      setSavingPlaceId(null)
    }
  }

  async function handleSaveProspectOnly(place: PlaceResult) {
    setSavingPlaceId(place.id)

    try {
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_place_id: place.id,
          name: place.name,
          category: place.category,
          address: place.address,
          city: place.city,
          phone: place.phone,
          rating: place.rating,
          user_ratings_total: place.userRatingsTotal,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSavedProspectIds((prev) => ({ ...prev, [place.id]: true }))
      }
    } catch (err) {
      console.error("Erreur sauvegarde :", err)
    } finally {
      setSavingPlaceId(null)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* HEADER DE RECHERCHE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-indigo-400" />
            <span>Trouver des commerces sans site</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Détecte les commerces bien notés mais sans présence web dans n&apos;importe quelle ville.
          </p>
        </div>

        {/* Source indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 w-fit">
          <span
            className={`w-2 h-2 rounded-full ${
              source === "google_places_api" ? "bg-emerald-400" : "bg-indigo-400"
            }`}
          />
          <span>
            {source === "google_places_api"
              ? "Google Places API connectée"
              : "Mode démo haute précision"}
          </span>
        </div>
      </div>

      {/* FORMULAIRE DE RECHERCHE MOBILE-FIRST */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Champ Ville */}
          <div className="relative flex-1">
            <MapPin className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Entre une ville (ex : Lyon, Bordeaux, Lille...)"
              className="w-full h-13 pl-11 pr-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-neutral-500 text-sm sm:text-base outline-none transition-all"
            />
          </div>

          {/* Bouton de recherche */}
          <button
            type="submit"
            disabled={loading}
            className="h-13 px-7 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Rechercher</span>
              </>
            )}
          </button>
        </form>

        {/* Filtres par catégorie */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                const newCat = cat.id as any
                setCategory(newCat)
                handleSearch(city, newCat)
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                category === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Raccourcis Villes populaires */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-neutral-800/60 scrollbar-none text-xs">
          <span className="text-neutral-500 font-medium shrink-0 mr-1">
            Villes populaires :
          </span>
          {QUICK_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCity(c)
                handleSearch(c, category)
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                city.toLowerCase() === c.toLowerCase()
                  ? "bg-neutral-800 text-indigo-400 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* RÉSULTATS DE RECHERCHE */}
      {searchedCity && (
        <div className="space-y-4">
          {/* Barre d'état des résultats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800 px-4 sm:px-6 py-3.5 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">
                🎯 {results.length} commerces sans site web
              </span>
              <span className="text-neutral-400 text-xs">à {searchedCity}</span>
            </div>

            {/* Commutateur Vue Liste / Carte */}
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>Liste</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === "map"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Carte</span>
              </button>
            </div>
          </div>

          {/* VUE CARTE INTERACTIVE */}
          {viewMode === "map" && (
            <PlacesMap
              places={results}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={(place) => {
                setSelectedPlaceId(place.id)
              }}
            />
          )}

          {/* LISTE DES FICHES COMMERCES */}
          {results.length === 0 ? (
            <div className="py-12 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6">
              <Compass className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">
                Aucun commerce sans site trouvé pour cette catégorie
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Essaie une autre catégorie ou une autre ville à proximité !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((place) => {
                const isSelected = selectedPlaceId === place.id
                const isSaving = savingPlaceId === place.id
                const isSaved = savedProspectIds[place.id]

                const categoryLabel =
                  place.category === "restaurant"
                    ? "Restaurant"
                    : place.category === "barber"
                    ? "Barber / Coiffure"
                    : "Institut Beauté"

                const categoryBadgeBg =
                  place.category === "restaurant"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : place.category === "barber"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-pink-500/10 text-pink-400 border-pink-500/20"

                return (
                  <div
                    key={place.id}
                    className={`bg-neutral-900/90 border rounded-3xl p-5 flex flex-col justify-between transition-all hover:border-neutral-700 shadow-xl ${
                      isSelected
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-neutral-850"
                        : "border-neutral-800"
                    }`}
                  >
                    <div>
                      {/* En-tête de la carte */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryBadgeBg}`}
                        >
                          {categoryLabel}
                        </span>

                        {/* Alerte sans site web */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>ZÉRO SITE WEB</span>
                        </span>
                      </div>

                      {/* Nom du commerce */}
                      <h3 className="font-extrabold text-lg text-white tracking-tight line-clamp-1 mb-1">
                        {place.name}
                      </h3>

                      {/* Avis Google */}
                      <div className="flex items-center gap-2 text-xs mb-3">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{place.rating || "4.8"}</span>
                        </div>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-400 font-medium">
                          {place.userRatingsTotal} avis Google
                        </span>
                      </div>

                      {/* Adresse & Téléphone */}
                      <div className="space-y-1.5 text-xs text-neutral-300 mb-5">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{place.address}</span>
                        </div>

                        {place.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                            <a
                              href={`tel:${place.phone}`}
                              className="text-neutral-300 hover:text-white transition-colors"
                            >
                              {place.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions de la fiche */}
                    <div className="space-y-2 pt-4 border-t border-neutral-800">
                      {/* Bouton principal : Générer la démo en 60s */}
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleCreateDemo(place)}
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Générer sa démo en 60s</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Bouton secondaire : Sauvegarder dans mes prospects */}
                      <button
                        type="button"
                        disabled={isSaving || isSaved}
                        onClick={() => handleSaveProspectOnly(place)}
                        className={`w-full h-9 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          isSaved
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-neutral-950/70 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Enregistré dans mes prospects</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span>Ajouter à mes prospects</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
