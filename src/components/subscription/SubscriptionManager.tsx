"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Flame,
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
        // Redirection vers le portail client Stripe
        const res = await fetch("/api/stripe/portal", { method: "POST" })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setErrorMessage(data.error || "Impossible d'ouvrir le portail client.")
        }
      } else {
        // Redirection vers Stripe Checkout
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
        body: JSON.stringify({ targetStatus }),
      })
      const data = await res.json()

      if (data.success && data.profile) {
        setStatus(data.profile.subscription_status)
        setCurrentTrialEnd(data.profile.trial_ends_at)
        setSimulationSuccess(
          targetStatus === "active"
            ? "Compte basculé en PRO ACTIF."
            : targetStatus === "trial_expired"
            ? "Compte basculé en ESSAI EXPIRÉ (le paywall est actif !)."
            : "Compte réinitialisé en ESSAI 7 JOURS."
        )
        router.refresh()
      } else {
        setErrorMessage(data.error || "Erreur de simulation.")
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur réseau lors de la simulation.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* ALERTE PAYWALL SI REDIRIGÉ DEPUIS CRÉATION DÉMO */}
      {isPaywall && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-amber-300">Période d&apos;essai terminée</p>
            <p className="text-neutral-300 mt-0.5">
              Ton essai gratuit de 7 jours est arrivé à son terme. Active ton plan Vybe Pro pour
              continuer à générer des démos en illimité et signer tes commerces.
            </p>
          </div>
        </div>
      )}

      {/* TITRE & INTRODUCTION */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-indigo-400" />
          <span>Mon abonnement</span>
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Gère ton plan Vybe Pro, tes accès et tes informations de facturation.
        </p>
      </div>

      {/* CARTE ÉTAT DE L'ABONNEMENT */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Lueur d'arrière-plan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Statut actuel
          </span>

          {isActive ? (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              VYBE PRO ACTIF
            </span>
          ) : isTrial ? (
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ESSAI GRATUIT ({daysLeft} {daysLeft > 1 ? "jours restants" : "jour restant"})
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              ESSAI EXPIRÉ
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-black text-white">Plan Vybe Illimité</h2>
          <span className="text-neutral-400 font-bold text-lg">29 € / mois</span>
        </div>

        <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
          {isActive
            ? "Ton abonnement est actif. Tu bénéficies de la création et du suivi illimités pour tous tes prospects."
            : isTrial
            ? `Tu profites actuellement de ton essai gratuit de 7 jours. Il te reste ${daysLeft} jour(s) pour générer des démos et contacter tes premiers commerçants.`
            : "Ton accès d'essai a expiré. Débloque le plan Pro pour continuer à générer des démos personnalisées en 60 secondes."}
        </p>

        {/* Détails et avantages */}
        <div className="my-6 space-y-3 pt-5 border-t border-neutral-800 text-xs sm:text-sm text-neutral-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Recherche en direct de commerces sans site web (SIRENE & OpenStreetMap)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Génération illimitée de démos mobiles (Restaurants, Barbiers, Instituts de beauté)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Compteur de vues en direct & alerte visuelle quand le client clique</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Templates de prospection Instagram DM, WhatsApp et Email pré-rédigés</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Simulateur smartphone ultra-réactif avec modifications en temps réel (0ms)</span>
          </div>
        </div>

        {/* BOUTON D'ACTION PRINCIPAL */}
        <div className="mt-6">
          {isActive ? (
            <button
              onClick={handleCheckoutOrPortal}
              disabled={isLoading}
              className="w-full h-13 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-neutral-700 transition cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4 text-neutral-400" />
              <span>Gérer ma carte et mes factures (Portail Stripe)</span>
              <ExternalLink className="w-4 h-4 text-neutral-400 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleCheckoutOrPortal}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/25 transition cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>
                {isExpired ? "Réactiver mon plan Pro (29 € / mois)" : "Passer à Vybe Pro (7 jours offerts)"}
              </span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>
          )}

          {errorMessage && (
            <p className="text-xs text-rose-400 font-medium text-center mt-3">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 font-medium mt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Paiement sécurisé par Stripe • Sans engagement • Annulation en 1 clic</span>
          </div>
        </div>
      </div>

      {/* BOÎTE MODE CRÉATION DE SOCIÉTÉ / TESTEUR DE PAYWALL */}
      <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Mode création d&apos;entreprise</span>
              {!isConfigured && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CLÉS STRIPE EN ATTENTE
                </span>
              )}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Le système Stripe est 100% prêt. Dès que ta société est immatriculée, il te suffira de coller tes 4 clés Stripe dans le fichier <code className="text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded text-[11px]">.env.local</code> pour recevoir des paiements réels.
            </p>
          </div>
        </div>

        {/* Boutons de simulation pour tester le comportement en direct */}
        <div className="pt-3 border-t border-neutral-800/80">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
            Testeur de statuts (Pour tester le Paywall et les accès) :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSimulate("active")}
              disabled={isLoading}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700"
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simuler Pro Actif</span>
            </button>

            <button
              onClick={() => handleSimulate("trial_expired")}
              disabled={isLoading}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                isExpired
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Simuler Expiré (Paywall)</span>
            </button>

            <button
              onClick={() => handleSimulate("trial_fresh")}
              disabled={isLoading}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                isTrial
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
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

      {/* MODAL INFORMATION QUAND CLÉS STRIPE NON ENCORE RENSEIGNÉES */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">
                Société en cours de création
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Les clés Stripe n&apos;ont pas encore été renseignées dans les variables d&apos;environnement.
              </p>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <p className="font-semibold text-neutral-200">
                Ce qui se passera dès que ta société sera créée :
              </p>
              <p>
                1. Tu créeras ton compte sur <strong className="text-white">stripe.com</strong> en 5 minutes.
              </p>
              <p>
                2. Tu colleras simplement tes 4 clés dans <strong className="text-white">.env.local</strong> :
              </p>
              <pre className="text-[10px] text-indigo-300 bg-neutral-900 p-2 rounded border border-neutral-800 overflow-x-auto">
{`STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_WEBHOOK_SECRET=whsec_...`}
              </pre>
              <p className="text-emerald-400 font-medium">
                👉 Tout le code est déjà écrit et branché ! Aucune modification de code ne sera requise.
              </p>
            </div>

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Compris, continuer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
