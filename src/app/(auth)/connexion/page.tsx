"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getSafeRedirectPath } from "@/lib/auth/redirect"
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react"

function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get("redirect") || searchParams.get("next")
  const redirectPath = getSafeRedirectPath(rawRedirect, "/dashboard")
  const errorParam = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(
    errorParam === "auth_failed" ? "Échec de l'authentification. Réessaie." : ""
  )

  const supabase = createClient()

  function translateAuthError(msg: string): string {
    if (msg === "Load failed" || msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      return "Connexion au serveur impossible : les variables d'environnement Supabase (NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY) ne sont pas configurées sur Vercel. Ajoutez-les dans les Settings de Vercel puis redéployez."
    }
    if (msg === "Invalid login credentials") {
      return "Email ou mot de passe incorrect."
    }
    if (msg.includes("Email not confirmed")) {
      return "Veuillez confirmer votre email avant de vous connecter."
    }
    return msg
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage("")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      setErrorMessage(
        "Configuration manquante sur Vercel : ajoutez les clés Supabase dans les Environment Variables de Vercel puis redéployez."
      )
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(translateAuthError(error.message))
        setLoading(false)
        return
      }

      if (data.user) {
        router.push(redirectPath)
        router.refresh()
      }
    } catch (err: any) {
      setErrorMessage(translateAuthError(err?.message || "Une erreur imprévue est survenue."))
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setErrorMessage("")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      setErrorMessage(
        "Configuration manquante sur Vercel : ajoutez les clés Supabase dans les Environment Variables de Vercel puis redéployez."
      )
      return
    }

    setGoogleLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectPath
          )}`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
        setGoogleLoading(false)
      }
    } catch {
      setErrorMessage("Impossible de démarrer la connexion Google.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Bon retour 👋
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Connecte-toi pour gérer tes prospects et tes démos.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Bouton Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
        className="w-full h-12 rounded-2xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-white font-medium text-sm flex items-center justify-center gap-3 transition-colors active:scale-[0.99] disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Continuer avec Google</span>
      </button>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <span className="relative px-3 bg-neutral-900 text-xs uppercase tracking-wider text-neutral-400 font-medium">
          ou par email
        </span>
      </div>

      {/* Formulaire Email + Password */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
            Email
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Mot de passe
            </label>
            <Link
              href="/mot-de-passe-oublie"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-neutral-500 text-sm outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full h-13 mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <>
              <span>Se connecter</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-400 mt-6">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
        >
          Commence tes 7 jours gratuits
        </Link>
      </p>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <ConnexionForm />
    </Suspense>
  )
}
