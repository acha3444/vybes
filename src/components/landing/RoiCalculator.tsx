"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"

const MONTHLY_PRICE = 29

export function RoiCalculator() {
  const [price, setPrice] = useState(600)
  const months = Math.floor(price / MONTHLY_PRICE)
  const progress = ((price - 200) / (2000 - 200)) * 100

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <label htmlFor="roi-price" className="text-sm font-medium text-neutral-300">
          Prix auquel tu vends un site
        </label>
        <span className="font-mono text-2xl font-bold text-white tabular-nums">
          {price.toLocaleString("fr-FR")} €
        </span>
      </div>

      <input
        id="roi-price"
        type="range"
        min={200}
        max={2000}
        step={50}
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-500"
        style={{
          background: `linear-gradient(to right, #818cf8 0%, #c084fc ${progress}%, rgb(255 255 255 / 0.08) ${progress}%)`,
        }}
      />

      <div className="mt-8 flex items-end gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <p className="text-neutral-300 leading-snug">
          Un seul client signé rembourse{" "}
          <span
            key={months}
            className="inline-block animate-fade-up font-black text-3xl sm:text-4xl text-gradient align-baseline"
          >
            {months} mois
          </span>{" "}
          de Vybe.
        </p>
      </div>
    </div>
  )
}
