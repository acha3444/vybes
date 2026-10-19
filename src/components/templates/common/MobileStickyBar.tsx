"use client"

import { Phone, MapPin, Calendar, Utensils, Scissors, Sparkles } from "lucide-react"
import { getContrastTextColor } from "@/lib/templates/colorUtils"

interface MobileStickyBarProps {
  phone: string
  address: string
  businessName: string
  primaryColor: string
  ctaType?: "reserve_table" | "order" | "book_appointment" | "book_treatment"
  isPreview?: boolean
}

export default function MobileStickyBar({
  phone,
  address,
  businessName,
  primaryColor,
  ctaType = "book_appointment",
  isPreview = false,
}: MobileStickyBarProps) {
  const textColor = getContrastTextColor(primaryColor)

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${businessName} ${address}`
  )}`

  let ctaLabel = "Réserver"
  let CtaIcon = Calendar

  if (ctaType === "reserve_table") {
    ctaLabel = "Réserver"
    CtaIcon = Utensils
  } else if (ctaType === "order") {
    ctaLabel = "Commander"
    CtaIcon = Utensils
  } else if (ctaType === "book_appointment") {
    ctaLabel = "Prendre RDV"
    CtaIcon = Scissors
  } else if (ctaType === "book_treatment") {
    ctaLabel = "Prendre RDV"
    CtaIcon = Sparkles
  }

  return (
    <div
      className={`${
        isPreview ? "absolute" : "fixed"
      } bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] md:hidden shadow-[0_-8px_25px_rgba(0,0,0,0.4)]`}
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* BOUTON APPEL (48px de haut min) */}
        <a
          href={isPreview ? "#" : `tel:${phone}`}
          className="h-12 px-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shrink-0 active:scale-95 transition"
          aria-label="Appeler l'établissement"
        >
          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="hidden min-[380px]:inline">Appeler</span>
        </a>

        {/* BOUTON ITINÉRAIRE (48px de haut min) */}
        <a
          href={isPreview ? "#" : mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 px-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shrink-0 active:scale-95 transition"
          aria-label="Ouvrir l'itinéraire Google Maps"
        >
          <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="hidden min-[380px]:inline">Itinéraire</span>
        </a>

        {/* BOUTON CTA PRINCIPAL (Prendre RDV / Réserver / Commander) */}
        <a
          href={isPreview ? "#" : `tel:${phone}`}
          style={{ backgroundColor: primaryColor, color: textColor }}
          className="flex-1 h-12 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition truncate"
        >
          <CtaIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">{ctaLabel}</span>
        </a>
      </div>
    </div>
  )
}
