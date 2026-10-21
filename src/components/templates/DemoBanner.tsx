"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"

export default function DemoBanner({
  expiresInDays,
}: {
  expiresInDays?: number
}) {
  const [closed, setClosed] = useState(false)

  if (closed) return null

  return (
    <div className="sticky top-0 z-50 bg-[#17171A] border-b border-[#2A2A2F] text-[#EDEDEF] px-3 py-2 text-xs transition-all shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Info className="w-3 h-3" />
          </span>
          <p className="text-[11px] sm:text-xs truncate">
            <strong className="text-amber-300 font-semibold">Aperçu de démonstration</strong> : ce site n&apos;est pas le site officiel de l&apos;établissement.
            {expiresInDays !== undefined && expiresInDays > 0 && (
              <span className="hidden sm:inline text-[#A0A0A8] ml-1.5 tabular-nums">
                (Aperçu actif encore {expiresInDays}j)
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setClosed(true)}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
          title="Fermer le bandeau"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
