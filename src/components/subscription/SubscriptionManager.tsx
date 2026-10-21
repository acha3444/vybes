"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Lock,
  RefreshCw,
  Building2,
  Check,
} from "lucide-react"

interface SubscriptionManagerProps {
  initialStatus: string
  trialEndsAt: string | null
  hasStripeCustomer: boolean
  isConfigured: boolean
  isPaywall: boolean
}

export default function SubscriptionManager({
  initialStatus,
  trialEndsAt,
  hasStripeCustomer,
  isConfigured,
  isPaywall,
}: SubscriptionManagerProps) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [currentTrialEnd, setCurrentTrialEnd] = useState<string | null>(trialEndsAt)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null)

  // Calcul des jours restants
  const calculateDaysRemaining = (endDateStr: string | null) => {
    if (!endDateStr) return 0
    const diff = new Date(endDateStr).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const daysLeft = calculateDaysRemaining(currentTrialEnd)
  const isActive = status === "active"
  const isTrial = status === "trialing" && daysLeft > 0
  const isExpired = !isActive && (!isTrial || daysLeft <= 0)

  // Déclenchement Checkout ou Portail
  async function handleCheckoutOrPortal() {
    setIsLoading(true)
    setErrorMessage(null)

    if (!isConfigured) {
      setIsLoading(false)
      setShowConfigModal(true)
      return
    }

    try {
      if (isActive && hasStripeCustomer) {
        const res = await fetch("/api/stripe/portal", { method: "POST" })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setErrorMessage(data.error || "Impossible d'ouvrir le portail client.")
        }
      } else {
        const res = await fetch("/api/stripe/checkout", { method: "POST" })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setErrorMessage(data.error || "Impossible d'initier le paiement.")
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur réseau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Simulation pour tester le paywall et le mode actif en dev
  async function handleSimulate(targetStatus: "active" | "trial_expired" | "trial_fresh") {
    setIsLoading(true)
    setErrorMessage(null)
    setSimulationSuccess(null)

    try {
      const res = await fetch("/api/stripe/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus(data.profile.subscription_status)
        setCurrentTrialEnd(data.profile.trial_ends_at)
        setSimulationSuccess(data.message)
        router.refresh()
      } else {
        setErrorMessage(data.error || "Échec de la simulation.")
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur réseau.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
      {/* ALERTE PAYWALL */}
      {isPaywall && (
        <div className="p-4 rounded-[12px] bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-amber-300">Période d&apos;essai terminée</p>
            <p className="text-[#A0A0A8] mt-0.5">
              Ton essai gratuit de 7 jours est arrivé à son terme. Active ton abonnement Vybe Pro pour
              continuer à générer des démos et contacter tes prospects.
            </p>
          </div>
        </div>
      )}

      {/* TITRE & INTRODUCTION */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDEF]">
          Mon abonnement
        </h1>
        <p className="text-xs text-[#A0A0A8] mt-1">
          Gère ton plan Vybe Pro, tes accès et tes informations de facturation.
        </p>
      </div>

      {/* CARTE ÉTAT DE L'ABONNEMENT */}
      <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#A0A0A8]">
            Statut actuel
          </span>

          {isActive ? (
            <span className="px-2.5 py-1 rounded-[6px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Vybe Pro actif</span>
            </span>
          ) : isTrial ? (
            <span className="px-2.5 py-1 rounded-[6px] bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium tabular-nums">
              Essai gratuit ({daysLeft} {daysLeft > 1 ? "jours restants" : "jour restant"})
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-[6px] bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Essai expiré</span>
            </span>
          )}
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-[#EDEDEF]">Vybe Pro</h2>
            <span className="text-[#A0A0A8] font-semibold text-base tabular-nums">29 € / mois</span>
          </div>

          <p className="text-xs text-[#A0A0A8] mt-1.5 leading-relaxed">
            {isActive
              ? "Ton abonnement est actif. Tu bénéficies de la création et du suivi de démos pour tes prospects."
              : isTrial
              ? `Tu profites actuellement de ton essai gratuit de 7 jours. Il te reste ${daysLeft} jour(s) pour générer des démos et contacter tes premiers commerçants.`
              : "Ton accès d'essai a expiré. Active ton abonnement pour continuer à générer des démos personnalisées."}
          </p>
        </div>

        {/* Détails et fonctionnalités incluses */}
        <div className="pt-4 border-t border-[#2A2A2F] space-y-2.5 text-xs text-[#A0A0A8]">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[#EDEDEF]">Recherches incluses (usage équitable, données Google Maps)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[#EDEDEF]">Génération de démos pour restaurants, barbers et instituts</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[#EDEDEF]">Suivi des consultations et alertes d&apos;ouverture</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[#EDEDEF]">Messages de prospection prêts à l&apos;envoi (SMS, Instagram DM, email)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[#EDEDEF]">Éditeur de démo en direct avec personnalisation du contenu</span>
          </div>
        </div>

        {/* BOUTON D'ACTION PRINCIPAL */}
        <div className="pt-2">
          {isActive ? (
            <button
              onClick={handleCheckoutOrPortal}
              disabled={isLoading}
              className="w-full h-10 rounded-[8px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] font-medium text-xs flex items-center justify-center gap-2 border border-[#2A2A2F] transition-colors cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4 text-[#A0A0A8]" />
              <span>Gérer mon moyen de paiement et mes factures</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#6E6E76]" />
            </button>
          ) : (
            <button
              onClick={handleCheckoutOrPortal}
              disabled={isLoading}
              className="w-full h-10 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>
                {isExpired ? "Réactiver mon abonnement (29 € / mois)" : "Passer à Vybe Pro (29 € / mois)"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {errorMessage && (
            <p className="text-xs text-red-400 font-medium text-center mt-3">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6E6E76] mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paiement sécurisé par Stripe • Sans engagement • Annulation en 1 clic</span>
          </div>
        </div>
      </div>

      {/* BOÎTE MODE ENVIRONNEMENT / TESTEUR */}
      <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-[#6C5CE7] shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#EDEDEF] flex items-center gap-2">
              <span>Configuration Stripe</span>
              {!isConfigured && (
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  En attente de clés
                </span>
              )}
            </h3>
            <p className="text-[11px] text-[#A0A0A8] mt-1 leading-relaxed">
              Le flux Stripe est branché. Dès que tes clés Stripe sont définies dans les variables d&apos;environnement, les paiements réels sont activés automatiquement.
            </p>
          </div>
        </div>

        {/* Boutons de simulation */}
        <div className="pt-3 border-t border-[#2A2A2F]">
          <p className="text-[11px] font-medium text-[#6E6E76] mb-2">
            Simulateur d&apos;état (développement) :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSimulate("active")}
              disabled={isLoading}
              className={`h-8 px-2.5 rounded-[6px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-[#1E1E22] text-[#A0A0A8] hover:text-[#EDEDEF] border border-[#2A2A2F]"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simuler Pro Actif</span>
            </button>

            <button
              onClick={() => handleSimulate("trial_expired")}
              disabled={isLoading}
              className={`h-8 px-2.5 rounded-[6px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isExpired
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-[#1E1E22] text-[#A0A0A8] hover:text-[#EDEDEF] border border-[#2A2A2F]"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Simuler Expiré</span>
            </button>

            <button
              onClick={() => handleSimulate("trial_fresh")}
              disabled={isLoading}
              className={`h-8 px-2.5 rounded-[6px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isTrial
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  : "bg-[#1E1E22] text-[#A0A0A8] hover:text-[#EDEDEF] border border-[#2A2A2F]"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réinitialiser 7J</span>
            </button>
          </div>

          {simulationSuccess && (
            <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{simulationSuccess}</span>
            </p>
          )}
        </div>
      </div>

      {/* MODAL CONFIGURATION STRIPE */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] flex items-center justify-center text-[#6C5CE7]">
              <Building2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#EDEDEF]">
                Configuration Stripe requise
              </h3>
              <p className="text-xs text-[#A0A0A8] mt-1 leading-relaxed">
                Les clés Stripe n&apos;ont pas encore été renseignées dans les variables d&apos;environnement.
              </p>
            </div>

            <div className="bg-[#1E1E22] p-3 rounded-[8px] border border-[#2A2A2F] text-xs text-[#A0A0A8] space-y-2">
              <p className="font-medium text-[#EDEDEF]">
                Pour activer les abonnements réels :
              </p>
              <p>
                Renseigne tes variables Stripe dans les paramètres Vercel ou dans <code className="text-[#EDEDEF]">.env.local</code>.
              </p>
            </div>

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full h-9 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-xs transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
