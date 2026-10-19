"use client"

import { useState } from "react"
import Link from "next/link"
import { Demo, DemoContent } from "@/types/database"
import RestaurantTemplate from "@/components/templates/RestaurantTemplate"
import BarberTemplate from "@/components/templates/BarberTemplate"
import BeautyTemplate from "@/components/templates/BeautyTemplate"
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Save,
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
  { name: "Terracotta Chaud", hex: "#c2410c" },
  { name: "Or Brossé", hex: "#eab308" },
  { name: "Framboise Élégant", hex: "#be185d" },
  { name: "Émeraude Chic", hex: "#059669" },
  { name: "Indigo Pur", hex: "#4f46e5" },
  { name: "Ardoise / Noir", hex: "#1c1917" },
]

export default function DemoEditor({
  demo,
  rootDomain,
}: {
  demo: Demo
  rootDomain: string
}) {
  const [content, setContent] = useState<DemoContent>(demo.content)
  const [activeTab, setActiveTab] = useState<"text" | "colors" | "photos">("text")
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor")
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [extending, setExtending] = useState(false)
  const [extendedSuccess, setExtendedSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  const demoUrl = typeof window !== "undefined"
    ? `${window.location.origin}/demo/${demo.slug}`
    : `http://${rootDomain}/demo/${demo.slug}`

  async function handleSave() {
    setSaving(true)
    setSavedSuccess(false)

    try {
      const res = await fetch(`/api/demos/${demo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      } else {
        alert("Erreur lors de la sauvegarde")
      }
    } catch (err) {
      console.error("Erreur de sauvegarde :", err)
    } finally {
      setSaving(false)
    }
  }

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
    setTimeout(() => setCopiedLink(false), 2500)
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
        { name: "Nouvelle formule / Plat", price: "15 €", desc: "Description du service ou ingrédients frais" },
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

  function removeServiceItem(index: number) {
    setContent((prev) => ({
      ...prev,
      services_or_menu: prev.services_or_menu.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* BANNIÈRE HAUTE : LIEN UNIQUE & ACTIONS CLÉS */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="font-extrabold text-xl sm:text-2xl text-white">
              Démo de {content.business_name}
            </h1>
          </div>
          <p className="text-xs text-neutral-400 flex items-center gap-2">
            <span>Code unique : <strong className="text-white">{demo.slug}</strong></span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">
              {extendedSuccess ? "Prolongée de 14 jours !" : "Active pendant 14 jours"}
            </span>
          </p>
        </div>

        {/* Boutons d'action rapides */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="h-11 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Lien copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-400" />
                <span>Copier le lien démo</span>
              </>
            )}
          </button>

          <a
            href={`/demo/${demo.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            <span>Voir en plein écran</span>
            <ExternalLink className="w-4 h-4 text-neutral-400" />
          </a>

          <Link
            href={`/prospecter?demo_id=${demo.id}`}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages de prospection →</span>
          </Link>
        </div>
      </div>

      {/* COMMUTATEUR SUR MOBILE (Éditer vs Voir l'aperçu) */}
      <div className="flex lg:hidden items-center bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
        <button
          type="button"
          onClick={() => setMobileView("editor")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mobileView === "editor"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-neutral-400"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Formulaire</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mobileView === "preview"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-neutral-400"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Aperçu en direct</span>
        </button>
      </div>

      {/* ZONE PRINCIPALE : FORMULAIRE SIMPLE ET PRÉVISUALISATION DIRECTE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNE GAUCHE : LE FORMULAIRE DE PERSONNALISATION ÉPURÉ */}
        <div
          className={`lg:col-span-7 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 ${
            mobileView === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* SÉLECTEUR D'ONGLETS */}
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                activeTab === "text"
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white"
              }`}
            >
              <Type className="w-4 h-4" />
              <span>1. Textes & Offres</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("colors")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                activeTab === "colors"
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>2. Couleurs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("photos")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                activeTab === "photos"
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>3. Photos</span>
            </button>
          </div>

          {/* ONGLET 1 : TEXTES */}
          {activeTab === "text" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Nom de l&apos;établissement
                </label>
                <input
                  type="text"
                  value={content.business_name}
                  onChange={(e) =>
                    setContent({ ...content, business_name: e.target.value })
                  }
                  className="w-full h-11 px-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Slogan d&apos;accroche
                </label>
                <input
                  type="text"
                  value={content.tagline}
                  onChange={(e) =>
                    setContent({ ...content, tagline: e.target.value })
                  }
                  className="w-full h-11 px-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Présentation du commerce
                </label>
                <textarea
                  rows={3}
                  value={content.about}
                  onChange={(e) =>
                    setContent({ ...content, about: e.target.value })
                  }
                  className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={content.phone}
                    onChange={(e) =>
                      setContent({ ...content, phone: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={content.address}
                    onChange={(e) =>
                      setContent({ ...content, address: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* LISTE DES PRESTATIONS OU PLATS */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    {demo.template_type === "restaurant"
                      ? "Carte du restaurant"
                      : "Prestations & Tarifs"}
                  </label>
                  <button
                    type="button"
                    onClick={addServiceItem}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {content.services_or_menu?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nom"
                            value={item.name}
                            onChange={(e) =>
                              updateServiceItem(idx, "name", e.target.value)
                            }
                            className="flex-1 h-9 px-3 rounded-lg bg-neutral-900 border border-neutral-750 text-white text-xs outline-none focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            placeholder="Prix"
                            value={item.price}
                            onChange={(e) =>
                              updateServiceItem(idx, "price", e.target.value)
                            }
                            className="w-24 h-9 px-3 rounded-lg bg-neutral-900 border border-neutral-750 text-white text-xs outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Description succincte"
                          value={item.desc}
                          onChange={(e) =>
                            updateServiceItem(idx, "desc", e.target.value)
                          }
                          className="w-full h-8 px-3 rounded-lg bg-neutral-900 border border-neutral-750 text-neutral-300 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeServiceItem(idx)}
                        className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-850"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 2 : COULEURS */}
          {activeTab === "colors" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Couleur d&apos;accentuation principale
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() =>
                        setContent({ ...content, primary_color: preset.hex })
                      }
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                        content.primary_color === preset.hex
                          ? "border-white bg-neutral-800"
                          : "border-neutral-800 hover:border-neutral-700 bg-neutral-950"
                      }`}
                    >
                      <span
                        style={{ backgroundColor: preset.hex }}
                        className="w-6 h-6 rounded-full shadow-inner border border-white/20"
                      />
                      <span className="text-xs font-semibold text-white">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Code couleur sur-mesure (HEX)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content.primary_color || "#c2410c"}
                    onChange={(e) =>
                      setContent({ ...content, primary_color: e.target.value })
                    }
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={content.primary_color || "#c2410c"}
                    onChange={(e) =>
                      setContent({ ...content, primary_color: e.target.value })
                    }
                    className="w-36 h-10 px-3 rounded-xl bg-neutral-900 border border-neutral-750 text-white font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 3 : PHOTOS */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Photo principale (Hero)
                </label>
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-neutral-800 mb-3 bg-neutral-950">
                  <img
                    src={content.hero_image_url}
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                </div>

                <label className="h-10 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors">
                  <ImageIcon className="w-4 h-4 text-neutral-400" />
                  <span>{uploading ? "Téléversement..." : "Remplacer la photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => handleFileUpload(e, "hero")}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Galerie photos
                  </label>
                  <label className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => handleFileUpload(e, "gallery")}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {content.gallery_images?.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-square border border-neutral-800 group"
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
                            gallery_images: prev.gallery_images.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BARRE DE SAUVEGARDE EN BAS */}
          <div className="pt-5 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="h-12 px-7 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={extending}
              onClick={handleExtend}
              className="text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{extending ? "Prolongation..." : "+ Prolonger de 14 jours"}</span>
            </button>
          </div>
        </div>

        {/* COLONNE DROITE : APERÇU MOBILE EN DIRECT ET EN TEMPS RÉEL (0 DÉLAI) */}
        <div
          className={`lg:col-span-5 sticky top-24 ${
            mobileView === "editor" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-white">Aperçu en temps réel</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                LIVE REACt
              </span>
            </div>

            {/* Simulateur écran mobile réactif */}
            <div className="relative mx-auto w-full max-w-[360px] h-[640px] rounded-[38px] overflow-hidden border-[7px] border-neutral-800 shadow-2xl bg-neutral-950 flex flex-col">
              {/* Encoche haut smartphone */}
              <div className="h-5 bg-neutral-950 w-full flex items-center justify-center shrink-0 z-30">
                <div className="w-20 h-3.5 bg-neutral-800 rounded-b-xl" />
              </div>

              {/* Rendu dynamique du template sélectionné en live avec l'état local */}
              <div className="flex-1 overflow-y-auto scrollbar-none relative">
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
