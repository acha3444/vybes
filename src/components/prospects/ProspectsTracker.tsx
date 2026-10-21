"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Prospect, Demo, ProspectStatus } from "@/types/database"
import { calculateUnifiedKpis } from "@/lib/prospects/stats"
import { normalizeBusinessName, normalizeCityName } from "@/lib/templates/nameUtils"
import { getDemoUrl, formatRelativeDate } from "@/lib/utils"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import {
  Users,
  Search,
  Eye,
  Phone,
  MapPin,
  ExternalLink,
  MessageSquare,
  Check,
  Copy,
  Trash2,
  StickyNote,
  Compass,
  Edit3,
  MoreVertical,
  Plus,
} from "lucide-react"

export interface ProspectWithDemo extends Prospect {
  demos?: Demo[]
}

const STATUS_LABELS: Record<ProspectStatus, string> = {
  a_contacter: "À contacter",
  demo_envoyee: "Démo envoyée",
  interesse: "Intéressé",
  signe: "Signé",
  perdu: "Perdu",
}

const STATUS_STYLES: Record<
  ProspectStatus,
  { bg: string; text: string; border: string }
> = {
  a_contacter: {
    bg: "bg-[#1E1E22]",
    text: "text-[#A0A0A8]",
    border: "border-[#2A2A2F]",
  },
  demo_envoyee: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  interesse: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  signe: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  perdu: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  barber: "Barber",
  beauty: "Institut",
}

export default function ProspectsTracker({
  initialProspects,
}: {
  initialProspects: ProspectWithDemo[]
  rootDomain: string
}) {
  const [prospects, setProspects] = useState<ProspectWithDemo[]>(initialProspects)
  const [filterStatus, setFilterStatus] = useState<"all" | ProspectStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({})
  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({})
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null)
  const [deleteProspect, setDeleteProspect] = useState<ProspectWithDemo | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [proposeSentModal, setProposeSentModal] = useState<string | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Calcul unique et cohérent des KPIs
  const kpis = useMemo(() => calculateUnifiedKpis(prospects), [prospects])

  // Tri intelligent : ceux avec ouvertures récentes en haut, puis par date
  const sortedProspects = useMemo(() => {
    return [...prospects].sort((a, b) => {
      const aViews = a.demos?.[0]?.views_count || 0
      const bViews = b.demos?.[0]?.views_count || 0
      if (aViews > 0 && bViews === 0) return -1
      if (bViews > 0 && aViews === 0) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [prospects])

  const isDemoSent = (p: ProspectWithDemo) => Boolean(p.demos?.[0]?.sent_at) || p.status === "demo_envoyee"

  // Filtrage cohérent avec le KPI Démos envoyées
  const filtered = useMemo(() => {
    return sortedProspects.filter((p) => {
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "demo_envoyee"
          ? isDemoSent(p)
          : filterStatus === "a_contacter"
          ? p.status === "a_contacter" && !isDemoSent(p)
          : p.status === filterStatus)
      const q = searchQuery.trim().toLowerCase()
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q))
      return matchesStatus && matchesQuery
    })
  }, [sortedProspects, filterStatus, searchQuery])

  // Mise à jour du statut avec alimentation de sent_at
  async function handleStatusChange(prospectId: string, newStatus: ProspectStatus) {
    setProspects((prev) =>
      prev.map((p) => {
        if (p.id === prospectId) {
          const updatedDemos = p.demos
            ? p.demos.map((d) => ({
                ...d,
                sent_at:
                  newStatus === "demo_envoyee" || newStatus === "interesse" || newStatus === "signe"
                    ? d.sent_at || new Date().toISOString()
                    : d.sent_at,
              }))
            : p.demos
          return { ...p, status: newStatus, demos: updatedDemos }
        }
        return p
      })
    )

    try {
      await fetch(`/api/prospects/${prospectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          mark_sent: newStatus === "demo_envoyee",
        }),
      })
    } catch (e) {
      console.error("Erreur mise à jour statut:", e)
    }
  }

  // Sauvegarde d'une note privée
  async function handleSaveNote(prospectId: string) {
    const note = notesDrafts[prospectId]
    setSavingNoteId(prospectId)

    try {
      const res = await fetch(`/api/prospects/${prospectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: note }),
      })

      if (res.ok) {
        setProspects((prev) =>
          prev.map((p) => (p.id === prospectId ? { ...p, notes: note } : p))
        )
      }
    } catch (e) {
      console.error("Erreur sauvegarde note:", e)
    } finally {
      setSavingNoteId(null)
    }
  }

  // Confirmation et suppression
  async function confirmDelete() {
    if (!deleteProspect) return
    setDeleting(true)
    const id = deleteProspect.id

    try {
      await fetch(`/api/prospects/${id}`, { method: "DELETE" })
      setProspects((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      console.error("Erreur suppression prospect:", e)
    } finally {
      setDeleting(false)
      setDeleteProspect(null)
    }
  }

  // Copie sécurisée du lien démo et marquage sent_at
  function handleCopyDemoLink(slug: string, prospect: ProspectWithDemo) {
    const url = getDemoUrl(slug)
    navigator.clipboard.writeText(url)
    setCopiedId(prospect.id)
    setTimeout(() => setCopiedId(null), 2000)

    const demo = prospect.demos && prospect.demos[0]
    if (demo?.id) {
      fetch(`/api/demos/${demo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark_sent: true }),
      }).catch(() => {})
    }

    setProspects((prev) =>
      prev.map((p) => {
        if (p.id === prospect.id) {
          const updatedDemos = p.demos
            ? p.demos.map((d) => ({ ...d, sent_at: d.sent_at || new Date().toISOString() }))
            : p.demos
          return { ...p, demos: updatedDemos }
        }
        return p
      })
    )

    // Si le prospect était encore à contacter, proposer le passage en démo envoyée
    if (prospect.status === "a_contacter") {
      setProposeSentModal(prospect.id)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER DE PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDEF]">
            Mes prospects
          </h1>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Suivi des commerces ciblés, ouvertures de démos et contrats signés.
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

      {/* 4 KPIS UNIFIÉS (SOURCE UNIQUE DE VÉRITÉ) */}
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
          <span className="text-[11px] text-[#6E6E76]">Lien ou message transmis</span>
        </div>

        <div className="p-4 rounded-[12px] bg-[#17171A] border border-[#2A2A2F]">
          <span className="text-[13px] font-medium text-[#A0A0A8] block mb-1">
            Commerçants qui ont ouvert
          </span>
          <div className="text-2xl font-bold text-[#EDEDEF] tabular-nums">
            {kpis.merchantsOpened}
          </div>
          <span className="text-[11px] text-[#6E6E76]">Au moins 1 consultation</span>
        </div>

        <div className="p-4 rounded-[12px] bg-[#17171A] border border-[#2A2A2F]">
          <span className="text-[13px] font-medium text-[#A0A0A8] block mb-1">
            Clients signés
          </span>
          <div className={`text-2xl font-bold tabular-nums ${kpis.clientsSigned > 0 ? "text-emerald-400" : "text-[#EDEDEF]"}`}>
            {kpis.clientsSigned}
          </div>
          <span className="text-[11px] text-[#6E6E76]">Contrats conclus</span>
        </div>
      </div>

      {/* RECHERCHE ET FILTRES DENSES */}
      <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6E6E76] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer par nom, ville ou téléphone…"
              className="w-full h-9 pl-9 pr-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-[#EDEDEF] placeholder-[#6E6E76] text-xs outline-none focus:border-[#6C5CE7] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`h-9 px-3 rounded-[8px] font-medium transition-colors whitespace-nowrap ${
                filterStatus === "all"
                  ? "bg-[#6C5CE7] text-white"
                  : "bg-[#1E1E22] text-[#A0A0A8] hover:text-[#EDEDEF] border border-[#2A2A2F]"
              }`}
            >
              Tous ({prospects.length})
            </button>

            {(Object.keys(STATUS_LABELS) as ProspectStatus[]).map((st) => {
              const count =
                st === "demo_envoyee"
                  ? prospects.filter(isDemoSent).length
                  : st === "a_contacter"
                  ? prospects.filter((p) => p.status === "a_contacter" && !isDemoSent(p)).length
                  : prospects.filter((p) => p.status === st).length
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`h-9 px-3 rounded-[8px] font-medium transition-colors whitespace-nowrap ${
                    filterStatus === st
                      ? "bg-[#1E1E22] text-[#EDEDEF] border border-[#EDEDEF]/40"
                      : "bg-[#1E1E22] text-[#A0A0A8] hover:text-[#EDEDEF] border border-[#2A2A2F]"
                  }`}
                >
                  <span>{STATUS_LABELS[st]}</span>
                  <span className="ml-1 opacity-60 tabular-nums">({count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* VUE LISTE DENSE PAR DÉFAUT */}
      {filtered.length === 0 ? (
        <div className="py-14 text-center bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-6">
          <Users className="w-10 h-10 text-[#6E6E76] mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[#EDEDEF]">
            {prospects.length === 0
              ? "Aucun prospect pour l'instant"
              : "Aucun résultat pour ce filtre"}
          </h3>
          <p className="text-xs text-[#A0A0A8] max-w-sm mx-auto mt-1 mb-4">
            {prospects.length === 0
              ? "Lance ta première recherche pour ajouter des commerces à prospecter."
              : "Modifie tes critères de recherche pour afficher les commerces."}
          </p>
          {prospects.length === 0 && (
            <Link
              href="/trouver"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-xs transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Lancer une recherche</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] divide-y divide-[#2A2A2F] overflow-hidden">
          {/* EN-TÊTE FIXE SUR GRAND ÉCRAN */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.2fr)_140px_160px_auto] items-center gap-4 px-4 py-2.5 bg-[#121214] text-[11px] font-medium text-[#6E6E76]">
            <div>Commerce</div>
            <div>Statut</div>
            <div>État de la démo</div>
            <div className="text-right">Actions</div>
          </div>

          {filtered.map((prospect) => {
            const demo = prospect.demos && prospect.demos[0]
            const viewsCount = demo?.views_count || 0
            const hasViewed = viewsCount > 0
            const isLost = prospect.status === "perdu"
            const isNoteOpen = expandedNotes[prospect.id]
            const isCopied = copiedId === prospect.id
            const demoUrl = demo ? getDemoUrl(demo.slug) : ""
            const statusStyle = STATUS_STYLES[prospect.status]
            const hasNote = Boolean(prospect.notes && prospect.notes.trim())

            return (
              <div
                key={prospect.id}
                className={`p-3.5 sm:p-4 transition-colors hover:bg-[#1E1E22]/50 ${
                  isLost ? "opacity-45 bg-[#121214]" : ""
                }`}
              >
                {/* GRILLE CSS FIXE : (nom + infos | statut | état de la démo | actions) */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_140px_160px_auto] items-center gap-3 lg:gap-4">
                  {/* COLONNE 1 : NOM + INFOS */}
                  <div className="flex items-start gap-2.5 min-w-0">
                    {hasViewed && !isLost && (
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"
                        title="Démo ouverte par le commerçant"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`font-semibold text-sm truncate ${
                            isLost ? "line-through text-[#A0A0A8]" : "text-[#EDEDEF]"
                          }`}
                          title={prospect.name}
                        >
                          {normalizeBusinessName(prospect.name)}
                        </span>
                        <span className="shrink-0 whitespace-nowrap text-[11px] px-2 py-0.5 rounded-[4px] bg-[#1E1E22] text-[#A0A0A8] border border-[#2A2A2F]">
                          {CATEGORY_LABELS[prospect.category] || prospect.category}
                        </span>
                        {hasNote && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedNotes((prev) => ({
                                ...prev,
                                [prospect.id]: !prev[prospect.id],
                              }))
                            }
                            aria-label="Consulter la note privée"
                            title={`Note : ${prospect.notes}`}
                            className="shrink-0 flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-[4px] bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                          >
                            <StickyNote className="w-3 h-3 text-amber-400" />
                            <span className="hidden sm:inline truncate max-w-[120px]">
                              {prospect.notes}
                            </span>
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[#6E6E76] mt-0.5 flex items-center gap-2 flex-wrap">
                        {prospect.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#6E6E76]" />
                            <span>{normalizeCityName(prospect.city)}</span>
                          </span>
                        )}
                        {prospect.phone && (
                          <>
                            <span>•</span>
                            <a
                              href={`tel:${prospect.phone.replace(/[^0-9+]/g, "")}`}
                              className="text-[#A0A0A8] hover:text-[#EDEDEF]"
                            >
                              {prospect.phone}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* COLONNE 2 : STATUT DU PROSPECT (LARGEUR FIXE 140px, POSITION IDENTIQUE PARTOUT) */}
                  <div className="w-full lg:w-[140px] shrink-0">
                    <select
                      value={prospect.status}
                      onChange={(e) =>
                        handleStatusChange(prospect.id, e.target.value as ProspectStatus)
                      }
                      aria-label="Statut du prospect"
                      title="Modifier le statut du prospect"
                      className={`w-full h-8 px-2.5 rounded-[6px] text-xs font-medium border outline-none cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {(Object.keys(STATUS_LABELS) as ProspectStatus[]).map((st) => (
                        <option key={st} value={st} className="bg-[#17171A] text-[#EDEDEF]">
                          {STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* COLONNE 3 : ÉTAT DE LA DÉMO (LARGEUR FIXE 160px) */}
                  <div className="text-xs text-[#A0A0A8] w-full lg:w-[160px] shrink-0">
                    {demo ? (
                      <div>
                        {viewsCount === 0 ? (
                          <span className="text-[#6E6E76]">Pas encore ouverte</span>
                        ) : (
                          <span className="text-[#EDEDEF] tabular-nums font-medium">
                            {viewsCount === 1 ? "1 vue" : `${viewsCount} vues`}
                            {demo.updated_at && (
                              <span className="text-[#6E6E76] font-normal ml-1">
                                (dernière {formatRelativeDate(demo.updated_at)})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#6E6E76]">Sans démo</span>
                    )}
                  </div>

                  {/* COLONNE 4 : ACTIONS (SEULEMENT COPIER LE LIEN & MESSAGES VISIBLES, RESTE DANS LE MENU "…") */}
                  <div className="flex items-center gap-1.5 justify-start lg:justify-end shrink-0">
                    {!isLost && demo && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopyDemoLink(demo.slug, prospect)}
                          aria-label="Copier le lien de la démo"
                          title="Copier le lien de la démo"
                          className="h-8 px-2.5 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#6E6E76]" />
                              <span>Copier le lien</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/prospecter?demo_id=${demo.id}`}
                          aria-label="Messages de prospection"
                          title="Messages de prospection"
                          className="h-8 px-2.5 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#6E6E76]" />
                          <span>Messages</span>
                        </Link>
                      </>
                    )}

                    {!isLost && !demo && (
                      <Link
                        href={`/demos/creer?prospect_id=${prospect.id}`}
                        aria-label="Créer la démo de ce commerce"
                        title="Créer la démo"
                        className="h-8 px-2.5 rounded-[6px] border border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Créer démo</span>
                      </Link>
                    )}

                    {/* MENU "…" REGROUPANT OUVRIR / MODIFIER / NOTE / SUPPRIMER */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === prospect.id ? null : prospect.id)
                        }
                        aria-label="Menu d'options pour ce prospect"
                        title="Plus d'actions"
                        className="h-8 w-8 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] flex items-center justify-center border border-[#2A2A2F] transition-colors relative"
                      >
                        <MoreVertical className="w-3.5 h-3.5 text-[#A0A0A8]" />
                        {hasNote && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1"
                            title="Une note est enregistrée"
                          />
                        )}
                      </button>

                      {activeMenuId === prospect.id && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 top-9 z-30 w-44 rounded-[8px] bg-[#17171A] border border-[#2A2A2F] shadow-xl py-1 text-xs divide-y divide-[#2A2A2F] animate-fade-in">
                            <div className="py-0.5">
                              {demo && (
                                <>
                                  <a
                                    href={demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Ouvrir la démo dans un nouvel onglet"
                                    title="Ouvrir la démo"
                                    onClick={() => setActiveMenuId(null)}
                                    className="flex items-center gap-2 px-3 py-2 text-[#EDEDEF] hover:bg-[#1E1E22] transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-[#6E6E76]" />
                                    <span>Ouvrir la démo</span>
                                  </a>
                                  <Link
                                    href={`/demos/${demo.id}/edit`}
                                    aria-label="Modifier la démo"
                                    title="Modifier la démo"
                                    onClick={() => setActiveMenuId(null)}
                                    className="flex items-center gap-2 px-3 py-2 text-[#EDEDEF] hover:bg-[#1E1E22] transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-[#6E6E76]" />
                                    <span>Modifier la démo</span>
                                  </Link>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedNotes((prev) => ({
                                    ...prev,
                                    [prospect.id]: !prev[prospect.id],
                                  }))
                                  setActiveMenuId(null)
                                }}
                                aria-label={hasNote ? "Consulter ou modifier la note" : "Ajouter une note"}
                                title={hasNote ? "Consulter ou modifier la note" : "Ajouter une note"}
                                className="w-full flex items-center gap-2 px-3 py-2 text-[#EDEDEF] hover:bg-[#1E1E22] transition-colors text-left"
                              >
                                <StickyNote className="w-3.5 h-3.5 text-[#6E6E76]" />
                                <span>{hasNote ? "Modifier la note" : "Ajouter une note"}</span>
                              </button>
                            </div>

                            <div className="py-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteProspect(prospect)
                                  setActiveMenuId(null)
                                }}
                                aria-label="Supprimer ce prospect et sa démo"
                                title="Supprimer ce prospect"
                                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-left"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* NOTE PRIVÉE ÉTENDUE */}
                {isNoteOpen && (
                  <div className="mt-3 pt-3 border-t border-[#2A2A2F] flex flex-col sm:flex-row gap-2 animate-fade-in">
                    <input
                      type="text"
                      defaultValue={prospect.notes || ""}
                      onChange={(e) =>
                        setNotesDrafts({
                          ...notesDrafts,
                          [prospect.id]: e.target.value,
                        })
                      }
                      placeholder="Note privée (ex : gérant Karim, rappeler jeudi 15h)…"
                      aria-label="Contenu de la note privée"
                      className="flex-1 h-8 px-3 rounded-[6px] bg-[#1E1E22] border border-[#2A2A2F] text-xs text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                    />
                    <button
                      type="button"
                      disabled={savingNoteId === prospect.id}
                      onClick={() => handleSaveNote(prospect.id)}
                      aria-label="Enregistrer la note"
                      className="h-8 px-3 rounded-[6px] bg-[#2A2A2F] hover:bg-[#3A3A42] text-[#EDEDEF] text-xs font-medium transition-colors"
                    >
                      {savingNoteId === prospect.id ? "…" : "Enregistrer"}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION (PROPRE) */}
      <ConfirmModal
        isOpen={Boolean(deleteProspect)}
        title="Supprimer ce prospect ?"
        description={
          deleteProspect
            ? `Voulez-vous vraiment supprimer "${normalizeBusinessName(
                deleteProspect.name
              )}" ? Cette action supprimera également sa démo associée.`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteProspect(null)}
      />

      {/* MODALE DISCRÈTE : PROPOSER STATUT DÉMO ENVOYÉE APRÈS COPIE */}
      <ConfirmModal
        isOpen={Boolean(proposeSentModal)}
        title="Passer en « Démo envoyée » ?"
        description="Vous venez de copier le lien de la démo. Souhaitez-vous mettre à jour le statut du prospect en « Démo envoyée » pour suivre votre prospection ?"
        confirmLabel="Passer en Démo envoyée"
        cancelLabel="Garder À contacter"
        isDestructive={false}
        onConfirm={() => {
          if (proposeSentModal) {
            handleStatusChange(proposeSentModal, "demo_envoyee")
            setProposeSentModal(null)
          }
        }}
        onCancel={() => setProposeSentModal(null)}
      />
    </div>
  )
}
