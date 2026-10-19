import { Clock, ShieldAlert, Sparkles } from "lucide-react"

export default function DemoExpired({ businessName }: { businessName?: string }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center selection:bg-indigo-500 selection:text-white">
      <div className="max-w-md w-full bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-5">
          <Clock className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
          Délai de démonstration écoulé
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Cette démo a expiré
        </h1>

        <p className="text-neutral-300 text-sm leading-relaxed mb-6">
          La période d&apos;aperçu gratuit de 14 jours pour {businessName ? <strong className="text-white">{businessName}</strong> : "cet établissement"} est arrivée à son terme.
        </p>

        <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 text-left text-xs text-neutral-400 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-neutral-300 font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Vous êtes le commerçant ?</span>
          </div>
          <p>
            Contactez le créateur web qui vous a partagé ce lien pour mettre votre site officiel en ligne et activer vos réservations.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
          <ShieldAlert className="w-4 h-4" />
          <span>Site de démonstration archivé</span>
        </div>
      </div>
    </div>
  )
}
