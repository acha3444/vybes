"use client"

import { useState } from "react"
import Link from "next/link"
import { Demo, Prospect } from "@/types/database"
import { generateProspectingMessages } from "@/lib/prospecting/messages"
import { normalizeBusinessName } from "@/lib/templates/nameUtils"
import { getDemoUrl } from "@/lib/utils"
import {
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Send,
  Mail,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  Share2,
} from "lucide-react"

export default function ProspectingView({
  demo,
  prospect,
  initialFreelanceName,
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

  const demoUrl = getDemoUrl(demo.slug)
  const cleanBusinessName = normalizeBusinessName(prospect.name)

  const messages = generateProspectingMessages({
    businessName: cleanBusinessName,
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
        setTimeout(() => setStatusUpdatedAlert(false), 3000)
      }
    } catch (e) {
      console.error("Erreur mise à jour statut prospect:", e)
    }
  }

  function handleCopy(text: string, format: string) {
    navigator.clipboard.writeText(text)
    setCopiedFormat(format)
    markAsSent()
    setTimeout(() => setCopiedFormat(null), 2000)
  }

  const cleanPhone = prospect.phone ? prospect.phone.replace(/[^0-9+]/g, "") : ""
  const internationalPhone = cleanPhone.startsWith("0")
    ? `33${cleanPhone.slice(1)}`
    : cleanPhone

  const categoryLabel =
    prospect.category === "restaurant"
      ? "Restaurant"
      : prospect.category === "barber"
      ? "Barber"
      : "Institut"

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* RETOUR & HEADER */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/demos/${demo.id}/edit`}
          className="inline-flex items-center gap-1.5 text-xs text-[#A0A0A8] hover:text-[#EDEDEF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;éditeur de la démo</span>
        </Link>

        {statusUpdatedAlert && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Statut mis à jour : Démo envoyée</span>
          </div>
        )}
      </div>

      {/* EN-TÊTE DU COMMERCE */}
      <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium text-[#A0A0A8] block mb-1">
            Prospect ciblé
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-[#EDEDEF]">
              {cleanBusinessName}
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-[#1E1E22] text-[#A0A0A8] border border-[#2A2A2F]">
              {categoryLabel}
            </span>
          </div>
          <p className="text-xs text-[#6E6E76] mt-1">
            {prospect.city || "France"} {prospect.phone ? `• ${prospect.phone}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
          >
            <span>Voir la démo</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#6E6E76]" />
          </a>
        </div>
      </div>

      {/* PERSONNALISATION DU PRÉNOM */}
      <div className="p-3.5 rounded-[8px] bg-[#17171A] border border-[#2A2A2F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-xs text-[#A0A0A8]">
          Prénom affiché pour signer le message :
        </label>
        <input
          type="text"
          value={freelanceName}
          onChange={(e) => setFreelanceName(e.target.value)}
          placeholder="Ton prénom"
          className="h-8 px-3 rounded-[6px] bg-[#1E1E22] border border-[#2A2A2F] text-xs text-[#EDEDEF] outline-none focus:border-[#6C5CE7] w-full sm:w-48"
        />
      </div>

      {/* LES 3 FORMATS DE MESSAGES */}
      <div className="space-y-4">
        {/* 1. INSTAGRAM DM */}
        <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#A0A0A8]" />
              <h2 className="font-semibold text-sm text-[#EDEDEF]">
                Message Instagram (DM)
              </h2>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(messages.instagram, "instagram")}
              className="h-8 px-3 rounded-[6px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copiedFormat === "instagram" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le DM</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs text-[#EDEDEF] whitespace-pre-wrap leading-relaxed font-mono">
            {messages.instagram}
          </div>
        </div>

        {/* 2. SMS / WHATSAPP */}
        <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#A0A0A8]" />
              <h2 className="font-semibold text-sm text-[#EDEDEF]">
                SMS / WhatsApp
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(messages.sms, "sms")}
                className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
              >
                {copiedFormat === "sms" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#6E6E76]" />
                    <span>Copier le SMS</span>
                  </>
                )}
              </button>

              {prospect.phone && (
                <a
                  href={`https://wa.me/${internationalPhone}?text=${encodeURIComponent(
                    messages.sms
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={markAsSent}
                  className="h-8 px-3 rounded-[6px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Ouvrir WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs text-[#EDEDEF] whitespace-pre-wrap leading-relaxed font-mono">
            {messages.sms}
          </div>
        </div>

        {/* 3. EMAIL */}
        <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#A0A0A8]" />
              <h2 className="font-semibold text-sm text-[#EDEDEF]">
                Email
              </h2>
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
                className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
              >
                {copiedFormat === "email" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#6E6E76]" />
                    <span>Copier l&apos;email</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:?subject=${encodeURIComponent(
                  messages.email.subject
                )}&body=${encodeURIComponent(messages.email.body)}`}
                onClick={markAsSent}
                className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
              >
                <Mail className="w-3 h-3 text-[#6E6E76]" />
                <span>Ouvrir client mail</span>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-[6px] bg-[#1E1E22] border border-[#2A2A2F] text-xs flex items-center gap-2">
              <span className="text-[#A0A0A8] font-medium shrink-0">Objet :</span>
              <span className="text-[#EDEDEF] truncate">{messages.email.subject}</span>
            </div>
            <div className="p-3.5 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs text-[#EDEDEF] whitespace-pre-wrap leading-relaxed font-mono">
              {messages.email.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
