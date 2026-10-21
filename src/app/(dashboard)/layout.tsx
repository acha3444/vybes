import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LogOut, ExternalLink } from "lucide-react"
import { SidebarNav, BottomNav } from "@/components/dashboard/NavLinks"
import { DashboardHeaderTitle } from "@/components/dashboard/DashboardHeaderTitle"
import { getDaysRemaining } from "@/lib/utils"
import { VybeLogo } from "@/components/ui/VybeLogo"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si pas de session et Supabase configuré
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url && !url.includes("placeholder") && !user) {
    redirect("/connexion")
  }

  // Profil par défaut ou chargé
  let profile = {
    full_name: user?.user_metadata?.full_name || "Créateur",
    email: user?.email || "freelance@vybe.fr",
    subscription_status: "trialing",
    trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }

  if (user) {
    const { data: dbProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (dbProfile) {
      profile = {
        ...profile,
        ...dbProfile,
      }
    }
  }

  const daysLeft = getDaysRemaining(profile.trial_ends_at)
  const isActive = profile.subscription_status === "active"
  const formattedTrialEnd = profile.trial_ends_at
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(
        new Date(profile.trial_ends_at)
      )
    : "26 octobre"

  const capitalizedFullName = profile.full_name
    ? profile.full_name
        .trim()
        .split(/\s+/)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "Mon compte"

  return (
    <div className="relative min-h-screen bg-[#0F0F11] text-[#EDEDEF] flex flex-col md:flex-row pb-16 md:pb-0 selection:bg-[#6C5CE7] selection:text-white">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-60 sticky top-0 h-screen overflow-y-auto bg-[#17171A] border-r border-[#2A2A2F] p-4 shrink-0 justify-between">
        <div className="space-y-5">
          {/* Logo */}
          <Link href="/dashboard" className="block px-1">
            <VybeLogo size="md" variant="standalone" />
          </Link>

          {/* Statut abonnement (affiché UNE SEULE FOIS dans l'application) */}
          <Link
            href="/abonnement"
            className="block p-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] hover:border-[#6C5CE7]/60 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium text-[#A0A0A8]">
                {isActive ? "Formule Pro" : "Essai gratuit"}
              </span>
              {isActive ? (
                <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Actif
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  Essai jusqu&apos;au {formattedTrialEnd}
                </span>
              )}
            </div>
            <p className="text-xs text-[#EDEDEF] group-hover:text-white flex items-center justify-between">
              <span>{isActive ? "Gérer mon abonnement" : "Passer à Vybe Pro (29 €/mois)"}</span>
            </p>
          </Link>

          {/* Navigation links */}
          <SidebarNav />
        </div>

        <div className="pt-3 border-t border-[#2A2A2F] flex items-center justify-between gap-2">
          <Link
            href="/compte"
            title="Gérer mon compte"
            aria-label="Accéder aux paramètres de mon compte"
            className="flex items-center gap-2.5 overflow-hidden flex-1 group hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-[6px] bg-[#1E1E22] border border-[#2A2A2F] group-hover:border-[#6C5CE7]/60 text-[#6C5CE7] font-semibold flex items-center justify-center text-xs shrink-0 transition-colors">
              {capitalizedFullName.charAt(0)?.toUpperCase() || "F"}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-medium text-[#EDEDEF] group-hover:text-white truncate">
                {capitalizedFullName}
              </p>
              <p className="text-[11px] text-[#6E6E76] truncate">
                {profile.email}
              </p>
            </div>
          </Link>

          <form action="/auth/deconnexion" method="POST">
            <button
              type="submit"
              title="Se déconnecter"
              className="p-1.5 rounded-[6px] text-[#6E6E76] hover:text-red-400 hover:bg-[#1E1E22] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* ZONE CENTRALE */}
      <div className="relative flex-1 flex flex-col min-w-0">
        {/* TOPBAR : FOND OPAQUE #0F0F11 + BORDURE BASSE #2A2A2F */}
        <header className="sticky top-0 z-30 bg-[#0F0F11] border-b border-[#2A2A2F] px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo Mobile */}
          <div className="flex items-center md:hidden">
            <Link href="/dashboard">
              <VybeLogo size="sm" variant="standalone" />
            </Link>
          </div>

          {/* Titre dynamique de page (remplace ESPACE FREELANCE) */}
          <div className="hidden md:block">
            <DashboardHeaderTitle />
          </div>

          {/* Actions Droite */}
          <div className="flex items-center gap-2">
            <form action="/auth/deconnexion" method="POST" className="md:hidden">
              <button
                type="submit"
                title="Se déconnecter"
                className="p-1.5 rounded-[6px] text-[#6E6E76] hover:text-[#EDEDEF] hover:bg-[#17171A] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>

        {/* FOOTER DASHBOARD */}
        <footer className="mt-auto border-t border-[#2A2A2F] px-4 sm:px-6 py-5 text-xs text-[#6E6E76]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 Vybe</p>
            <div className="flex flex-wrap items-center gap-4 text-[#A0A0A8]">
              <Link href="/mentions-legales" className="hover:text-[#EDEDEF] transition-colors">
                Mentions légales
              </Link>
              <span>•</span>
              <Link href="/cgv" className="hover:text-[#EDEDEF] transition-colors">
                CGV
              </Link>
              <span>•</span>
              <Link href="/politique-de-confidentialite" className="hover:text-[#EDEDEF] transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* BOTTOM NAVIGATION BAR MOBILE */}
      <BottomNav />
    </div>
  )
}
