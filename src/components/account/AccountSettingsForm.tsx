"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, CheckCircle2, AlertCircle, Shield } from "lucide-react"

interface AccountSettingsFormProps {
  initialFirstName: string
  initialLastName: string
  email: string
}

function capitalize(str: string): string {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function AccountSettingsForm({
  initialFirstName,
  initialLastName,
  email,
}: AccountSettingsFormProps) {
  const router = useRouter()
  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName, setLastName] = useState(initialLastName)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsSavingProfile(true)
    setProfileSuccess(null)
    setProfileError(null)

    const cleanFirst = capitalize(firstName.trim())
    const cleanLast = capitalize(lastName.trim())

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: cleanFirst,
          lastName: cleanLast,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFirstName(cleanFirst)
        setLastName(cleanLast)
        setProfileSuccess("Profil mis à jour avec succès")
        router.refresh()
        setTimeout(() => setProfileSuccess(null), 3000)
      } else {
        setProfileError(data.error || "Une erreur est survenue lors de l'enregistrement.")
      }
    } catch (err: any) {
      setProfileError(err?.message || "Erreur réseau.")
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setIsSavingPassword(true)
    setPasswordSuccess(null)
    setPasswordError(null)

    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit comporter au moins 8 caractères.")
      setIsSavingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Les deux mots de passe ne correspondent pas.")
      setIsSavingPassword(false)
      return
    }

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setNewPassword("")
        setConfirmPassword("")
        setPasswordSuccess("Mot de passe modifié avec succès.")
        setTimeout(() => setPasswordSuccess(null), 3000)
      } else {
        setPasswordError(data.error || "Impossible de modifier le mot de passe.")
      }
    } catch (err: any) {
      setPasswordError(err?.message || "Erreur réseau.")
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDEF]">
          Mon compte
        </h1>
        <p className="text-xs text-[#A0A0A8] mt-1">
          Gère tes informations personnelles et la sécurité de ton espace Vybe.
        </p>
      </div>

      {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
      <div className="p-5 sm:p-6 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#2A2A2F]">
          <User className="w-4 h-4 text-[#6C5CE7]" />
          <h2 className="text-sm font-semibold text-[#EDEDEF]">
            Informations personnelles
          </h2>
        </div>

        {profileSuccess && (
          <div className="p-3 rounded-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="account-first-name"
                className="block text-xs font-medium text-[#A0A0A8] mb-1.5"
              >
                Prénom
              </label>
              <input
                id="account-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setFirstName(capitalize(firstName.trim()))}
                placeholder="Alexandre"
                required
                className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-[#EDEDEF] placeholder-[#6E6E76] text-xs outline-none focus:border-[#6C5CE7] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="account-last-name"
                className="block text-xs font-medium text-[#A0A0A8] mb-1.5"
              >
                Nom
              </label>
              <input
                id="account-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => setLastName(capitalize(lastName.trim()))}
                placeholder="Martin"
                className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-[#EDEDEF] placeholder-[#6E6E76] text-xs outline-none focus:border-[#6C5CE7] transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="account-email"
              className="block text-xs font-medium text-[#A0A0A8] mb-1.5"
            >
              Adresse email
            </label>
            <input
              id="account-email"
              type="email"
              value={email}
              disabled
              className="w-full h-9 px-3 rounded-[8px] bg-[#121214] border border-[#2A2A2F] text-[#6E6E76] text-xs cursor-not-allowed outline-none"
            />
            <p className="text-[11px] text-[#6E6E76] mt-1">
              L&apos;adresse email est associée à ton compte et sert pour tes connexions.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="h-9 px-4 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSavingProfile ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2 : SÉCURITÉ & MOT DE PASSE */}
      <div className="p-5 sm:p-6 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#2A2A2F]">
          <Lock className="w-4 h-4 text-[#6C5CE7]" />
          <h2 className="text-sm font-semibold text-[#EDEDEF]">
            Mot de passe
          </h2>
        </div>

        {passwordSuccess && (
          <div className="p-3 rounded-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="account-new-password"
                className="block text-xs font-medium text-[#A0A0A8] mb-1.5"
              >
                Nouveau mot de passe
              </label>
              <input
                id="account-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Au moins 8 caractères"
                required
                className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-[#EDEDEF] placeholder-[#6E6E76] text-xs outline-none focus:border-[#6C5CE7] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="account-confirm-password"
                className="block text-xs font-medium text-[#A0A0A8] mb-1.5"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="account-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme ton mot de passe"
                required
                className="w-full h-9 px-3 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-[#EDEDEF] placeholder-[#6E6E76] text-xs outline-none focus:border-[#6C5CE7] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSavingPassword || !newPassword}
              className="h-9 px-4 rounded-[8px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] border border-[#2A2A2F] font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSavingPassword ? "Modification…" : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
