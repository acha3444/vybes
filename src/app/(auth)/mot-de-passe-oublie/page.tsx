"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        // En cas d'indisponibilité de la route API, repli sur le client Supabase
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser-mot-de-passe`,
        })
      }

      setSuccess(true)
      setLoading(false)
    } catch {
      // Repli gracieux
      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser-mot-de-passe`,
        })
        setSuccess(true)
      } catch {
        setErrorMessage("Impossible d'envoyer l'email de réinitialisation.")
      }
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Email envoyé !</h2>
        <p className="text-neutral-400 text-sm mb-6">
          Si un compte est associé à <strong className="text-white">{email}</strong>, tu vas recevoir un lien pour choisir un nouveau mot de passe.
        </p>
        <Link
          href="/connexion"
          className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition-colors"
        >
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <Link
        href="/connexion"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à la connexion</span>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Mot de passe oublié ?
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Entre ton adresse email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
            Email de ton compte
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
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
              <span>Envoyer le lien</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
