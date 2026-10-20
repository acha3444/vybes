import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LogOut, Sparkles, ExternalLink } from "lucide-react"
import { SidebarNav, BottomNav } from "@/components/dashboard/NavLinks"
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
  const isTrial = profile.subscription_status === "trialing"
  const isActive = profile.subscription_status === "active"

  return (
    <div className="relative min-h-screen bg-[#07070b] text-white flex flex-col md:flex-row pb-20 md:pb-0 selection:bg-indigo-500 selection:text-white">
      {/* Halo d'ambiance discret */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 sticky top-0 h-screen overflow-y-auto bg-neutral-950/60 backdrop-blur-xl border-r border-white/[0.06] p-5 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/dashboard" className="group transition-transform hover:opacity-95">
            <VybeLogo size="md" variant="standalone" subtitle="Prospect & Signe" />
          </Link>

          {/* Badge statut abonnement */}
          <Link
            href="/abonnement"
            className="block p-3 rounded-2xl bg-gradient-to-br from-neutral-850 to-neutral-800 border border-neutral-700/60 hover:border-indigo-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
                Mon plan
              </span>
              {isActive ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  PRO ACTIF
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  ESSAI ({daysLeft}j)
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-300 font-medium group-hover:text-white flex items-center gap-1">
              <span>{isActive ? "Gérer mon abonnement" : "Passer au plan illimité (29€)"}</span>
              <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-indigo-400" />
            </p>
          </Link>

          {/* Navigation links */}
          <SidebarNav />
        </div>

        {/* Footer Sidebar avec déconnexion */}
        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
              {profile.full_name?.charAt(0)?.toUpperCase() || "F"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {profile.full_name}
              </p>
              <p className="text-[10px] text-neutral-400 truncate">
                {profile.email}
              </p>
            </div>
          </div>

          <form action="/auth/deconnexion" method="POST">
            <button
              type="submit"
              title="Se déconnecter"
              className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* ZONE CENTRALE */}
      <div className="relative flex-1 flex flex-col min-w-0">
        {/* TOPBAR MOBILE & DESKTOP */}
        <header className="sticky top-0 z-30 bg-[#07070b]/70 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo Mobile */}
          <div className="flex items-center md:hidden">
            <Link href="/dashboard">
              <VybeLogo size="sm" variant="standalone" />
            </Link>
          </div>

          <div className="hidden md:block">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              Espace Freelance
            </span>
          </div>

          {/* Statut & Action Mobile */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/abonnement"
              className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium flex items-center gap-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span className="text-neutral-300">
                {isActive ? "Pro Actif" : `Essai : ${daysLeft}j`}
              </span>
            </Link>

            <form action="/auth/deconnexion" method="POST" className="md:hidden">
              <button
                type="submit"
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>

        {/* FOOTER DASHBOARD */}
        <footer className="mt-auto border-t border-neutral-900 px-4 sm:px-6 py-6 text-xs text-neutral-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 Vybe • Espace Freelance</p>
            <div className="flex flex-wrap items-center gap-4 text-neutral-400">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <span>•</span>
              <Link href="/cgv" className="hover:text-white transition-colors">
                CGV
              </Link>
              <span>•</span>
              <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
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
