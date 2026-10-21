"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Demo, DemoContent, BusinessCategory } from "@/types/database"
import RestaurantTemplate from "@/components/templates/RestaurantTemplate"
import BarberTemplate from "@/components/templates/BarberTemplate"
import BeautyTemplate from "@/components/templates/BeautyTemplate"
import { DEFAULT_SUBTITLES } from "@/lib/templates/defaultContent"
import { normalizeBusinessName } from "@/lib/templates/nameUtils"
import { getDemoUrl, formatExpirationDate } from "@/lib/utils"
import {
  ExternalLink,
  Copy,
  Check,
  Type,
  Palette,
  Image as ImageIcon,
  Clock,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Loader2,
  MessageSquare,
  Smartphone,
  Edit3,
} from "lucide-react"

const COLOR_PRESETS = [
  { name: "Terracotta", hex: "#c2410c" },
  { name: "Or mat", hex: "#eab308" },
  { name: "Framboise", hex: "#be185d" },
  { name: "Émeraude", hex: "#059669" },
  { name: "Violet Vybe", hex: "#6c5ce7" },
  { name: "Ardoise", hex: "#1c1917" },
]

export default function DemoEditor({
  demo,
}: {
  demo: Demo
  rootDomain: string
}) {
  const defaultCategorySubtitle =
    DEFAULT_SUBTITLES[demo.template_type as BusinessCategory] ||
    "Établissement & Prestations de qualité"

  const [content, setContent] = useState<DemoContent>(() => ({
    ...demo.content,
    business_name: normalizeBusinessName(demo.content.business_name),
    subtitle: demo.content.subtitle || defaultCategorySubtitle,
    services_or_menu: demo.content.services_or_menu || [],
  }))

  const [activeTab, setActiveTab] = useState<"text" | "colors" | "photos">("text")
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [copiedLink, setCopiedLink] = useState(false)
  const [extending, setExtending] = useState(false)
  const [extendedSuccess, setExtendedSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  const isInitialMount = useRef(true)
  const demoUrl = getDemoUrl(demo.slug)

  // Enregistrement automatique avec état discret (debounced 800ms)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    setSaveStatus("saving")
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/demos/${demo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        })
        if (res.ok) {
          setSaveStatus("saved")
        } else {
          setSaveStatus("error")
        }
      } catch (err) {
        console.error("Erreur auto-save :", err)
        setSaveStatus("error")
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [content, demo.id])

  async function handleExtend() {
    if (extending) return
    setExtending(true)

    try {
      const res = await fetch(`/api/demos/${demo.id}/extend`, { method: "POST" })
      const data = await res.json()

      if (data.success) {
        setExtendedSuccess(true)
        setTimeout(() => setExtendedSuccess(false), 4000)
      } else {
        alert(data.error || "Impossible de prolonger la démo.")
      }
    } catch {
      alert("Erreur lors de la prolongation.")
    } finally {
      setExtending(false)
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(demoUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, target: "hero" | "gallery") {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.success && data.url) {
        if (target === "hero") {
          setContent((prev) => ({ ...prev, hero_image_url: data.url }))
        } else {
          setContent((prev) => ({
            ...prev,
            gallery_images: [...(prev.gallery_images || []), data.url],
          }))
        }
      } else {
        alert("Erreur upload photo : " + (data.error || ""))
      }
    } catch (err) {
      console.error("Erreur upload :", err)
    } finally {
      setUploading(false)
    }
  }

  function addServiceItem() {
    setContent((prev) => ({
      ...prev,
      services_or_menu: [
        ...(prev.services_or_menu || []),
        { name: "", price: "", desc: "" },
      ],
    }))
  }

  function updateServiceItem(index: number, key: string, value: string) {
    setContent((prev) => {
      const updated = [...(prev.services_or_menu || [])]
      updated[index] = { ...updated[index], [key]: value }
      return { ...prev, services_or_menu: updated }
    })
  }

  // Formatage du prix au format français (ex: 8,50 €)
  function handlePriceBlur(index: number, rawVal: string) {
    if (!rawVal.trim()) return
    const cleaned = rawVal.replace(/[^\d,.-]/g, "").replace(",", ".")
    const num = parseFloat(cleaned)
    if (!isNaN(num)) {
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: num % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(num)
      updateServiceItem(index, "price", formatted)
    }
  }

  function removeServiceItem(index: number) {
    setContent((prev) => ({
      ...prev,
      services_or_menu: (prev.services_or_menu || []).filter((_, i) => i !== index),
    }))
  }

  const expirationText = extendedSuccess
    ? "Prolongée de 14 jours"
    : formatExpirationDate(demo.expires_at)

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* BANNIÈRE HAUTE : LIEN UNIQUE, ÉTAT AUTO-SAVE & ACTIONS */}
      <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h1 className="font-bold text-lg sm:text-xl text-[#EDEDEF]">
              Démo de {normalizeBusinessName(content.business_name)}
            </h1>
          </div>
          <p className="text-xs text-[#A0A0A8] flex items-center gap-2 flex-wrap">
            <span>Code : <strong className="text-[#EDEDEF] tabular-nums">{demo.slug}</strong></span>
            <span>•</span>
            <span className="text-[#EDEDEF]">{expirationText}</span>
            <span>•</span>
            {saveStatus === "saving" && (
              <span className="text-[#A0A0A8] flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-[#6C5CE7]" />
                <span>Enregistrement…</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Enregistré</span>
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-red-400">Erreur de sauvegarde</span>
            )}
            {saveStatus === "idle" && (
              <span className="text-[#6E6E76]">Enregistré</span>
            )}
          </p>
        </div>

        {/* Boutons d'action rapides */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Lien copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6E6E76]" />
                <span>Copier le lien démo</span>
              </>
            )}
          </button>

          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 border border-[#2A2A2F] transition-colors"
          >
            <span>Voir plein écran</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#6E6E76]" />
          </a>

          <Link
            href={`/prospecter?demo_id=${demo.id}`}
            className="h-8 px-3.5 rounded-[6px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Messages de prospection</span>
          </Link>
        </div>
      </div>

      {/* COMMUTATEUR SUR MOBILE (Formulaire vs Aperçu) */}
      <div className="flex lg:hidden items-center bg-[#17171A] p-1 rounded-[8px] border border-[#2A2A2F]">
        <button
          type="button"
          onClick={() => setMobileView("editor")}
          className={`flex-1 py-1.5 rounded-[6px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            mobileView === "editor"
              ? "bg-[#1E1E22] text-[#EDEDEF] border border-[#2A2A2F]"
              : "text-[#A0A0A8]"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Formulaire</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-1.5 rounded-[6px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            mobileView === "preview"
              ? "bg-[#1E1E22] text-[#EDEDEF] border border-[#2A2A2F]"
              : "text-[#A0A0A8]"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Voir l&apos;aperçu</span>
        </button>
      </div>

      {/* ZONE PRINCIPALE : FORMULAIRE ET APERÇU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNE GAUCHE : FORMULAIRE */}
        <div
          className={`lg:col-span-7 bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-4 sm:p-6 space-y-5 ${
            mobileView === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* ONGLETS */}
          <div className="flex items-center gap-1.5 border-b border-[#2A2A2F] pb-3 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`h-8 px-3 rounded-[6px] font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === "text"
                  ? "bg-[#1E1E22] text-[#EDEDEF] border border-[#2A2A2F]"
                  : "text-[#A0A0A8] hover:text-[#EDEDEF]"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Textes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("colors")}
              className={`h-8 px-3 rounded-[6px] font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === "colors"
                  ? "bg-[#1E1E22] text-[#EDEDEF] border border-[#2A2A2F]"
                  : "text-[#A0A0A8] hover:text-[#EDEDEF]"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Couleurs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("photos")}
              className={`h-8 px-3 rounded-[6px] font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === "photos"
                  ? "bg-[#1E1E22] text-[#EDEDEF] border border-[#2A2A2F]"
                  : "text-[#A0A0A8] hover:text-[#EDEDEF]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos</span>
            </button>
          </div>

          {/* ONGLET 1 : TEXTES */}
          {activeTab === "text" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#A0A0A8] mb-1">
                  Nom de l&apos;établissement
                </label>
                <input
                  type="text"
                  value={content.business_name}
                  onChange={(e) =>
                    setContent({ ...content, business_name: e.target.value })
                  }
                  placeholder="Ex : Bistrot du Port"
                  className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs sm:text-sm text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#A0A0A8] mb-1">
                  Sous-titre
                </label>
                <input
                  type="text"
                  placeholder={`Ex : ${defaultCategorySubtitle}`}
                  value={content.subtitle ?? ""}
                  onChange={(e) =>
                    setContent({ ...content, subtitle: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs sm:text-sm text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#A0A0A8] mb-1">
                  Accroche
                </label>
                <input
                  type="text"
                  value={content.tagline ?? ""}
                  onChange={(e) =>
                    setContent({ ...content, tagline: e.target.value })
                  }
                  placeholder="Ex : Cuisine de saison, accueil chaleureux en plein cœur du quartier"
                  className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs sm:text-sm text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#A0A0A8] mb-1">
                  Présentation
                </label>
                <textarea
                  rows={3}
                  value={content.about ?? ""}
                  onChange={(e) =>
                    setContent({ ...content, about: e.target.value })
                  }
                  placeholder="Ex : Situé en plein centre-ville, nous vous accueillons du mardi au samedi dans un cadre sobre et convivial."
                  className="w-full p-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs sm:text-sm text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7] resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#A0A0A8] mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={content.phone ?? ""}
                    onChange={(e) =>
                      setContent({ ...content, phone: e.target.value })
                    }
                    placeholder="Ex : 04 78 00 00 00"
                    className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs sm:text-sm text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#A0A0A8] mb-1">
                    Adresse complète (rue, code postal, ville)
                  </label>
                  <input
                    type="text"
                    value={content.address ?? ""}
                    onChange={(e) =>
                      setContent({ ...content, address: e.target.value })
                    }
                    placeholder="Ex : 12 rue de la République, 69002 Lyon"
                    className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-xs sm:text-sm text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                  />
                </div>
              </div>

              {/* LISTE DES PRESTATIONS OU PLATS (VIDE PAR DÉFAUT, MASQUÉE DANS LA DÉMO SI VIDE) */}
              <div className="pt-3 border-t border-[#2A2A2F]">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <label className="block text-[13px] font-medium text-[#EDEDEF]">
                      {demo.template_type === "restaurant"
                        ? "Plats & Tarifs"
                        : "Prestations & Tarifs"}
                    </label>
                    <p className="text-[11px] text-[#6E6E76]">
                      Section masquée automatiquement dans la démo si aucun élément n&apos;est renseigné.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addServiceItem}
                    className="text-xs text-[#6C5CE7] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(content.services_or_menu || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] space-y-2"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nom (ex : Plat du jour)"
                          value={item.name}
                          onChange={(e) =>
                            updateServiceItem(idx, "name", e.target.value)
                          }
                          className="flex-1 h-8 px-2.5 rounded-[6px] bg-[#17171A] border border-[#2A2A2F] text-xs text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                        />
                        <input
                          type="text"
                          placeholder="Prix (ex : 8,50 €)"
                          value={item.price}
                          onChange={(e) =>
                            updateServiceItem(idx, "price", e.target.value)
                          }
                          onBlur={(e) => handlePriceBlur(idx, e.target.value)}
                          className="w-28 h-8 px-2.5 rounded-[6px] bg-[#17171A] border border-[#2A2A2F] text-xs text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7] font-medium tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => removeServiceItem(idx)}
                          className="p-1.5 text-[#6E6E76] hover:text-red-400 transition-colors"
                          title="Supprimer cet élément"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Description succinte (optionnel)"
                        value={item.desc}
                        onChange={(e) =>
                          updateServiceItem(idx, "desc", e.target.value)
                        }
                        className="w-full h-8 px-2.5 rounded-[6px] bg-[#17171A] border border-[#2A2A2F] text-xs text-[#EDEDEF] placeholder-[#6E6E76] outline-none focus:border-[#6C5CE7]"
                      />
                    </div>
                  ))}

                  {(!content.services_or_menu || content.services_or_menu.length === 0) && (
                    <div className="py-4 text-center text-xs text-[#6E6E76] border border-dashed border-[#2A2A2F] rounded-[8px]">
                      Aucun plat ou prestation renseigné. La section sera invisible dans la démo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 2 : COULEURS */}
          {activeTab === "colors" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#A0A0A8] mb-2">
                  Couleur d&apos;accentuation principale
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected =
                      content.primary_color?.toLowerCase() === preset.hex.toLowerCase()
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() =>
                          setContent({ ...content, primary_color: preset.hex })
                        }
                        className={`p-2.5 rounded-[8px] border flex items-center gap-2.5 transition-colors text-left ${
                          isSelected
                            ? "bg-[#1E1E22] border-[#EDEDEF]"
                            : "bg-[#1E1E22] border-[#2A2A2F] hover:border-[#3A3A42]"
                        }`}
                      >
                        <span
                          style={{ backgroundColor: preset.hex }}
                          className="w-5 h-5 rounded-full shrink-0"
                        />
                        <span className="text-xs font-medium text-[#EDEDEF] truncate flex-1">
                          {preset.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#EDEDEF]" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="p-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F]">
                <label className="block text-[11px] font-medium text-[#6E6E76] mb-1.5">
                  Code couleur hexadécimal libre
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={content.primary_color || "#c2410c"}
                    onChange={(e) =>
                      setContent({ ...content, primary_color: e.target.value })
                    }
                    className="w-8 h-8 rounded-[6px] cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={content.primary_color || "#c2410c"}
                    onChange={(e) =>
                      setContent({ ...content, primary_color: e.target.value })
                    }
                    className="w-28 h-8 px-2.5 rounded-[6px] bg-[#17171A] border border-[#2A2A2F] text-xs font-mono text-[#EDEDEF] uppercase outline-none focus:border-[#6C5CE7]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 3 : PHOTOS */}
          {activeTab === "photos" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#A0A0A8] mb-2">
                  Photo principale (en-tête)
                </label>
                <div className="relative rounded-[8px] overflow-hidden aspect-video border border-[#2A2A2F] mb-2 bg-[#1E1E22]">
                  {content.hero_image_url ? (
                    <img
                      src={content.hero_image_url}
                      alt="En-tête de la démo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#6E6E76]">
                      Visuel de remplacement standard actif
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="h-8 px-3 rounded-[6px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer border border-[#2A2A2F] transition-colors">
                    <ImageIcon className="w-3.5 h-3.5 text-[#6E6E76]" />
                    <span>{uploading ? "Téléversement…" : "Remplacer la photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => handleFileUpload(e, "hero")}
                      className="hidden"
                    />
                  </label>

                  {content.hero_image_url && (
                    <button
                      type="button"
                      onClick={() => setContent((prev) => ({ ...prev, hero_image_url: "" }))}
                      className="h-8 px-3 rounded-[6px] bg-transparent text-xs text-[#6E6E76] hover:text-red-400 transition-colors"
                    >
                      Utiliser le visuel sobre par défaut
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A2A2F]">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-[13px] font-medium text-[#A0A0A8]">
                    Galerie photos (optionnel)
                  </label>
                  <label className="text-xs text-[#6C5CE7] hover:underline flex items-center gap-1 font-medium cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => handleFileUpload(e, "gallery")}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {(content.gallery_images || []).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-[6px] overflow-hidden aspect-square border border-[#2A2A2F] group"
                    >
                      <img
                        src={img}
                        alt={`Galerie ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            gallery_images: prev.gallery_images.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-1 right-1 p-1 rounded-[4px] bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>

                {(!content.gallery_images || content.gallery_images.length === 0) && (
                  <p className="text-[11px] text-[#6E6E76] mt-1">
                    Sans photo de galerie, la section est masquée pour préserver un rendu impeccable.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PIED DU FORMULAIRE : PROLONGATION */}
          <div className="pt-4 border-t border-[#2A2A2F] flex items-center justify-between text-xs text-[#6E6E76]">
            <span>
              Toutes les modifications sont enregistrées en temps réel.
            </span>
            <button
              type="button"
              disabled={extending}
              onClick={handleExtend}
              className="text-[#A0A0A8] hover:text-[#EDEDEF] transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{extending ? "Prolongation…" : "Prolonger de 14 jours"}</span>
            </button>
          </div>
        </div>

        {/* COLONNE DROITE : APERÇU DIRECT DANS UN SMARTPHONE SOBRE */}
        <div
          className={`lg:col-span-5 sticky top-20 ${
            mobileView === "editor" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="bg-[#17171A] border border-[#2A2A2F] rounded-[12px] p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 px-1 text-xs">
              <span className="font-medium text-[#EDEDEF]">
                Aperçu mobile en direct
              </span>
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6C5CE7] hover:underline flex items-center gap-1"
              >
                <span>Ouvrir</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Cadre smartphone sans mockup extravagant */}
            <div className="relative mx-auto w-full max-w-[340px] h-[580px] rounded-[24px] overflow-hidden border border-[#2A2A2F] bg-[#0F0F11] flex flex-col shadow-lg">
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {demo.template_type === "restaurant" && (
                  <RestaurantTemplate content={content} isPreview={true} />
                )}
                {demo.template_type === "barber" && (
                  <BarberTemplate content={content} isPreview={true} />
                )}
                {demo.template_type === "beauty" && (
                  <BeautyTemplate content={content} isPreview={true} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
