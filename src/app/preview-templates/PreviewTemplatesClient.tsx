"use client"

import { useState, useEffect } from "react"
import { TEST_DEMO_CASES, TestDemoCase } from "@/lib/templates/testDatasets"
import RestaurantTemplate from "@/components/templates/RestaurantTemplate"
import BarberTemplate from "@/components/templates/BarberTemplate"
import BeautyTemplate from "@/components/templates/BeautyTemplate"
import DemoBanner from "@/components/templates/DemoBanner"
import {
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react"

const VIEWPORTS = [
  { width: 375, label: "375px (iPhone SE)", icon: Smartphone },
  { width: 390, label: "390px (iPhone 14/15)", icon: Smartphone },
  { width: 430, label: "430px (iPhone 15 Pro Max)", icon: Smartphone },
  { width: 768, label: "768px (iPad / Tablette)", icon: Tablet },
  { width: 1024, label: "1024px (Desktop Compact)", icon: Monitor },
  { width: 1440, label: "1440px (Grand Écran)", icon: Monitor },
]

export default function PreviewTemplatesClient() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("restaurant-complet")
  const [currentViewportWidth, setCurrentViewportWidth] = useState<number | "full">("full")
  const [auditResults, setAuditResults] = useState<{
    tested: boolean
    hasHorizontalOverflow: boolean
    scrollWidth: number
    innerWidth: number
    brokenImagesCount: number
  }>({
    tested: false,
    hasHorizontalOverflow: false,
    scrollWidth: 0,
    innerWidth: 0,
    brokenImagesCount: 0,
  })

  const currentCase = TEST_DEMO_CASES.find((c) => c.id === selectedCaseId) || TEST_DEMO_CASES[0]

  // Fonction d'audit automatique du DOM en direct
  const runDiagnostics = () => {
    const container = document.getElementById("template-render-container")
    const targetElement = container || document.documentElement

    const scrollW = targetElement.scrollWidth
    const clientW = targetElement.clientWidth
    const hasOverflow = scrollW > clientW + 2 // marge de 2px pour sous-pixels

    // Vérification des images cassées
    const imgs = Array.from(document.querySelectorAll("img"))
    const broken = imgs.filter((img) => !img.complete || img.naturalWidth === 0).length

    setAuditResults({
      tested: true,
      hasHorizontalOverflow: hasOverflow,
      scrollWidth: scrollW,
      innerWidth: clientW,
      brokenImagesCount: broken,
    })
  }

  useEffect(() => {
    // Exécuter l'audit après le rendu
    const timer = setTimeout(() => {
      runDiagnostics()
    }, 400)
    return () => clearTimeout(timer)
  }, [selectedCaseId, currentViewportWidth])

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      {/* BARRE D'OUTILS ET DE CONTRÔLE SUPÉRIEURE */}
      <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Titre */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                Laboratoire de Test & Validation des Templates
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Dev Mode
                </span>
              </h1>
              <p className="text-[11px] text-neutral-400">
                Audit en temps réel du scroll horizontal, des alignements et des images
              </p>
            </div>
          </div>

          {/* SÉLECTEUR DE JEU DE DONNÉES DE TEST */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium hidden sm:inline">Cas de test :</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              {TEST_DEMO_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.variant})
                </option>
              ))}
            </select>
          </div>

          {/* SÉLECTEUR DE LARGEUR D'ÉCRAN (RESPONSIVE) */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            {VIEWPORTS.map((vp) => {
              const Icon = vp.icon
              const isSelected = currentViewportWidth === vp.width
              return (
                <button
                  key={vp.width}
                  onClick={() => setCurrentViewportWidth(vp.width)}
                  title={vp.label}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{vp.width}px</span>
                </button>
              )
            })}
            <button
              onClick={() => setCurrentViewportWidth("full")}
              title="100% Pleine Largeur"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentViewportWidth === "full"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Plein écran</span>
            </button>
          </div>
        </div>

        {/* BANDEAU DE RÉSULTAT DU DIAGNOSTIC AUTOMATIQUE */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 font-medium">Statut de conformité :</span>
            {auditResults.hasHorizontalOverflow ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Décalage détecté : scrollWidth ({auditResults.scrollWidth}px) &gt; clientWidth ({auditResults.innerWidth}px)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zéro scroll horizontal (Conforme)
              </span>
            )}

            {auditResults.brokenImagesCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {auditResults.brokenImagesCount} {auditResults.brokenImagesCount > 1 ? "images avec fallback" : "image avec fallback"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-[11px] italic">
              {currentCase.description}
            </span>
            <button
              onClick={runDiagnostics}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              title="Relancer le diagnostic"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ZONE D'AFFICHAGE DU TEMPLATE */}
      <main className="flex-1 p-2 sm:p-6 flex justify-center items-start bg-neutral-950 overflow-auto">
        <div
          id="template-render-container"
          style={{
            width: currentViewportWidth === "full" ? "100%" : `${currentViewportWidth}px`,
            maxWidth: "100%",
            transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`relative bg-neutral-950 shadow-2xl transition-all duration-300 ${
            currentViewportWidth !== "full"
              ? "border border-neutral-800 rounded-3xl overflow-hidden ring-12 ring-neutral-900/80 my-4"
              : ""
          }`}
        >
          {/* Bannière de démo toujours présente */}
          <DemoBanner expiresInDays={14} />

          {/* Rendu dynamique du template selon la catégorie */}
          {currentCase.category === "restaurant" && (
            <RestaurantTemplate content={currentCase.content} isPreview={false} />
          )}

          {currentCase.category === "barber" && (
            <BarberTemplate content={currentCase.content} isPreview={false} />
          )}

          {currentCase.category === "beauty" && (
            <BeautyTemplate content={currentCase.content} isPreview={false} />
          )}
        </div>
      </main>
    </div>
  )
}
