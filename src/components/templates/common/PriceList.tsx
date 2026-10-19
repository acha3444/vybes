"use client"

import { useState, useMemo } from "react"
import { Clock } from "lucide-react"

export interface ServiceMenuItem {
  name: string
  price: string
  desc: string
  category?: string
  duration?: string
  badge?: string
}

interface PriceListProps {
  items: ServiceMenuItem[]
  primaryColor?: string
  themeMode?: "dark" | "light"
  headingFontClass?: string
  isPreview?: boolean
}

export default function PriceList({
  items,
  primaryColor = "#c2410c",
  themeMode = "dark",
  headingFontClass = "",
  isPreview = false,
}: PriceListProps) {
  // Détecter si les items ont des catégories
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(
        items
          .map((i) => i.category?.trim())
          .filter((c): c is string => Boolean(c && c.length > 0))
      )
    )
    return cats
  }, [items])

  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0] || "all"
  )

  const filteredItems = useMemo(() => {
    if (categories.length === 0 || activeCategory === "all") {
      return items
    }
    return items.filter((i) => i.category?.trim() === activeCategory)
  }, [items, categories, activeCategory])

  const isLight = themeMode === "light"

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ONGLETS DE CATÉGORIES (si 2+ catégories) */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? isLight
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                      : "bg-white text-neutral-950 border-white shadow-lg"
                    : isLight
                    ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200"
                    : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      )}

      {/* GRILLE OU LISTE D'ITEMS AVEC POINTS DE CONDUITE */}
      <div
        className={`grid ${
          isPreview
            ? "grid-cols-1 gap-3"
            : "grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
        }`}
      >
        {filteredItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={`group rounded-2xl transition duration-200 ${
              isPreview ? "py-2 px-2.5" : "py-3 px-3.5"
            } ${
              isLight
                ? "hover:bg-neutral-100/70"
                : "hover:bg-neutral-900/60"
            }`}
          >
            {/* Ligne Titre + Points de conduite + Prix */}
            <div className="flex items-baseline justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                <span
                  className={`font-bold tracking-tight truncate ${
                    isPreview
                      ? "text-xs max-w-[160px]"
                      : "text-sm sm:text-base max-w-xs"
                  } ${
                    isLight ? "text-neutral-900" : "text-white"
                  } ${headingFontClass}`}
                >
                  {item.name}
                </span>

                {item.badge && (
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0"
                    style={{
                      backgroundColor: `${primaryColor}20`,
                      color: primaryColor,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Ligne pointillée élégante / points de conduite */}
              <div
                className={`flex-1 mx-2 border-b border-dotted min-w-[24px] self-center opacity-30 ${
                  isLight ? "border-neutral-400" : "border-neutral-600"
                }`}
              />

              {/* Prix aligné à droite */}
              <span
                className="font-extrabold text-sm sm:text-base shrink-0 tracking-tight"
                style={{ color: primaryColor }}
              >
                {item.price}
              </span>
            </div>

            {/* Description et durée */}
            <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
              {item.desc && (
                <p
                  className={`leading-relaxed line-clamp-2 max-w-md ${
                    isLight ? "text-neutral-600" : "text-neutral-400"
                  }`}
                >
                  {item.desc}
                </p>
              )}

              {item.duration && (
                <span
                  className={`flex items-center gap-1 shrink-0 font-medium ml-auto ${
                    isLight ? "text-neutral-500" : "text-neutral-500"
                  }`}
                >
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{item.duration}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
