"use client"

import { useState } from "react"
import Link from "next/link"
import { Prospect, Demo, ProspectStatus } from "@/types/database"
import {
  Users,
  Search,
  Eye,
  Phone,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Check,
  XCircle,
  Copy,
  Trash2,
  StickyNote,
  ChevronDown,
  ArrowRight,
  Compass,
  Edit3,
} from "lucide-react"

export interface ProspectWithDemo extends Prospect {
  demos?: Demo[]
}

const STATUS_CONFIG: Record<
  ProspectStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  a_contacter: {
    label: "À contacter",
    bg: "bg-neutral-800",
    text: "text-neutral-300",
    border: "border-neutral-700",
    icon: Clock,
  },
  demo_envoyee: {
    label: "Démo envoyée",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
    icon: MessageSquare,
  },
  interesse: {
    label: "Intéressé",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: Flame,
  },
  signe: {
    label: "Signé !",
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    icon: CheckCircle2,
  },
  perdu: {
    label: "Perdu",
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: XCircle,
  },
}

export default function ProspectsTracker({
  initialProspects,
  rootDomain,
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

  // Statistiques rapides
  const stats = {
    total: prospects.length,
    sent: prospects.filter((p) => p.status === "demo_envoyee").length,
    interested: prospects.filter((p) => p.status === "interesse").length,
    signed: prospects.filter((p) => p.status === "signe").length,
    viewsTotal: prospects.reduce((acc, p) => {
      const demo = p.demos && p.demos[0]
      return acc + (demo?.views_count || 0)
    }, 0),
  }

  // Filtrage
  const filtered = prospects.filter((p) => {
    const matchesStatus = filterStatus === "all" || p.status === filterStatus
    const matchesQuery =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.phone && p.phone.includes(searchQuery))
    return matchesStatus && matchesQuery
  })

  // Mise à jour rapide du statut
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

  // Sauvegarde d'une note
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

  // Suppression d'un prospect
  async function handleDelete(prospectId: string) {
    if (!confirm("Voulez-vous vraiment supprimer ce prospect et sa démo ?")) {
      return
    }

    setProspects((prev) => prev.filter((p) => p.id !== prospectId))

    try {
      await fetch(`/api/prospects/${prospectId}`, { method: "DELETE" })
    } catch (e) {
      console.error("Erreur suppression prospect:", e)
    }
  }

  function handleCopyDemoLink(slug: string, id: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : `http://${rootDomain}`
    navigator.clipboard.writeText(`${origin}/demo/${slug}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* HEADER AVEC TITRE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-400" />
            <span>Suivi des prospects & Vues</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Gère tes opportunités, détecte les vues sur tes démos et convertis tes clients.
          </p>
        </div>

        <Link
          href="/trouver"
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Trouver d&apos;autres commerces</span>
        </Link>
      </div>

      {/* MINI TABLEAU DE BORD KPI DE SUIVI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Total Prospects
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.total}
          </div>
          <span className="text-[11px] text-neutral-500">En pipeline</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">
            Démos Envoyées
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.sent}
          </div>
          <span className="text-[11px] text-neutral-500">Messages transmis</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Vues Totales
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.viewsTotal}
          </div>
          <span className="text-[11px] text-neutral-500">Ouvertures par commerçants</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
            Clients Signés 🤝
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.signed}
          </div>
          <span className="text-[11px] text-neutral-500">Contrats conclus</span>
        </div>
      </div>

      {/* RECHERCHE ET FILTRES PAR STATUT */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
        {/* Champ de recherche rapide */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer par nom de commerce, ville ou téléphone..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Boutons de filtrage par statut */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-neutral-800/80 text-neutral-400 hover:text-white"
            }`}
          >
            Tous ({stats.total})
          </button>

          {(Object.keys(STATUS_CONFIG) as ProspectStatus[]).map((st) => {
            const conf = STATUS_CONFIG[st]
            const count = prospects.filter((p) => p.status === st).length

            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  filterStatus === st
                    ? "bg-neutral-100 text-neutral-950 shadow-sm"
                    : "bg-neutral-800/80 text-neutral-400 hover:text-white"
                }`}
              >
                <span>{conf.label}</span>
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* LISTE DES PROSPECTS */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6">
          <Users className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {prospects.length === 0
              ? "Aucun prospect dans ton pipeline"
              : "Aucun prospect ne correspond à ce filtre"}
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-5 leading-relaxed">
            {prospects.length === 0
              ? "Lance ta première recherche pour cibler des restaurants, barbers ou instituts sans site web."
              : "Essaie de modifier tes critères de filtre ou de recherche."}
          </p>
          {prospects.length === 0 && (
            <Link
              href="/trouver"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Lancer une recherche</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((prospect) => {
            const demo = prospect.demos && prospect.demos[0]
            const viewsCount = demo?.views_count || 0
            const hasViewed = viewsCount > 0
            const statusConf = STATUS_CONFIG[prospect.status]
            const isNoteOpen = expandedNotes[prospect.id]
            const isCopied = copiedId === prospect.id

            return (
              <div
                key={prospect.id}
                className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl hover:border-neutral-700 transition-colors space-y-4"
              >
                {/* LIGNE DU HAUT : NOM, CATÉGORIE, SÉLECTEUR DE STATUT */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-black text-white tracking-tight">
                          {prospect.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-750 uppercase">
                          {prospect.category === "restaurant"
                            ? "🍽️ Restaurant"
                            : prospect.category === "barber"
                            ? "✂️ Barber"
                            : "💅 Institut"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5 flex-wrap">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{prospect.address || prospect.city || "Ville non renseignée"}</span>
                        {prospect.phone && (
                          <>
                            <span>•</span>
                            <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                            <a
                              href={`tel:${prospect.phone}`}
                              className="text-neutral-300 hover:text-white"
                            >
                              {prospect.phone}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* SÉLECTEUR DE STATUT EN 1 CLIC */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] text-neutral-500 font-semibold hidden sm:inline">
                      Statut :
                    </span>
                    <div className="relative">
                      <select
                        value={prospect.status}
                        onChange={(e) =>
                          handleStatusChange(
                            prospect.id,
                            e.target.value as ProspectStatus
                          )
                        }
                        className={`h-9 pl-3 pr-8 rounded-xl text-xs font-bold border outline-none appearance-none cursor-pointer transition-all ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                      >
                        <option value="a_contacter">⏳ À contacter</option>
                        <option value="demo_envoyee">📤 Démo envoyée</option>
                        <option value="interesse">🔥 Intéressé</option>
                        <option value="signe">🤝 Signé !</option>
                        <option value="perdu">❌ Perdu</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                  </div>
                </div>

                {/* LIGNE DU MILIEU : COMPTEUR DE VUES DE LA DÉMO */}
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        hasViewed
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      <Eye className="w-5 h-5" />
                    </div>

                    <div>
                      {demo ? (
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">
                            {viewsCount} {viewsCount > 1 ? "vues" : "vue"}
                          </span>
                          {hasViewed ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                              🟢 Ouvert par le commerçant !
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-500 font-medium">
                              (En attente d&apos;ouverture)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">
                          Aucune démo générée pour l&apos;instant
                        </span>
                      )}

                      {demo && (
                        <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                          Lien : demo.{rootDomain}/{demo.slug}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions directes sur la démo */}
                  <div className="flex items-center gap-2">
                    {demo ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopyDemoLink(demo.slug, prospect.id)}
                          className="h-9 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-800 transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copier lien</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`/demo/${demo.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-800 transition-colors"
                        >
                          <span>Voir</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    ) : (
                      <Link
                        href={`/demos/creer?prospect_id=${prospect.id}`}
                        className="h-9 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Créer sa démo</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* ACCORDÉON NOTES PERSONNELLES */}
                {isNoteOpen && (
                  <div className="pt-2 space-y-2">
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Notes privées (ex: rappels, interlocuteur...)
                    </label>
                    <div className="flex gap-2">
                      <textarea
                        rows={2}
                        defaultValue={prospect.notes || ""}
                        onChange={(e) =>
                          setNotesDrafts({
                            ...notesDrafts,
                            [prospect.id]: e.target.value,
                          })
                        }
                        placeholder="Ex : Le gérant s'appelle Karim, rappeler jeudi vers 15h..."
                        className="flex-1 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-indigo-500 resize-none leading-relaxed"
                      />
                      <button
                        type="button"
                        disabled={savingNoteId === prospect.id}
                        onClick={() => handleSaveNote(prospect.id)}
                        className="h-full px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors shrink-0"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}

                {/* LIGNE DU BAS : ACTIONS COMPLÈTES */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    {demo && (
                      <Link
                        href={`/prospecter?demo_id=${demo.id}`}
                        className="h-8 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Messages prêts à envoyer</span>
                      </Link>
                    )}

                    {demo && (
                      <Link
                        href={`/demos/${demo.id}/edit`}
                        className="h-8 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Personnaliser démo</span>
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
                      className="h-8 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                      <span>{prospect.notes ? "Modifier note" : "+ Note"}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(prospect.id)}
                    className="p-2 text-neutral-500 hover:text-rose-400 transition-colors"
                    title="Supprimer ce prospect"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
