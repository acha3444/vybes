"use client"

import { Star, ShieldCheck, HeartHandshake, Award } from "lucide-react"

interface ReviewsCardProps {
  businessName: string
  rating?: number
  ratingsTotal?: number
  primaryColor?: string
  themeMode?: "dark" | "light"
  headingFontClass?: string
  isPreview?: boolean
}

export default function ReviewsCard({
  businessName,
  rating = 4.9,
  ratingsTotal = 180,
  primaryColor = "#c2410c",
  themeMode = "dark",
  headingFontClass = "",
  isPreview = false,
}: ReviewsCardProps) {
  const isLight = themeMode === "light"
  const formattedRating = Number(rating || 4.9).toFixed(1)
  const formattedCount = ratingsTotal || 180

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden relative ${
        isPreview ? "p-4 sm:p-6" : "p-6 sm:p-10"
      } ${
        isLight
          ? "bg-white border-neutral-200"
          : "bg-neutral-900/90 border-neutral-800"
      }`}
    >
      <div
        className={`grid items-center ${
          isPreview ? "grid-cols-1 gap-5" : "grid-cols-1 md:grid-cols-12 gap-8"
        }`}
      >
        {/* Colonne Note globale */}
        <div
          className={`${
            isPreview
              ? "border-b pb-4 text-center"
              : "md:col-span-5 text-center md:text-left md:border-r md:border-neutral-200 dark:md:border-neutral-800 md:pr-8"
          }`}
        >
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span
              className={`font-black tracking-tight ${
                isPreview ? "text-3xl" : "text-4xl sm:text-5xl"
              } ${isLight ? "text-neutral-950" : "text-white"} ${headingFontClass}`}
            >
              {formattedRating}
            </span>
            <span className="text-neutral-500 font-bold text-base sm:text-lg">/ 5</span>
          </div>

          <p
            className={`mt-1 sm:mt-2 font-semibold text-xs sm:text-sm ${
              isLight ? "text-neutral-800" : "text-neutral-200"
            }`}
          >
            Excellente réputation locale
          </p>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
            Basé sur plus de {formattedCount} avis vérifiés
          </p>
        </div>

        {/* Colonne Piliers de confiance */}
        <div
          className={`${
            isPreview
              ? "grid grid-cols-1 gap-2.5"
              : "md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4"
          }`}
        >
          <div
            className={`p-4 rounded-2xl border ${
              isLight
                ? "bg-neutral-50 border-neutral-200/80"
                : "bg-neutral-950/60 border-neutral-800/80"
            }`}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              <Award className="w-4 h-4" />
            </div>
            <h4
              className={`font-bold text-xs ${
                isLight ? "text-neutral-900" : "text-white"
              }`}
            >
              Savoir-faire
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Exigence et passion du geste au quotidien.
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isLight
                ? "bg-neutral-50 border-neutral-200/80"
                : "bg-neutral-950/60 border-neutral-800/80"
            }`}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4
              className={`font-bold text-xs ${
                isLight ? "text-neutral-900" : "text-white"
              }`}
            >
              Accueil chaleureux
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Écoute, attention et convivialité assurées.
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isLight
                ? "bg-neutral-50 border-neutral-200/80"
                : "bg-neutral-950/60 border-neutral-800/80"
            }`}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4
              className={`font-bold text-xs ${
                isLight ? "text-neutral-900" : "text-white"
              }`}
            >
              Qualité certifiée
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Produits rigoureusement sélectionnés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
