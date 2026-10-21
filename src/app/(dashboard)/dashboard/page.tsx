import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { calculateUnifiedKpis } from "@/lib/prospects/stats"
import { normalizeBusinessName } from "@/lib/templates/nameUtils"
import { formatRelativeDate } from "@/lib/utils"
import {
  Compass,
  ArrowRight,
  Check,
  Eye,
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle2,
} from "lucide-react"

export const dynamic = "force-dynamic"

function capitalize(str: string): string {
  if (!str) return "Créateur"
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let fullName = user?.user_metadata?.full_name || "Créateur"
  let allProspects: any[] = []
  let totalDemosCount = 0

  if (user) {
    // 1. Profil
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    if (profile?.full_name) {
      fullName = profile.full_name
    }

    // 2. Tous les prospects de l'utilisateur (source unique pour les KPIs)
    const { data: prospects } = await supabase
      .from("prospects")
      .select("id, name, category, city, status, created_at, demos(id, slug, views_count, updated_at)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (prospects) {
      allProspects = prospects
    }

    // 3. Nombre exact de démos
    const { count } = await supabase
      .from("demos")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)

    totalDemosCount = count || 0
  }

  const rawFirst = fullName.trim().split(" ")[0] || "Créateur"
  const firstName = capitalize(rawFirst)

  // KPIs unifiés
  const kpis = calculateUnifiedKpis(allProspects, totalDemosCount)

  // Prochaine action prioritaire
  // 1. Prospect qui a ouvert récemment mais non signé/perdu
  const openedProspect = allProspects.find((p) => {
    const demo = p.demos && p.demos[0]
    return (demo?.views_count || 0) > 0 && p.status !== "signe" && p.status !== "perdu"
  })

  // 2. Démos créées mais jamais envoyées
  const unsentDemos = allProspects.filter((p) => {
    const demo = p.demos && p.demos[0]
    return demo && p.status === "a_contacter"
  })

  // 3. Prospects sans démo
  const prospectsWithoutDemo = allProspects.filter((p) => !p.demos || p.demos.length === 0)

  // Checklist de démarrage
  const checklist = {
    firstSearch: allProspects.length > 0,
    firstDemo: kpis.demosCreated > 0,
    firstSent: kpis.demosSent > 0,
    firstOpened: kpis.merchantsOpened > 0,
  }
  const isChecklistCompleted =
    checklist.firstSearch &&
    checklist.firstDemo &&
    checklist.firstSent &&
    checklist.firstOpened

  const recentProspects = allProspects.slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER : SALUTATION PROPRE SANS EMOJI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDEF]">
            Bonjour {firstName}
          </h1>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Voici l&apos;état de tes prospections et tes actions à mener aujourd&apos;hui.
          </p>
        </div>

        <Link
          href="/trouver"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-xs transition-colors shrink-0"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Trouver un commerce</span>
        </Link>
      </div>

      {/* BLOC LA PROCHAINE ACTION (PRIORITAIRE EN HAUT DU DASHBOARD) */}
      <div className="p-4 sm:p-5 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium text-[#A0A0A8] block mb-0.5">
            Prochaine action recommandée
          </span>
          {openedProspect ? (
            <p className="text-sm font-semibold text-[#EDEDEF]">
              <span className="text-emerald-400 font-bold">{normalizeBusinessName(openedProspect.name)}</span> a ouvert sa démo{" "}
              {openedProspect.demos?.[0]?.updated_at
                ? formatRelativeDate(openedProspect.demos[0].updated_at)
                : "récemment"}.
            </p>
          ) : unsentDemos.length > 0 ? (
            <p className="text-sm font-semibold text-[#EDEDEF]">
              <span className="tabular-nums font-bold text-[#6C5CE7]">{unsentDemos.length}</span> démo{unsentDemos.length > 1 ? "s" : ""} prête{unsentDemos.length > 1 ? "s" : ""} n&apos;ont jamais été envoyées.
            </p>
          ) : prospectsWithoutDemo.length > 0 ? (
            <p className="text-sm font-semibold text-[#EDEDEF]">
              <span className="tabular-nums font-bold text-[#EDEDEF]">{prospectsWithoutDemo.length}</span> commerce{prospectsWithoutDemo.length > 1 ? "s" : ""} dans ta liste attendent leur démo.
            </p>
          ) : (
            <p className="text-sm font-semibold text-[#EDEDEF]">
              Lancer une recherche pour trouver des commerces sans site dans ta ville.
            </p>
          )}
        </div>

        {openedProspect ? (
          <Link
            href={`/prospecter?demo_id=${openedProspect.demos[0].id}`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-xs font-medium transition-colors shrink-0"
          >
            <span>Relancer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : unsentDemos.length > 0 ? (
          <Link
            href={`/prospecter?demo_id=${unsentDemos[0].demos[0].id}`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-xs font-medium transition-colors shrink-0"
          >
            <span>Envoyer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : prospectsWithoutDemo.length > 0 ? (
          <Link
            href={`/demos/creer?prospect_id=${prospectsWithoutDemo[0].id}`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-xs font-medium transition-colors shrink-0"
          >
            <span>Créer la démo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            href="/trouver"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-xs font-medium transition-colors shrink-0"
          >
            <span>Lancer la recherche</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* LIGNE COMPACTE DE KPIS (MÊMES DÉFINITIONS QUE MES PROSPECTS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-[12px] bg-[#17171A] border border-[#2A2A2F]">
          <span className="text-[13px] font-medium text-[#A0A0A8] block mb-1">
            Démos créées
          </span>
          <div className="text-2xl font-bold text-[#EDEDEF] tabular-nums">
            {kpis.demosCreated}
          </div>
          <span className="text-[11px] text-[#6E6E76]">Sites prêts</span>
        </div>

        <div className="p-4 rounded-[12px] bg-[#17171A] border border-[#2A2A2F]">
          <span className="text-[13px] font-medium text-[#A0A0A8] block mb-1">
            Démos envoyées
          </span>
          <div className="text-2xl font-bold text-[#EDEDEF] tabular-nums">
            {kpis.demosSent}
          </div>
          <span className="text-[11px] text-[#6E6E76]">Statut ≥ envoyée</span>
        </div>

        <div className="p-4 rounded-[12px] bg-[#17171A] border border-[#2A2A2F]">
          <span className="text-[13px] font-medium text-[#A0A0A8] block mb-1">
            Commerçants qui ont ouvert
          </span>
          <div className="text-2xl font-bold text-[#EDEDEF] tabular-nums">
            {kpis.merchantsOpened}
          </div>
          <span className="text-[11px] text-[#6E6E76]">Vues uniques</span>
        </div>

        <div className="p-4 rounded-[12px] bg-[#17171A] border border-[#2A2A2F]">
          <span className="text-[13px] font-medium text-[#A0A0A8] block mb-1">
            Clients signés
          </span>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">
            {kpis.clientsSigned}
          </div>
          <span className="text-[11px] text-[#6E6E76]">Contrats conclus</span>
        </div>
      </div>

      {/* CHECKLIST DE DÉMARRAGE (DISPARAÎT QUAND TOUT EST RÉALISÉ) */}
      {!isChecklistCompleted && (
        <div className="p-4 sm:p-5 rounded-[12px] bg-[#17171A] border border-[#2A2A2F]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#EDEDEF]">
              Checklist de démarrage
            </h2>
            <span className="text-[11px] text-[#6E6E76] font-medium tabular-nums">
              {[checklist.firstSearch, checklist.firstDemo, checklist.firstSent, checklist.firstOpened].filter(Boolean).length} / 4 terminées
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className={`p-3 rounded-[8px] border text-xs flex items-center gap-2.5 ${
              checklist.firstSearch
                ? "bg-[#1E1E22] border-[#2A2A2F] text-[#EDEDEF]"
                : "bg-[#17171A] border-[#2A2A2F]/50 text-[#6E6E76]"
            }`}>
              <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${
                checklist.firstSearch ? "bg-emerald-500/10 text-emerald-400" : "bg-[#1E1E22] text-[#6E6E76]"
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className={checklist.firstSearch ? "line-through opacity-80" : ""}>
                1re recherche
              </span>
            </div>

            <div className={`p-3 rounded-[8px] border text-xs flex items-center gap-2.5 ${
              checklist.firstDemo
                ? "bg-[#1E1E22] border-[#2A2A2F] text-[#EDEDEF]"
                : "bg-[#17171A] border-[#2A2A2F]/50 text-[#6E6E76]"
            }`}>
              <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${
                checklist.firstDemo ? "bg-emerald-500/10 text-emerald-400" : "bg-[#1E1E22] text-[#6E6E76]"
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className={checklist.firstDemo ? "line-through opacity-80" : ""}>
                1re démo générée
              </span>
            </div>

            <div className={`p-3 rounded-[8px] border text-xs flex items-center gap-2.5 ${
              checklist.firstSent
                ? "bg-[#1E1E22] border-[#2A2A2F] text-[#EDEDEF]"
                : "bg-[#17171A] border-[#2A2A2F]/50 text-[#6E6E76]"
            }`}>
              <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${
                checklist.firstSent ? "bg-emerald-500/10 text-emerald-400" : "bg-[#1E1E22] text-[#6E6E76]"
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className={checklist.firstSent ? "line-through opacity-80" : ""}>
                1er message copié
              </span>
            </div>

            <div className={`p-3 rounded-[8px] border text-xs flex items-center gap-2.5 ${
              checklist.firstOpened
                ? "bg-[#1E1E22] border-[#2A2A2F] text-[#EDEDEF]"
                : "bg-[#17171A] border-[#2A2A2F]/50 text-[#6E6E76]"
            }`}>
              <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${
                checklist.firstOpened ? "bg-emerald-500/10 text-emerald-400" : "bg-[#1E1E22] text-[#6E6E76]"
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className={checklist.firstOpened ? "line-through opacity-80" : ""}>
                1re ouverture commerçant
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ASTUCE DE PROSPECTION SANS FAIT INVENTÉ */}
      <div className="p-4 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] text-xs text-[#A0A0A8] leading-relaxed">
        <strong className="text-[#EDEDEF] font-medium block mb-1">
          Conseil de ciblage :
        </strong>
        Cible en priorité les coiffeurs, barbiers et restaurants ayant entre 15 et 80 avis sur Google : ils disposent déjà d&apos;une clientèle établie et d&apos;un bouche-à-oreille actif, mais leur absence sur le web mobile les rend invisibles aux nouveaux clients qui effectuent une recherche locale.
      </div>

      {/* ACTIVITÉ RÉCENTE (VUE LISTE DENSE) */}
      <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#EDEDEF]">
            Prospects récents
          </h2>
          {recentProspects.length > 0 && (
            <Link
              href="/prospects"
              className="text-xs text-[#6C5CE7] hover:underline"
            >
              Voir tout ({allProspects.length})
            </Link>
          )}
        </div>

        {recentProspects.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6E6E76]">
            <p>Aucun prospect pour le moment.</p>
            <Link
              href="/trouver"
              className="mt-2 inline-flex items-center gap-1.5 text-[#EDEDEF] hover:underline"
            >
              Lancer une recherche de commerces →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#2A2A2F]">
            {recentProspects.map((p) => {
              const demo = p.demos && p.demos[0]
              const viewsCount = demo?.views_count || 0
              const isSigned = p.status === "signe"

              return (
                <div
                  key={p.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-[#EDEDEF] truncate">
                        {normalizeBusinessName(p.name)}
                      </span>
                      {viewsCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tabular-nums">
                          {viewsCount} vue{viewsCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6E6E76] mt-0.5">
                      {p.category === "restaurant" ? "Restaurant" : p.category === "barber" ? "Barber" : "Institut"} • {p.city || "France"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-[4px] font-medium ${
                        isSigned
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : p.status === "demo_envoyee"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : p.status === "interesse"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : p.status === "perdu"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-[#1E1E22] text-[#A0A0A8] border border-[#2A2A2F]"
                      }`}
                    >
                      {p.status === "signe"
                        ? "Signé"
                        : p.status === "interesse"
                        ? "Intéressé"
                        : p.status === "demo_envoyee"
                        ? "Démo envoyée"
                        : p.status === "perdu"
                        ? "Perdu"
                        : "À contacter"}
                    </span>

                    {demo && (
                      <Link
                        href={`/prospecter?demo_id=${demo.id}`}
                        className="h-7 px-2.5 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-[11px] font-medium flex items-center gap-1 border border-[#2A2A2F] transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 text-[#6E6E76]" />
                        <span>Messages</span>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
