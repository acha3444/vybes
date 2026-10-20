"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react"

export default function ReinitialiserMotDePassePage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage("")

    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit comporter au moins 6 caractères.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les deux mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)

      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 2500)
    } catch {
      setErrorMessage("Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Mot de passe mis à jour ! 🎉
        </h2>
        <p className="text-neutral-400 text-sm mb-6">
          Ton nouveau mot de passe a bien été enregistré. Redirection automatique vers ton dashboard...
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/30"
        >
          Accéder au dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 mx-auto w-fit">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Nouveau mot de passe</span>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Choisis ton mot de passe 🔐
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Définis un mot de passe sécurisé pour ton compte Vybe.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-neutral-500 text-sm outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Retape ton mot de passe"
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-neutral-500 text-sm outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-13 mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <>
              <span>Enregistrer le mot de passe</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
