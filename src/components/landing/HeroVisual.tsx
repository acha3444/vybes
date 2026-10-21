"use client"

import { useState } from "react"
import { Search, Smartphone, MessageSquare, Star, MapPin, Phone, Clock, ArrowRight, Check } from "lucide-react"

export function HeroVisual() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)

  return (
    <div className="w-full max-w-[460px] mx-auto bg-[#17171A] border border-[#2A2A2F] rounded-[12px] overflow-hidden shadow-xl">
      {/* Barre d'onglets de navigation entre les 3 étapes réelles */}
      <div className="flex border-b border-[#2A2A2F] bg-[#0F0F11] text-xs">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className={`flex-1 py-2.5 px-3 font-medium flex items-center justify-center gap-1.5 transition-colors border-r border-[#2A2A2F] ${
            activeStep === 1
              ? "bg-[#17171A] text-[#EDEDEF]"
              : "text-[#6E6E76] hover:text-[#A0A0A8]"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>1. Recherche</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className={`flex-1 py-2.5 px-3 font-medium flex items-center justify-center gap-1.5 transition-colors border-r border-[#2A2A2F] ${
            activeStep === 2
              ? "bg-[#17171A] text-[#EDEDEF]"
              : "text-[#6E6E76] hover:text-[#A0A0A8]"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>2. Démo</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className={`flex-1 py-2.5 px-3 font-medium flex items-center justify-center gap-1.5 transition-colors ${
            activeStep === 3
              ? "bg-[#17171A] text-[#EDEDEF]"
              : "text-[#6E6E76] hover:text-[#A0A0A8]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>3. Message</span>
        </button>
      </div>

      {/* Contenu réel de l'étape sélectionnée */}
      <div className="p-4 sm:p-5 min-h-[360px] flex flex-col justify-between">
        {activeStep === 1 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-[#A0A0A8] pb-1 border-b border-[#2A2A2F]">
              <span className="flex items-center gap-1 text-[#EDEDEF] font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#6C5CE7]" />
                Lyon • Restaurants sans site
              </span>
              <span className="text-[#6E6E76] tabular-nums">28 trouvés</span>
            </div>

            {/* Fausse liste d'un commerce réel avec ses vraies métadonnées */}
            <div className="p-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm text-[#EDEDEF]">
                    Bistrot Saint-Paul
                  </h4>
                  <p className="text-[11px] text-[#A0A0A8]">
                    Restaurant français • 18 rue Juiverie, 69005 Lyon
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium whitespace-nowrap">
                  Aucun site officiel
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs text-[#EDEDEF] tabular-nums">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">4.7</span>
                  <span className="text-[#6E6E76]">(74 avis Google)</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="h-7 px-2.5 rounded-[6px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Créer la démo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-[8px] bg-[#1E1E22]/60 border border-[#2A2A2F]/60 space-y-2 opacity-75">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm text-[#EDEDEF]">
                    L&apos;Ardoise des Halles
                  </h4>
                  <p className="text-[11px] text-[#A0A0A8]">
                    Bistrot de quartier • 102 cours Lafayette, 69003 Lyon
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium whitespace-nowrap">
                  Aucun site officiel
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#EDEDEF] tabular-nums">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-semibold">4.6</span>
                <span className="text-[#6E6E76]">(42 avis)</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-3 animate-fade-in">
            {/* Aperçu du rendu mobile */}
            <div className="rounded-[8px] border border-[#2A2A2F] bg-[#111114] p-3 text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#A0A0A8] pb-1 border-b border-[#2A2A2F]">
                <span>Démo générée automatiquement</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3" />
                  Prête
                </span>
              </div>

              <div className="rounded-[8px] bg-stone-900 text-stone-100 p-4 space-y-2 border border-stone-800">
                <span className="text-[10px] text-amber-400 font-medium block">
                  Bistrot traditionnel • Lyon 5e
                </span>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Bistrot Saint-Paul
                </h4>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Cuisine de marché, produits frais du terroir lyonnais.
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <div className="h-7 px-3 rounded-[6px] bg-[#c2410c] text-white text-[11px] font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Appeler • 04 78 28 00 00</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A0A0A8]">
                <div className="p-2 rounded-[6px] bg-[#17171A] border border-[#2A2A2F]">
                  <Clock className="w-3 h-3 text-[#EDEDEF] mb-1" />
                  <span>Mar - Sam : 12h-14h30 • 19h-22h</span>
                </div>
                <div className="p-2 rounded-[6px] bg-[#17171A] border border-[#2A2A2F]">
                  <MapPin className="w-3 h-3 text-[#EDEDEF] mb-1" />
                  <span>18 rue Juiverie, Lyon 5e</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="w-full h-8 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center justify-center gap-1.5 border border-[#2A2A2F] transition-colors"
            >
              <span>Voir le message de prospection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-[#A0A0A8] pb-1 border-b border-[#2A2A2F]">
              <span className="text-[#EDEDEF] font-medium">Message SMS / DM Instagram</span>
              <span className="text-[#6E6E76]">Personnalisé automatiquement</span>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs text-[#EDEDEF] leading-relaxed space-y-2">
              <p>
                Bonjour, c&apos;est Achraf. J&apos;ai préparé un aperçu de site web mobile pour Bistrot Saint-Paul à Lyon afin de présenter votre carte, vos horaires et votre contact direct :
              </p>
              <div className="p-2 rounded-[6px] bg-[#17171A] text-[#6C5CE7] font-mono text-[11px] select-all border border-[#2A2A2F]">
                https://vybe.fr/d/bistrot-saint-paul
              </div>
              <p className="text-[#A0A0A8]">
                Vous pouvez y jeter un coup d&apos;œil quand vous avez deux minutes, c&apos;est sans engagement. Bonne journée.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#A0A0A8]">
              <span>Lien sécurisé avec suivi des ouvertures</span>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-[#6C5CE7] hover:underline"
              >
                Recommencer le flux
              </button>
            </div>
          </div>
        )}

        {/* Pied de carte avec statut */}
        <div className="pt-3 border-t border-[#2A2A2F] flex items-center justify-between text-[11px] text-[#6E6E76]">
          <span>Flux réel sans artifice</span>
          <span className="tabular-nums">Étape {activeStep} sur 3</span>
        </div>
      </div>
    </div>
  )
}
