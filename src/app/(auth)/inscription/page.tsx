"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, Sparkles } from "lucide-react"

export default function InscriptionPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successEmailSent, setSuccessEmailSent] = useState(false)

  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage("")

    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit comporter au moins 6 caractères.")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
        setLoading(false)
        return
      }

      // Si Supabase requiert confirmation d'email
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setErrorMessage("Cet email est déjà utilisé. Connecte-toi.")
        setLoading(false)
        return
      }

      if (data.session) {
        // Connecté automatiquement
        router.push("/dashboard")
        router.refresh()
      } else {
        // Email de confirmation envoyé
        setSuccessEmailSent(true)
        setLoading(false)
      }
    } catch {
      setErrorMessage("Une erreur imprévue est survenue lors de l'inscription.")
      setLoading(false)
    }
  }

  async function handleGoogleSignUp() {
    setErrorMessage("")
    setGoogleLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
        setGoogleLoading(false)
      }
    } catch {
      setErrorMessage("Impossible de démarrer l'inscription avec Google.")
      setGoogleLoading(false)
    }
  }

  if (successEmailSent) {
    return (
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Vérifie ta boîte mail !
        </h2>
        <p className="text-neutral-400 text-sm mb-6">
          Nous avons envoyé un lien magique de confirmation à <strong className="text-white">{email}</strong>.
          Clique dessus pour activer ton compte et commencer tes 7 jours gratuits.
        </p>
        <Link
          href="/connexion"
          className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition-colors"
        >
          Retour à la page de connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Badge essai gratuit */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 mx-auto w-fit">
        <Sparkles className="w-3.5 h-3.5" />
        <span>7 jours d&apos;essai gratuit offerts</span>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Décroche ton 1er client 🚀
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Crée ton compte en 30 secondes et génère ta première démo de site.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Inscription Google */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
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
        <span>S&apos;inscrire avec Google</span>
      </button>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <span className="relative px-3 bg-neutral-900 text-xs uppercase tracking-wider text-neutral-400 font-medium">
          ou avec ton adresse email
        </span>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
            Prénom ou Nom
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alexandre"
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-neutral-500 text-sm outline-none transition-all"
            />
          </div>
        </div>

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
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
            Mot de passe
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

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full h-13 mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <>
              <span>Démarrer mes 7 jours gratuits</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-400 mt-6">
        Déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}
