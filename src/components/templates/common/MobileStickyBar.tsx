"use client"

import { Phone, MapPin, Calendar, Utensils, Scissors, Sparkles } from "lucide-react"
import { getContrastTextColor } from "@/lib/templates/colorUtils"
import { formatTelHref } from "@/lib/templates/phoneUtils"

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
  const telHref = isPreview ? "#" : formatTelHref(phone)

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
        isPreview ? "sticky bottom-0 z-40 block" : "fixed bottom-0 z-40 md:hidden"
      } left-0 right-0 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-3 py-2.5 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-8px_25px_rgba(0,0,0,0.4)]`}
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* BOUTON APPEL */}
        <a
          href={telHref}
          className="h-11 sm:h-12 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition"
          aria-label="Appeler l'établissement"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px]">Appel</span>
        </a>

        {/* BOUTON ITINÉRAIRE */}
        <a
          href={isPreview ? "#" : mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 sm:h-12 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition"
          aria-label="Ouvrir l'itinéraire Google Maps"
        >
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="text-[11px]">Plan</span>
        </a>

        {/* BOUTON CTA PRINCIPAL */}
        <a
          href={telHref}
          style={{ backgroundColor: primaryColor, color: textColor }}
          className="flex-1 h-11 sm:h-12 px-3 rounded-[8px] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition truncate"
        >
          <CtaIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{ctaLabel}</span>
        </a>
      </div>
    </div>
  )
}
