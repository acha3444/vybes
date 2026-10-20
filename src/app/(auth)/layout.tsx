import Link from "next/link"
import { Sparkles, ShieldCheck } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grain relative min-h-screen overflow-hidden bg-[#07070b] text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-indigo-500 selection:text-white">
      {/* Fond : halos + grille */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      {/* Header avec logo */}
      <header className="relative max-w-md w-full mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/25 transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg] group-hover:scale-105">
            V
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white block">
              Vybe
            </span>
            <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">
              Sites Commerces en 60s
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>7 jours gratuits</span>
        </div>
      </header>

      {/* Contenu de la page */}
      <main className="relative max-w-md w-full mx-auto my-auto py-6 animate-fade-up">
        {children}
      </main>

      {/* Footer rassurant */}
      <footer className="relative max-w-md w-full mx-auto text-center py-4">
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Essai gratuit de 7 jours • Sans engagement • Annulable à tout moment</span>
        </div>
      </footer>
    </div>
  )
}
