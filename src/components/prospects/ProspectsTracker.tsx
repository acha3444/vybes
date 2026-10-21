"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Prospect, Demo, ProspectStatus } from "@/types/database"
import { calculateUnifiedKpis } from "@/lib/prospects/stats"
import { normalizeBusinessName } from "@/lib/templates/nameUtils"
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

  // Filtrage
  const filtered = useMemo(() => {
    return sortedProspects.filter((p) => {
      const matchesStatus = filterStatus === "all" || p.status === filterStatus
      const q = searchQuery.trim().toLowerCase()
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q))
      return matchesStatus && matchesQuery
    })
  }, [sortedProspects, filterStatus, searchQuery])

  // Mise à jour du statut
  async function handleStatusChange(prospectId: string, newStatus: ProspectStatus) {
    setProspects((prev) =>
      prev.map((p) => (p.id === prospectId ? { ...p, status: newStatus } : p))
    )

    try {
      await fetch(`/api/prospects/${prospectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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

  // Copie sécurisée du lien démo
  function handleCopyDemoLink(slug: string, prospect: ProspectWithDemo) {
    const url = getDemoUrl(slug)
    navigator.clipboard.writeText(url)
    setCopiedId(prospect.id)
    setTimeout(() => setCopiedId(null), 2000)

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
          <span className="text-[11px] text-[#6E6E76]">Statut ≥ envoyée</span>
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
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">
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
              const count = prospects.filter((p) => p.status === st).length
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
              ? "Aucun prospect dans le pipeline"
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
          {filtered.map((prospect) => {
            const demo = prospect.demos && prospect.demos[0]
            const viewsCount = demo?.views_count || 0
            const hasViewed = viewsCount > 0
            const isLost = prospect.status === "perdu"
            const isNoteOpen = expandedNotes[prospect.id]
            const isCopied = copiedId === prospect.id
            const demoUrl = demo ? getDemoUrl(demo.slug) : ""
            const statusStyle = STATUS_STYLES[prospect.status]

            return (
              <div
                key={prospect.id}
                className={`p-3.5 sm:p-4 transition-colors hover:bg-[#1E1E22]/50 ${
                  isLost ? "opacity-45 bg-[#121214]" : ""
                }`}
              >
                {/* LIGNE PRINCIPALE DU PROSPECT */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* IDENTITÉ DU COMMERCE */}
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {hasViewed && !isLost && (
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"
                        title="Démo ouverte par le commerçant"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-sm truncate ${
                            isLost ? "line-through text-[#A0A0A8]" : "text-[#EDEDEF]"
                          }`}
                        >
                          {normalizeBusinessName(prospect.name)}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-[#1E1E22] text-[#A0A0A8] border border-[#2A2A2F]">
                          {CATEGORY_LABELS[prospect.category] || prospect.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6E76] mt-0.5 flex items-center gap-2 flex-wrap">
                        {prospect.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#6E6E76]" />
                            <span>{prospect.city}</span>
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

                  {/* STATUT DU PROSPECT */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={prospect.status}
                      onChange={(e) =>
                        handleStatusChange(prospect.id, e.target.value as ProspectStatus)
                      }
                      className={`h-8 px-2.5 rounded-[6px] text-xs font-medium border outline-none cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {(Object.keys(STATUS_LABELS) as ProspectStatus[]).map((st) => (
                        <option key={st} value={st} className="bg-[#17171A] text-[#EDEDEF]">
                          {STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* VUES DÉMO */}
                  <div className="text-xs text-[#A0A0A8] shrink-0 min-w-[180px]">
                    {demo ? (
                      <div>
                        {viewsCount === 0 ? (
                          <span className="text-[#6E6E76]">Pas encore ouverte</span>
                        ) : (
                          <span className="text-[#EDEDEF] tabular-nums font-medium">
                            Ouverte {viewsCount} fois
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

                  {/* ACTIONS DENSES */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start lg:self-center">
                    {!isLost && demo && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopyDemoLink(demo.slug, prospect)}
                          className="h-8 px-2.5 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
                          title="Copier le lien démo garanti"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#6E6E76]" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/prospecter?demo_id=${demo.id}`}
                          className="h-8 px-2.5 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
                          title="Messages de prospection"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#6E6E76]" />
                          <span>Messages</span>
                        </Link>

                        <a
                          href={demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] flex items-center justify-center border border-[#2A2A2F] transition-colors"
                          title="Ouvrir la démo"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#6E6E76]" />
                        </a>

                        <Link
                          href={`/demos/${demo.id}/edit`}
                          className="h-8 w-8 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] flex items-center justify-center border border-[#2A2A2F] transition-colors"
                          title="Modifier la démo"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#6E6E76]" />
                        </Link>
                      </>
                    )}

                    {!isLost && !demo && (
                      <Link
                        href={`/demos/creer?prospect_id=${prospect.id}`}
                        className="h-8 px-2.5 rounded-[6px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Créer démo</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedNotes((prev) => ({
                          ...prev,
                          [prospect.id]: !prev[prospect.id],
                        }))
                      }
                      className={`h-8 w-8 rounded-[6px] flex items-center justify-center border transition-colors ${
                        prospect.notes
                          ? "bg-[#1E1E22] text-[#EDEDEF] border-[#6C5CE7]"
                          : "bg-[#1E1E22] text-[#6E6E76] hover:text-[#EDEDEF] border-[#2A2A2F]"
                      }`}
                      title={prospect.notes ? "Voir la note" : "Ajouter une note"}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteProspect(prospect)}
                      className="h-8 w-8 rounded-[6px] bg-transparent text-[#6E6E76] hover:text-red-400 hover:bg-[#1E1E22] flex items-center justify-center transition-colors"
                      title="Supprimer ce prospect"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* NOTE PRIVÉE ÉTENDUE */}
                {isNoteOpen && (
                  <div className="mt-3 pt-3 border-t border-[#2A2A2F] flex flex-col sm:flex-row gap-2">
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
                      className="flex-1 h-8 px-3 rounded-[6px] bg-[#1E1E22] border border-[#2A2A2F] text-xs text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                    />
                    <button
                      type="button"
                      disabled={savingNoteId === prospect.id}
                      onClick={() => handleSaveNote(prospect.id)}
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
