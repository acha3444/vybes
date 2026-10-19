import { createClient } from "@/lib/supabase/server"
import { CreditCard, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react"
import { getDaysRemaining } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AbonnementPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = {
    subscription_status: "trialing",
    trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }

  if (user) {
    const { data: dbProfile } = await supabase
      .from("profiles")
      .select("subscription_status, trial_ends_at")
      .eq("id", user.id)
      .single()

    if (dbProfile) {
      profile = dbProfile
    }
  }

  const daysLeft = getDaysRemaining(profile.trial_ends_at)
  const isTrial = profile.subscription_status === "trialing"
  const isActive = profile.subscription_status === "active"

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-indigo-400" />
          <span>Mon abonnement</span>
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Gère ton plan Vybe Pro et tes informations de facturation.
        </p>
      </div>

      {/* CARTE ÉTAT DE L'ABONNEMENT */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Statut actuel
          </span>
          {isActive ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              PRO ACTIF
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              ESSAI GRATUIT ({daysLeft} jours restants)
            </span>
          )}
        </div>

        <h3 className="text-2xl font-black text-white">
          Plan Vybe Illimité
        </h3>
        <p className="text-sm text-neutral-300 mt-1">
          {isActive
            ? "Ton abonnement est actif à 29 € / mois. Tu peux créer des démos en illimité."
            : `Tu profites actuellement de ton essai gratuit de 7 jours. Il te reste ${daysLeft} jour(s) pour créer des démos et signer tes premiers clients.`}
        </p>

        {/* Détails du plan */}
        <div className="my-6 space-y-2.5 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Recherches illimitées de commerces sans site web</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Génération illimitée de démos mobiles (Resto, Barber, Institut)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Suivi des vues des commerçants en temps réel</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Messages DM, SMS et Email pré-rédigés</span>
          </div>
        </div>

        <button
          type="button"
          disabled
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 opacity-60 cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2"
        >
          <span>Portail Stripe Billing (Activé à l&apos;Étape 7)</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 font-medium mt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Paiement sécurisé par Stripe • Sans engagement</span>
        </div>
      </div>
    </div>
  )
}
