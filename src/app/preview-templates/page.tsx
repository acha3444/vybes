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

export default function PreviewTemplatesPage() {
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
    // Si dans un iframe ou conteneur
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
    const timer = setTimeout(runDiagnostics, 400)
    return () => clearTimeout(timer)
  }, [selectedCaseId, currentViewportWidth])

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col">
      {/* 1. BARRE DE CONTRÔLE SUPÉRIEURE FLOTTANTE */}
      <header className="sticky top-0 z-50 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 p-3 sm:px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo et cas d'usage */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 shrink-0 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio 1500€</span>
            </span>

            {/* Sélecteur des 6 cas d'usage */}
            <div className="flex items-center gap-1.5 shrink-0">
              {TEST_DEMO_CASES.map((item) => {
                const isSelected = item.id === selectedCaseId
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? "bg-white text-neutral-950 border-white shadow-md scale-102"
                        : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                    }`}
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sélecteur de viewport responsive (375, 390, 430, 768, 1024, 1440, full) */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto w-full md:w-auto justify-start md:justify-end pb-1 md:pb-0">
            {VIEWPORTS.map((vp) => (
              <button
                key={vp.width}
                onClick={() => setCurrentViewportWidth(vp.width)}
                title={vp.label}
                type="button"
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  currentViewportWidth === vp.width
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                    : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800"
                }`}
              >
                <vp.icon className="w-3.5 h-3.5" />
                <span>{vp.width}px</span>
              </button>
            ))}

            <button
              onClick={() => setCurrentViewportWidth("full")}
              type="button"
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                currentViewportWidth === "full"
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Plein écran</span>
            </button>
          </div>
        </div>

        {/* BANDEAU DE DIAGNOSTIC AUTOMATIQUE */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-300">
              {currentCase.name} :
            </span>
            <span className="text-neutral-400 text-[11px]">
              {currentCase.description}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {auditResults.tested && (
              <>
                {!auditResults.hasHorizontalOverflow ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>0 décalage horizontal (scrollWidth: {auditResults.scrollWidth}px)</span>
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Débordement détecté : {auditResults.scrollWidth}px vs {auditResults.innerWidth}px</span>
                  </span>
                )}

                {auditResults.brokenImagesCount === 0 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>0 image cassée</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{auditResults.brokenImagesCount} image(s) sans retour</span>
                  </span>
                )}
              </>
            )}

            <button
              onClick={runDiagnostics}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Relancer le diagnostic"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. ZONE D'AFFICHAGE DU TEMPLATE (Simulateur ou Plein Écran) */}
      <div className="flex-1 flex justify-center items-start p-0 sm:py-6 bg-neutral-950 overflow-x-auto">
        <div
          id="template-render-container"
          style={{
            width: currentViewportWidth === "full" ? "100%" : `${currentViewportWidth}px`,
            maxWidth: "100%",
          }}
          className={`transition-all duration-300 relative ${
            currentViewportWidth !== "full"
              ? "rounded-3xl border-4 border-neutral-700 shadow-2xl overflow-hidden my-4 bg-black"
              : "w-full"
          }`}
        >
          {/* Bandeau de démo officiel */}
          <DemoBanner expiresInDays={14} />

          {/* Rendu du template actif */}
          {currentCase.category === "restaurant" && (
            <RestaurantTemplate content={currentCase.content} isPreview={currentViewportWidth !== "full"} />
          )}

          {currentCase.category === "barber" && (
            <BarberTemplate content={currentCase.content} isPreview={currentViewportWidth !== "full"} />
          )}

          {currentCase.category === "beauty" && (
            <BeautyTemplate content={currentCase.content} isPreview={currentViewportWidth !== "full"} />
          )}
        </div>
      </div>
    </div>
  )
}
