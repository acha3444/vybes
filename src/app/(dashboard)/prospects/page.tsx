import Link from "next/link"
import { Users, Compass } from "lucide-react"

export default function ProspectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-400" />
            <span>Suivi des prospects</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Gère l&apos;état d&apos;avancement de tes contacts (à contacter, démo envoyée, intéressé, signé).
          </p>
        </div>
      </div>

      <div className="py-16 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6">
        <div className="w-14 h-14 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          Aucun prospect enregistré
        </h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
          Dès que tu trouveras un commerce et généreras une démo, tu pourras suivre son statut et ses vues ici.
        </p>
        <Link
          href="/trouver"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Trouver mon premier commerce</span>
        </Link>
      </div>
    </div>
  )
}
