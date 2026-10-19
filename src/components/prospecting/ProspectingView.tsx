"use client"

import { useState } from "react"
import Link from "next/link"
import { Demo, Prospect } from "@/types/database"
import { generateProspectingMessages } from "@/lib/prospecting/messages"
import {
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Send,
  Mail,
  Smartphone,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Share2,
} from "lucide-react"

export default function ProspectingView({
  demo,
  prospect,
  initialFreelanceName,
  rootDomain,
}: {
  demo: Demo
  prospect: Prospect
  initialFreelanceName: string
  rootDomain: string
}) {
  const [freelanceName, setFreelanceName] = useState(initialFreelanceName || "Alexandre")
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [prospectStatus, setProspectStatus] = useState<string>(prospect.status || "a_contacter")
  const [statusUpdatedAlert, setStatusUpdatedAlert] = useState(false)

  const demoUrl = typeof window !== "undefined"
    ? `${window.location.origin}/demo/${demo.slug}`
    : `http://${rootDomain}/demo/${demo.slug}`

  const messages = generateProspectingMessages({
    businessName: prospect.name,
    category: prospect.category,
    city: prospect.city || "votre ville",
    phone: prospect.phone,
    rating: prospect.rating,
    reviewsCount: prospect.user_ratings_total,
    demoUrl,
    freelanceName,
  })

  // Marque automatiquement le prospect comme 'demo_envoyee' dans la base
  async function markAsSent() {
    if (prospectStatus === "demo_envoyee" || prospectStatus === "interesse" || prospectStatus === "signe") {
      return
    }

    try {
      const res = await fetch(`/api/prospects/${prospect.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "demo_envoyee" }),
      })

      if (res.ok) {
        setProspectStatus("demo_envoyee")
        setStatusUpdatedAlert(true)
        setTimeout(() => setStatusUpdatedAlert(false), 4000)
      }
    } catch (e) {
      console.error("Erreur mise à jour statut prospect:", e)
    }
  }

  function handleCopy(text: string, format: string) {
    navigator.clipboard.writeText(text)
    setCopiedFormat(format)
    markAsSent()
    setTimeout(() => setCopiedFormat(null), 2500)
  }

  // Nettoyage numéro de téléphone pour lien direct WhatsApp / SMS
  const cleanPhone = prospect.phone ? prospect.phone.replace(/[^0-9+]/g, "") : ""
  const internationalPhone = cleanPhone.startsWith("0")
    ? `33${cleanPhone.slice(1)}`
    : cleanPhone

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* RETOUR & HEADER */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/demos/${demo.id}/edit`}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;éditeur de la démo</span>
        </Link>

        {statusUpdatedAlert && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Statut mis à jour : Démo envoyée !</span>
          </div>
        )}
      </div>

      {/* EN-TÊTE DU COMMERCE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Prêt à contacter
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {prospect.name}
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            {prospect.category === "restaurant" ? "🍽️ Restaurant" : prospect.category === "barber" ? "✂️ Coiffure / Barber" : "💅 Institut"} • {prospect.city || "France"} {prospect.phone ? `• ${prospect.phone}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/demo/${demo.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            <span>Voir la démo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* PERSONNALISATION DE TA SIGNATURE */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Ton prénom pour signer le message :</span>
        </div>
        <input
          type="text"
          value={freelanceName}
          onChange={(e) => setFreelanceName(e.target.value)}
          placeholder="Ton prénom"
          className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold text-xs outline-none focus:border-indigo-500 w-full sm:w-44"
        />
      </div>

      {/* LES 3 FORMATS DE MESSAGES */}
      <div className="space-y-6">
        {/* 1. INSTAGRAM DM (RECOMMANDÉ) */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-neutral-700 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">
                    DM Instagram
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    Fort Taux de Réponse
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Idéal à envoyer sur le compte Instagram officiel du commerce.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(messages.instagram, "instagram")}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all active:scale-95"
            >
              {copiedFormat === "instagram" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Message copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copier le DM</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs sm:text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans">
            {messages.instagram}
          </div>
        </div>

        {/* 2. SMS / WHATSAPP */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-neutral-700 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">
                    SMS / WhatsApp
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    98% Taux d&apos;Ouverture
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  À envoyer directement sur le numéro mobile du gérant.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(messages.sms, "sms")}
                className="h-11 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-all active:scale-95"
              >
                {copiedFormat === "sms" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-400" />
                    <span>Copier</span>
                  </>
                )}
              </button>

              {/* Bouton direct WhatsApp */}
              <a
                href={`https://wa.me/${internationalPhone}?text=${encodeURIComponent(
                  messages.sms
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={markAsSent}
                className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ouvrir WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs sm:text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans">
            {messages.sms}
          </div>
        </div>

        {/* 3. EMAIL PROFESSIONNEL */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-neutral-700 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  Email
                </h3>
                <p className="text-xs text-neutral-400">
                  Complet et structuré pour un premier échange par mail.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `Objet : ${messages.email.subject}\n\n${messages.email.body}`,
                    "email"
                  )
                }
                className="h-11 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-all active:scale-95"
              >
                {copiedFormat === "email" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-400" />
                    <span>Copier tout</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:?subject=${encodeURIComponent(
                  messages.email.subject
                )}&body=${encodeURIComponent(messages.email.body)}`}
                onClick={markAsSent}
                className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Ouvrir Mail</span>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center gap-2 text-xs">
              <span className="font-bold text-neutral-400 uppercase tracking-wider shrink-0">
                Objet :
              </span>
              <span className="font-semibold text-white truncate">
                {messages.email.subject}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs sm:text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans">
              {messages.email.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
