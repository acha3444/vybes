import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Globe,
  Eye,
  CheckCircle,
  Sparkles,
  Search,
  MessageSquare,
  Zap,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let fullName = user?.user_metadata?.full_name || "Créateur"
  let stats = {
    prospectsCount: 0,
    demosCount: 0,
    viewsCount: 0,
    signedCount: 0,
  }
  let recentProspects: Array<{
    id: string
    name: string
    category: string
    city: string | null
    status: string
    created_at: string
  }> = []

  if (user) {
    // Profil
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    if (profile?.full_name) {
      fullName = profile.full_name
    }

    // Statistiques des prospects
    const { data: prospects } = await supabase
      .from("prospects")
      .select("id, name, category, city, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    if (prospects) {
      stats.prospectsCount = prospects.length
      stats.signedCount = prospects.filter((p) => p.status === "signe").length
      recentProspects = prospects
    }

    // Statistiques des démos
    const { data: demos } = await supabase
      .from("demos")
      .select("id, views_count")
      .eq("user_id", user.id)

    if (demos) {
      stats.demosCount = demos.length
      stats.viewsCount = demos.reduce((acc, curr) => acc + (curr.views_count || 0), 0)
    }
  }

  const firstName = fullName.split(" ")[0]

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* HEADER AVEC SALUTATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Salut {firstName}</span>
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Trouve des commerces locaux sans site, envoie leur démo et signe tes premiers contrats.
          </p>
        </div>

        <Link
          href="/trouver"
          className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98] shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Trouver un commerce</span>
        </Link>
      </div>

      {/* CARTES STATISTIQUES (KPIS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 : Prospects */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 sm:p-5 relative overflow-hidden group hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Prospects
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.prospectsCount}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Commerces ciblés</p>
        </div>

        {/* KPI 2 : Démos */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 sm:p-5 relative overflow-hidden group hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Démos créées
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.demosCount}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Sites prêts en 60s</p>
        </div>

        {/* KPI 3 : Vues démos */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 sm:p-5 relative overflow-hidden group hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Vues commerçants
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.viewsCount}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Ouvertures uniques</p>
        </div>

        {/* KPI 4 : Clients signés */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 sm:p-5 relative overflow-hidden group hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Clients signés
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.signedCount}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Sites vendus</p>
        </div>
      </div>

      {/* BANNIÈRE HERO ÉTAPE PAR ÉTAPE (EMPTY STATE GUIDÉ) */}
      {stats.prospectsCount === 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-900 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Méthode en 60 secondes chrono</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Ton premier client t&apos;attend déjà.
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base mt-2 leading-relaxed">
              Des milliers de restaurants, coiffeurs et instituts de beauté n&apos;ont toujours aucun site web. Trouve-les, génère une démo bluffante et envoie-leur un message prêt à copier.
            </p>

            {/* Les 3 étapes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center mb-2">
                  <Search className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">1. Trouve</h3>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Filtre les commerces sans site web dans ta ville.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                <div className="w-7 h-7 rounded-xl bg-violet-500/20 text-violet-300 font-bold text-xs flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">2. Génère</h3>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Un site mobile ultra-pro créé en 1 seul clic.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center mb-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">3. Signe</h3>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Copie le message DM/SMS et envoie le lien.
                </p>
              </div>
            </div>

            <Link
              href="/trouver"
              className="inline-flex items-center justify-center gap-3 h-13 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              <span>🚀 Trouver mon premier commerce</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* CONSEIL PRO POUR LES DÉBUTANTS TIKTOK */}
      <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-neutral-300">
          <strong className="text-white block font-semibold mb-0.5">
            Astuce de prospection pour débutant :
          </strong>
          Cible en priorité les <strong>coiffeurs, barbers et restaurants</strong> ayant entre 15 et 80 avis positifs sur Google. Ils ont déjà des clients fidèles mais perdent des réservations chaque semaine faute de site web mobile.
        </div>
      </div>

      {/* SECTION ACTIVITÉ RÉCENTE / PROSPECTS */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-white">
            Prospects récents
          </h2>
          {recentProspects.length > 0 && (
            <Link
              href="/prospects"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Voir tout ({stats.prospectsCount}) →
            </Link>
          )}
        </div>

        {recentProspects.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">
              Aucun prospect pour le moment
            </p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Dès que tu auras lancé ta première recherche, tes commerces ciblés et leurs démos apparaîtront ici.
            </p>
            <Link
              href="/trouver"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Lancer une recherche de commerces</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {recentProspects.map((p) => (
              <div
                key={p.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{p.name}</h4>
                  <p className="text-xs text-neutral-400">
                    {p.category} • {p.city || "Ville non précisée"}
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 font-medium">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
