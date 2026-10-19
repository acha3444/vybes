"use client"

import { useEffect, useRef } from "react"
import { PlaceResult } from "@/lib/google-places"
import "leaflet/dist/leaflet.css"

interface PlacesMapProps {
  places: PlaceResult[]
  selectedPlaceId?: string | null
  onSelectPlace?: (place: PlaceResult) => void
}

export default function PlacesMap({
  places,
  selectedPlaceId,
  onSelectPlace,
}: PlacesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === "undefined") return

    let isMounted = true

    // Import dynamique de Leaflet côté client
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return

      // Détermine le centre moyen de la carte
      let centerLat = 48.8566
      let centerLng = 2.3522

      const validCoords = places.filter((p) => p.location?.latitude && p.location?.longitude)

      if (validCoords.length > 0) {
        centerLat =
          validCoords.reduce((acc, p) => acc + (p.location?.latitude || 0), 0) /
          validCoords.length
        centerLng =
          validCoords.reduce((acc, p) => acc + (p.location?.longitude || 0), 0) /
          validCoords.length
      }

      // Initialisation de la carte si pas déjà fait
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
        }).setView([centerLat, centerLng], 13)

        // Ajout du contrôle de zoom en haut à droite
        L.control.zoom({ position: "topright" }).addTo(map)

        // Tuiles OpenStreetMap officielles 100% gratuites et sans filigrane
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map)

        mapInstanceRef.current = map
      } else {
        mapInstanceRef.current.setView([centerLat, centerLng], 13)
      }

      // Nettoyage des anciens marqueurs
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      // Création d'icônes personnalisées par catégorie
      validCoords.forEach((place) => {
        const isSelected = selectedPlaceId === place.id

        const categoryEmoji =
          place.category === "restaurant"
            ? "🍽️"
            : place.category === "barber"
            ? "✂️"
            : "💅"

        const markerHtml = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? "44px" : "36px"};
            height: ${isSelected ? "44px" : "36px"};
            background: ${isSelected ? "#6366f1" : "#18181b"};
            color: white;
            border-radius: 9999px;
            border: 2px solid ${isSelected ? "#ffffff" : "#a855f7"};
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            font-size: ${isSelected ? "18px" : "15px"};
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ${categoryEmoji}
          </div>
        `

        const customIcon = L.divIcon({
          html: markerHtml,
          className: "custom-marker-icon",
          iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
          iconAnchor: [isSelected ? 22 : 18, isSelected ? 22 : 18],
        })

        const marker = L.marker(
          [place.location!.latitude, place.location!.longitude],
          { icon: customIcon }
        ).addTo(mapInstanceRef.current)

        // Popup d'information
        const popupContent = `
          <div style="font-family: inherit; padding: 4px; color: #111;">
            <strong style="font-size: 13px; display: block; margin-bottom: 2px;">${place.name}</strong>
            <span style="font-size: 11px; color: #d97706; font-weight: bold;">★ ${place.rating || "Nouveau"} (${place.userRatingsTotal} avis)</span>
            <p style="font-size: 11px; color: #666; margin: 4px 0 0 0;">${place.address}</p>
            <span style="display: inline-block; margin-top: 6px; padding: 2px 6px; background: #fee2e2; color: #b91c1c; font-size: 10px; font-weight: bold; border-radius: 4px;">SANS SITE WEB</span>
          </div>
        `
        marker.bindPopup(popupContent)

        marker.on("click", () => {
          if (onSelectPlace) {
            onSelectPlace(place)
          }
        })

        markersRef.current.push(marker)
      })
    })

    return () => {
      isMounted = false
    }
  }, [places, selectedPlaceId, onSelectPlace])

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-neutral-800 shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <div className="absolute bottom-3 left-3 z-20 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-neutral-300 flex items-center gap-2 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Commerces sans site web localisés</span>
      </div>
    </div>
  )
}
