"use client"

import { parseOpeningHours } from "@/lib/templates/openingHoursUtils"
import { Clock, CheckCircle, XCircle } from "lucide-react"

interface OpeningHoursCardProps {
  hoursList?: string[]
  primaryColor?: string
  themeMode?: "dark" | "light"
}

export default function OpeningHoursCard({
  hoursList = [],
  primaryColor = "#c2410c",
  themeMode = "dark",
}: OpeningHoursCardProps) {
  if (!hoursList || hoursList.length === 0) {
    return null
  }

  const { schedules, isOpenNow, hasHours } = parseOpeningHours(hoursList)

  if (!hasHours || schedules.length === 0) {
    return null
  }

  const isLight = themeMode === "light"

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border shadow-xl ${
        isLight
          ? "bg-white border-neutral-200"
          : "bg-neutral-900/90 border-neutral-800"
      }`}
    >
      <div className="flex items-center justify-between pb-5 border-b border-neutral-200/50 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-neutral-400" />
          <h3
            className={`font-bold text-base sm:text-lg ${
              isLight ? "text-neutral-900" : "text-white"
            }`}
          >
            Horaires d&apos;ouverture
          </h3>
        </div>

        {/* BADGE OUVERT MAINTENANT / FERMÉ */}
        {isOpenNow ? (
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ouvert</span>
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Fermé</span>
          </span>
        )}
      </div>

      <div className="mt-5 space-y-2.5">
        {schedules.map((schedule) => (
          <div
            key={schedule.dayName}
            className={`flex items-center justify-between py-2 px-3 rounded-xl text-xs sm:text-sm transition ${
              schedule.isToday
                ? isLight
                  ? "bg-neutral-100 font-bold border-l-3 border-emerald-500 text-neutral-950"
                  : "bg-neutral-800/90 font-bold border-l-3 border-emerald-400 text-white"
                : isLight
                ? "text-neutral-700"
                : "text-neutral-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{schedule.dayName}</span>
              {schedule.isToday && (
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider"
                  style={{
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor,
                  }}
                >
                  Aujourd&apos;hui
                </span>
              )}
            </div>

            <span
              className={
                schedule.hoursText.toLowerCase().includes("fermé")
                  ? "text-neutral-500 italic"
                  : schedule.isToday
                  ? isLight
                    ? "text-neutral-950 font-bold"
                    : "text-white font-bold"
                  : isLight
                  ? "text-neutral-800"
                  : "text-neutral-300"
              }
            >
              {schedule.hoursText}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
