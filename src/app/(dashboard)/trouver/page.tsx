import Link from "next/link"
import { Compass, Sparkles, MapPin, Store } from "lucide-react"

export default function TrouverPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-7 h-7 text-indigo-400" />
            <span>Trouver des commerces</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Découvre les restaurants, barbers et instituts sans site web dans la ville de ton choix.
          </p>
        </div>
      </div>

      {/* Barre de recherche mockup / transition vers Étape 3 */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <MapPin className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              placeholder="Ex: Lyon, Bordeaux, Marseille..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-500 text-sm cursor-not-allowed"
            />
          </div>

          <div className="relative">
            <Store className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              disabled
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-neutral-400 text-sm cursor-not-allowed"
            >
              <option>Tous les commerces (Resto, Barber, Institut)</option>
            </select>
          </div>

          <button
            disabled
            className="w-full h-12 rounded-2xl bg-indigo-600/50 text-indigo-200 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            <span>Module en cours (Étape 3)</span>
          </button>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">
          Recherche Google Places
        </h3>
        <p className="text-xs text-neutral-400 mt-1 mb-4 leading-relaxed">
          Ce module sera activé à l&apos;<strong>Étape 3</strong> avec l&apos;intégration directe de l&apos;API Google Places (New) et le filtrage serveur des commerces sans site web.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300"
        >
          ← Retour au tableau de bord
        </Link>
      </div>
    </div>
  )
}
