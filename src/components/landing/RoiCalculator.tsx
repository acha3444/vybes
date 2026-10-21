"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"

const MONTHLY_PRICE = 29

export function RoiCalculator() {
  const [price, setPrice] = useState(600)
  const months = Math.floor(price / MONTHLY_PRICE)

  return (
    <div className="rounded-[12px] border border-[#2A2A2F] bg-[#17171A] p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <label htmlFor="roi-price" className="text-xs font-medium text-[#A0A0A8] block">
            Prix de vente d&apos;un site
          </label>
          <span className="text-[11px] text-[#6E6E76]">Tarif moyen facturé à un commerce</span>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-[#EDEDEF] tabular-nums">
          {price.toLocaleString("fr-FR")} €
        </span>
      </div>

      <div>
        <input
          id="roi-price"
          type="range"
          min={200}
          max={2000}
          step={50}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#1E1E22] accent-[#6C5CE7]"
        />
        <div className="flex justify-between text-[11px] text-[#6E6E76] mt-1.5 tabular-nums">
          <span>200 €</span>
          <span>1 000 €</span>
          <span>2 000 €</span>
        </div>
      </div>

      <div className="pt-4 border-t border-[#2A2A2F] flex items-center gap-3">
        <div className="w-9 h-9 rounded-[8px] bg-[#1E1E22] border border-[#2A2A2F] text-[#6C5CE7] flex items-center justify-center shrink-0">
          <Calculator className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm text-[#A0A0A8] leading-relaxed">
          Si tu vends un site <strong className="text-[#EDEDEF] tabular-nums">{price.toLocaleString("fr-FR")} €</strong>, il couvre{" "}
          <strong className="text-[#6C5CE7] tabular-nums font-bold text-base sm:text-lg">
            {months} mois
          </strong>{" "}
          d&apos;abonnement.
        </p>
      </div>
    </div>
  )
}
