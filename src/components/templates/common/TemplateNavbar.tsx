"use client"

import { useState } from "react"
import { Menu, X, Phone, LucideIcon, Sparkles } from "lucide-react"
import { getContrastTextColor } from "@/lib/templates/colorUtils"
import { formatTelHref } from "@/lib/templates/phoneUtils"

interface NavLink {
  label: string
  href: string
}

interface TemplateNavbarProps {
  businessName: string
  tagline?: string
  phone: string
  primaryColor?: string
  icon?: LucideIcon
  links: NavLink[]
  ctaLabel?: string
  themeMode?: "dark" | "light"
  headingFontClass?: string
  isPreview?: boolean
}

export default function TemplateNavbar({
  businessName,
  tagline,
  phone,
  primaryColor = "#c2410c",
  icon: Icon = Sparkles,
  links,
  ctaLabel = "Réserver",
  themeMode = "dark",
  headingFontClass = "",
  isPreview = false,
}: TemplateNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isLight = themeMode === "light"
  const ctaTextColor = getContrastTextColor(primaryColor)

  return (
    <header
      className={`sticky top-0 z-40 transition-colors backdrop-blur-md border-b ${
        isLight
          ? "bg-white/90 border-neutral-200/80"
          : "bg-neutral-950/90 border-neutral-800/80"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto flex items-center justify-between gap-2.5 ${
          isPreview
            ? "h-16 px-3.5"
            : "h-16 sm:h-20 px-4 sm:px-8 lg:px-12"
        }`}
      >
        {/* LOGO & NOM DU COMMERCE (Gère les noms très longs proprement) */}
        <a
          href="#"
          className="flex items-center gap-2.5 min-w-0 flex-1 group"
          aria-label={businessName}
        >
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${primaryColor}20`,
              color: primaryColor,
              border: `1px solid ${primaryColor}40`,
            }}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={`block font-black tracking-tight truncate ${
                isPreview
                  ? "text-xs sm:text-sm max-w-[170px]"
                  : "text-sm sm:text-lg max-w-[180px] sm:max-w-sm"
              } ${isLight ? "text-neutral-950" : "text-white"} ${headingFontClass}`}
            >
              {businessName}
            </span>
            {tagline && (
              <span
                className={`block text-[10px] truncate ${
                  isPreview ? "max-w-[170px]" : "max-w-[180px] sm:max-w-xs"
                } ${isLight ? "text-neutral-500" : "text-neutral-400"}`}
              >
                {tagline}
              </span>
            )}
          </div>
        </a>

        {/* LIENS DE NAVIGATION DESKTOP */}
        {!isPreview && (
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition hover:text-white ${
                  isLight
                    ? "text-neutral-600 hover:text-neutral-950"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* CTA DESKTOP + BOUTON BURGER MOBILE */}
        <div className="flex items-center gap-2 shrink-0">
          {!isPreview && phone && (
            <a
              href={formatTelHref(phone)}
              style={{ backgroundColor: primaryColor, color: ctaTextColor }}
              className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-[8px] font-medium text-xs shadow-sm active:scale-95 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{ctaLabel}</span>
            </a>
          )}

          {/* Bouton burger mobile (Toujours visible en preview ou sur mobile réel) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className={`${
              isPreview ? "flex" : "flex md:hidden"
            } p-2 rounded-xl border transition cursor-pointer ${
              isLight
                ? "bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800"
                : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200"
            }`}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MENU DÉROULANT MOBILE */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-5 py-6 space-y-4 animate-in slide-in-from-top-3 duration-200 ${
            isLight
              ? "bg-white border-neutral-200"
              : "bg-neutral-950 border-neutral-800"
          }`}
        >
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl font-semibold text-sm transition ${
                  isLight
                    ? "text-neutral-800 hover:bg-neutral-100"
                    : "text-neutral-300 hover:bg-neutral-900"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {phone && (
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <a
                href={isPreview ? "#" : formatTelHref(phone)}
                onClick={() => setMobileMenuOpen(false)}
                style={{ backgroundColor: primaryColor, color: ctaTextColor }}
                className="w-full h-11 rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition"
              >
                <Phone className="w-4 h-4" />
                <span>{ctaLabel} • {phone}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
