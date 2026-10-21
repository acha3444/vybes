import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { VybeLogo } from "@/components/ui/VybeLogo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-[#0F0F11] text-[#EDEDEF] flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-[#6C5CE7] selection:text-white">
      {/* Header avec logo */}
      <header className="relative max-w-md w-full mx-auto flex items-center justify-between py-2">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <VybeLogo
            size="md"
            variant="standalone"
          />
        </Link>

        <span className="text-[11px] font-medium text-[#A0A0A8] bg-[#17171A] border border-[#2A2A2F] px-2.5 py-1 rounded-[6px]">
          Essai 7 jours inclus
        </span>
      </header>

      {/* Contenu de la page */}
      <main className="relative max-w-md w-full mx-auto my-auto py-6 animate-fade-in">
        {children}
      </main>

      {/* Footer rassurant */}
      <footer className="relative max-w-md w-full mx-auto text-center py-4">
        <div className="flex items-center justify-center gap-2 text-xs text-[#6E6E76]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Essai gratuit de 7 jours • Sans engagement • Annulable à tout moment</span>
        </div>
      </footer>
    </div>
  )
}
