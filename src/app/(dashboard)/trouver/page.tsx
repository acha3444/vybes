"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlaceResult } from "@/lib/google-places"
import { normalizeBusinessName, normalizeCityName } from "@/lib/templates/nameUtils"
import {
  Search,
  MapPin,
  Star,
  Compass,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react"

const QUICK_CITIES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Bordeaux",
  "Lille",
  "Toulouse",
  "Nantes",
  "Nice",
  "Montpellier",
  "Strasbourg",
  "Rennes",
]

const CATEGORIES = [
  { id: "all", label: "Toutes les catégories" },
  { id: "restaurant", label: "Restaurants" },
  { id: "barber", label: "Coiffure & Barbers" },
  { id: "beauty", label: "Instituts de beauté" },
]

export default function TrouverPage() {
  const router = useRouter()
  const [city, setCity] = useState("Lyon")
  const [category, setCategory] = useState<"all" | "restaurant" | "barber" | "beauty">("all")
  const [includeSurroundings, setIncludeSurroundings] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PlaceResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [searchedCity, setSearchedCity] = useState("")
  const [savingPlaceId, setSavingPlaceId] = useState<string | null>(null)
  const [savedProspectMap, setSavedProspectMap] = useState<Record<string, boolean>>({})
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null)
  const [dailyLimit, setDailyLimit] = useState(30)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isQuotaReached, setIsQuotaReached] = useState(false)
  const [searchSource, setSearchSource] = useState<"google_places_api" | "sirene_entreprises">("google_places_api")

  // Chargement des prospects existants pour identifier ceux déjà prospectés
  useEffect(() => {
    fetch("/api/prospects")
      .then((res) => res.json())
      .then((data) => {
        if (data.prospects && Array.isArray(data.prospects)) {
          const map: Record<string, boolean> = {}
          data.prospects.forEach((p: any) => {
            if (p.google_place_id) map[p.google_place_id] = true
            if (p.name) map[p.name.trim().toLowerCase()] = true
          })
          setSavedProspectMap(map)
        }
      })
      .catch(() => {})
  }, [])

  // Recherche initiale automatique
  useEffect(() => {
    handleSearch("Lyon", "all", false)
  }, [])

  async function handleSearch(
    targetCity = city,
    targetCategory = category,
    targetSurroundings = includeSurroundings
  ) {
    const trimmed = targetCity.trim()
    if (!trimmed) return

    setLoading(true)
    setSearchError(null)
    setIsQuotaReached(false)
    setHasSearched(true)

    try {
      const res = await fetch(
        `/api/places/search?city=${encodeURIComponent(trimmed)}&category=${targetCategory}&includeSurroundings=${targetSurroundings}`
      )
      const data = await res.json()

      if (res.status === 429 || data.error === "quota_reached") {
        setIsQuotaReached(true)
        setSearchError(data.message || "Quota quotidien atteint. Revenez demain.")
        setResults([])
        if (typeof data.remaining === "number") setRemainingSearches(data.remaining)
        return
      }

      if (!res.ok || data.error) {
        setSearchError(data.error || "Erreur lors de la récupération des commerces.")
        setResults([])
        return
      }

      if (data.places) {
        setResults(data.places)
        setSearchedCity(data.cityDisplay || normalizeCityName(trimmed))
      }
      if (data.source) {
        setSearchSource(data.source)
      }
      if (typeof data.remaining === "number") {
        setRemainingSearches(data.remaining)
      }
      if (typeof data.limit === "number") {
        setDailyLimit(data.limit)
      }
    } catch (err) {
      console.error("Erreur de recherche :", err)
      setSearchError("Impossible de joindre le serveur. Vérifie ta connexion et réessaie.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateDemo(place: PlaceResult) {
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

      if (data.success && data.prospectId) {
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

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER AVEC TITRE ET SOURCE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDEF]">
            Trouver un commerce
          </h1>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Détecte les commerces établis sans site web officiel dans n&apos;importe quelle ville.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {remainingSearches !== null && (
            <span className="text-[11px] text-[#A0A0A8] bg-[#17171A] border border-[#2A2A2F] px-2.5 py-1 rounded-[6px] tabular-nums">
              {remainingSearches} / {dailyLimit} recherches restantes
            </span>
          )}
          {searchSource === "google_places_api" ? (
            <span className="text-[11px] text-[#6E6E76]">
              Données issues de Google Maps
            </span>
          ) : (
            <span className="text-[11px] text-[#A0A0A8] bg-[#1E1E22] px-2 py-0.5 rounded-[4px] border border-[#2A2A2F]">
              Base Entreprises (INSEE)
            </span>
          )}
        </div>
      </div>

      {/* FORMULAIRE DE RECHERCHE */}
      <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-5 space-y-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          {/* Champ Ville avec liste d'autocomplétion */}
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-[#6E6E76] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              list="popular-cities-list"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Saisis une ville (ex : Lyon, Bordeaux, Nantes…)"
              className="w-full h-10 pl-9 pr-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs sm:text-sm text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7] transition-colors"
            />
            <datalist id="popular-cities-list">
              {QUICK_CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* Bouton de recherche */}
          <button
            type="submit"
            disabled={loading}
            className="h-10 px-5 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Rechercher</span>
          </button>
        </form>

        {/* Option d'élargissement et catégories */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Segments de catégories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  const newCat = cat.id as any
                  setCategory(newCat)
                  handleSearch(city, newCat, includeSurroundings)
                }}
                className={`h-8 px-3 rounded-[6px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  category === cat.id
                    ? "bg-[#6C5CE7] text-white"
                    : "bg-[#1E1E22] text-[#A0A0A8] hover:text-[#EDEDEF] border border-[#2A2A2F]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Option inclure les communes voisines */}
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#A0A0A8] hover:text-[#EDEDEF] select-none shrink-0">
            <input
              type="checkbox"
              checked={includeSurroundings}
              onChange={(e) => {
                const checked = e.target.checked
                setIncludeSurroundings(checked)
                handleSearch(city, category, checked)
              }}
              className="rounded-[4px] border-[#2A2A2F] bg-[#1E1E22] text-[#6C5CE7] focus:ring-0 cursor-pointer accent-[#6C5CE7]"
            />
            <span>Inclure les communes voisines</span>
          </label>
        </div>

        {/* Villes rapides */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#2A2A2F] scrollbar-none text-[11px] text-[#6E6E76]">
          <span className="shrink-0 mr-1">Villes suggérées :</span>
          {QUICK_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCity(c)
                handleSearch(c, category, includeSurroundings)
              }}
              className={`px-2 py-0.5 rounded-[4px] transition-colors cursor-pointer ${
                city.toLowerCase() === c.toLowerCase()
                  ? "bg-[#1E1E22] text-[#6C5CE7] font-semibold"
                  : "text-[#A0A0A8] hover:text-[#EDEDEF]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ÉTAT 1 : QUOTA ATTEINT */}
      {isQuotaReached && (
        <div className="p-5 rounded-[12px] bg-[#17171A] border border-amber-500/30 text-amber-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Quota de recherches atteint</span>
          </div>
          <p className="text-xs text-[#A0A0A8] leading-relaxed">
            Pour garantir une utilisation équitable de l&apos;outil, chaque compte dispose de {dailyLimit} recherches par jour. Ton quota sera automatiquement réinitialisé demain matin. En attendant, tu peux exploiter les commerces déjà enregistrés dans ton espace prospects.
          </p>
        </div>
      )}

      {/* ÉTAT 2 : ERREUR API */}
      {!isQuotaReached && searchError && (
        <div className="p-5 rounded-[12px] bg-[#17171A] border border-red-500/30 text-xs text-[#EDEDEF] space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Erreur de recherche</span>
          </div>
          <p className="text-[#A0A0A8] leading-relaxed">
            {searchError}
          </p>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] border border-[#2A2A2F] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* ÉTAT 3 : CHARGEMENT AVEC SQUELETTE DE LISTE */}
      {loading && (
        <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] divide-y divide-[#2A2A2F] overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-3.5 sm:p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-44 bg-[#1E1E22] rounded-[4px]" />
                  <div className="h-4 w-16 bg-[#1E1E22] rounded-[4px]" />
                </div>
                <div className="h-3 w-56 bg-[#1E1E22]/60 rounded-[4px]" />
              </div>
              <div className="h-8 w-24 bg-[#1E1E22] rounded-[6px] shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* ÉTAT 4 : AVANT PREMIÈRE RECHERCHE */}
      {!loading && !hasSearched && (
        <div className="p-5 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] space-y-3">
          <span className="text-[11px] font-semibold text-[#A0A0A8] uppercase tracking-wider block">
            Mode d&apos;emploi
          </span>
          <div className="space-y-2 text-xs text-[#A0A0A8]">
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-[4px] bg-[#1E1E22] text-[#EDEDEF] flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
              <span>Entre le nom de ta ville ou d&apos;une commune proche.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-[4px] bg-[#1E1E22] text-[#EDEDEF] flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
              <span>Vybe filtre automatiquement les commerces bien notés sans site web officiel.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-[4px] bg-[#1E1E22] text-[#EDEDEF] flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
              <span>Clique sur « Créer la démo » pour générer un site mobile prêt à envoyer en 60 secondes.</span>
            </p>
          </div>
        </div>
      )}

      {/* ÉTAT 5 : ZÉRO RÉSULTAT */}
      {!loading && !searchError && hasSearched && results.length === 0 && (
        <div className="py-12 text-center bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-6 space-y-2">
          <Compass className="w-10 h-10 text-[#6E6E76] mx-auto mb-1" />
          <h3 className="text-sm font-semibold text-[#EDEDEF]">
            Aucun commerce sans site trouvé pour cette catégorie à {searchedCity}
          </h3>
          <p className="text-xs text-[#A0A0A8] max-w-md mx-auto leading-relaxed">
            Essaie d&apos;élargir aux communes voisines ou de basculer sur « Toutes les catégories ».
          </p>
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setCategory("all")
                handleSearch(city, "all", includeSurroundings)
              }}
              className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] border border-[#2A2A2F] text-xs font-medium transition-colors cursor-pointer"
            >
              Toutes les catégories
            </button>
            {!includeSurroundings && (
              <button
                type="button"
                onClick={() => {
                  setIncludeSurroundings(true)
                  handleSearch(city, category, true)
                }}
                className="h-8 px-3 rounded-[6px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Inclure les communes voisines
              </button>
            )}
          </div>
        </div>
      )}

      {/* ÉTAT 6 : LISTE DENSE DES RÉSULTATS */}
      {!loading && !searchError && results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#A0A0A8] px-1">
            <span>
              <strong className="text-[#EDEDEF] tabular-nums font-semibold">{results.length}</strong> commerce{results.length > 1 ? "s" : ""} sans site web {includeSurroundings ? "à et autour de" : "à"} {searchedCity}
            </span>
            <span className="text-[#6E6E76]">Triés par nombre d&apos;avis</span>
          </div>

          <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] divide-y divide-[#2A2A2F] overflow-hidden">
            {results.map((place) => {
              const isSaving = savingPlaceId === place.id
              const isAlreadyProspect =
                Boolean(savedProspectMap[place.id]) ||
                Boolean(savedProspectMap[place.name.trim().toLowerCase()])

              const categoryBadge = place.categoryDisplay || (
                place.category === "restaurant"
                  ? "Restaurant"
                  : place.category === "barber"
                  ? "Coiffure"
                  : "Institut"
              )

              return (
                <div
                  key={place.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1E1E22]/50 transition-colors"
                >
                  {/* INFOS DU COMMERCE */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[#EDEDEF] truncate" title={place.name}>
                        {normalizeBusinessName(place.name)}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-[#1E1E22] text-[#A0A0A8] border border-[#2A2A2F] shrink-0 whitespace-nowrap">
                        {categoryBadge}
                      </span>
                      {isAlreadyProspect && (
                        <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium shrink-0 whitespace-nowrap">
                          Déjà dans tes prospects
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#6E6E76] mt-1 flex-wrap">
                      <span>{place.city}</span>
                      {place.rating !== null && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#EDEDEF] tabular-nums">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{place.rating.toFixed(1)}</span>
                            <span className="text-[#6E6E76]">({place.userRatingsTotal} avis)</span>
                          </span>
                        </>
                      )}
                      {place.phone ? (
                        <>
                          <span>•</span>
                          <span className="text-[#A0A0A8]">{place.phone}</span>
                        </>
                      ) : (
                        <>
                          <span>•</span>
                          <span className="text-[#6E6E76]">Tél. non renseigné</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ACTION : CRÉER DÉMO (STYLE SECONDAIRE / CONTOUR) OU VOIR */}
                  <div className="shrink-0 self-start sm:self-center">
                    {isAlreadyProspect ? (
                      <Link
                        href={`/prospects?search=${encodeURIComponent(place.name)}`}
                        className="h-8 px-3 rounded-[8px] text-xs font-medium transition-colors flex items-center gap-1.5 border border-[#2A2A2F] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF]"
                      >
                        <span>Voir</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#6E6E76]" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleCreateDemo(place)}
                        className="h-8 px-3.5 rounded-[8px] text-xs font-medium transition-colors flex items-center gap-1.5 border border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white disabled:opacity-50 cursor-pointer"
                      >
                        {isSaving ? (
                          <span>Création…</span>
                        ) : (
                          <>
                            <span>Créer la démo</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
