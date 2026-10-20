"use client"

import { Star, MessageSquare } from "lucide-react"

interface ReviewsCardProps {
  businessName: string
  rating?: number | null
  ratingsTotal?: number | null
  primaryColor?: string
  themeMode?: "dark" | "light"
  headingFontClass?: string
  isPreview?: boolean
}

export default function ReviewsCard({
  businessName,
  rating,
  ratingsTotal,
  primaryColor = "#c2410c",
  themeMode = "dark",
  headingFontClass = "",
  isPreview = false,
}: ReviewsCardProps) {
  const isLight = themeMode === "light"
  const numRating = typeof rating === "number" ? rating : Number(rating)
  const hasRating = !isNaN(numRating) && numRating > 0

  // Règle stricte : si pas de note réelle, on masque totalement la section
  if (!hasRating) {
    return null
  }

  const formattedRating = numRating.toFixed(1)
  const numCount = typeof ratingsTotal === "number" ? ratingsTotal : Number(ratingsTotal)
  const hasCount = !isNaN(numCount) && numCount > 0

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border shadow-xl overflow-hidden relative ${
        isPreview ? "p-5" : "p-6 sm:p-10"
      } ${
        isLight
          ? "bg-white border-neutral-200"
          : "bg-neutral-900/90 border-neutral-800"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10">
        {/* Note et étoiles */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-tight ${
                isPreview ? "text-4xl" : "text-5xl sm:text-6xl"
              } ${isLight ? "text-neutral-950" : "text-white"} ${headingFontClass}`}
            >
              {formattedRating}
            </span>
            <span className="text-neutral-500 font-bold text-lg sm:text-xl">/ 5</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    s <= Math.round(numRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-600"
                  }`}
                />
              ))}
            </div>

            <p
              className={`font-bold text-sm sm:text-base ${
                isLight ? "text-neutral-900" : "text-white"
              }`}
            >
              Avis clients
            </p>
          </div>
        </div>

        {/* Détail réel du nombre d'avis */}
        <div className="flex items-center gap-3 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-neutral-200 dark:border-neutral-800 pt-4 sm:pt-0 sm:pl-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 hidden sm:flex"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            <MessageSquare className="w-5 h-5" />
          </div>

          <div>
            <p
              className={`font-bold text-xs sm:text-sm ${
                isLight ? "text-neutral-800" : "text-neutral-200"
              }`}
            >
              {hasCount
                ? `${numCount} ${numCount > 1 ? "avis déposés" : "avis déposé"}`
                : "Note globale des clients"}
            </p>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
              Basé sur les avis clients déposés
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
