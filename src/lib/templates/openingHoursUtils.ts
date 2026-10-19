/**
 * Utilitaire pour le parsing et l'affichage des horaires d'ouverture.
 * Gère la détection du jour actuel et le badge "Ouvert maintenant / Fermé".
 */

export interface DaySchedule {
  dayName: string
  hoursText: string
  isToday: boolean
}

const DAYS_FR = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
]

export function parseOpeningHours(hoursList: string[] = []): {
  schedules: DaySchedule[]
  isOpenNow: boolean
  hasHours: boolean
} {
  if (!hoursList || hoursList.length === 0) {
    return { schedules: [], isOpenNow: false, hasHours: false }
  }

  const now = new Date()
  const currentDayIndex = now.getDay() // 0 = Dimanche, 1 = Lundi, ...
  const currentDayName = DAYS_FR[currentDayIndex]
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // Mapper les 7 jours de la semaine (en commençant par Lundi)
  const orderedDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

  const schedules: DaySchedule[] = orderedDays.map((day) => {
    // Chercher la ligne qui correspond à ce jour
    const matchingLine = hoursList.find((line) => {
      const lower = line.toLowerCase()
      const dayLower = day.toLowerCase()
      return (
        lower.includes(dayLower) ||
        // Plages de jours (ex: Mardi - Samedi)
        (lower.includes("lundi - vendredi") && ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].includes(day)) ||
        (lower.includes("mardi - samedi") && ["Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].includes(day)) ||
        (lower.includes("lundi - samedi") && ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].includes(day)) ||
        (lower.includes("dimanche & lundi") && ["Dimanche", "Lundi"].includes(day)) ||
        (lower.includes("dimanche") && day === "Dimanche")
      )
    })

    let hoursText = "Horaires sur demande"
    if (matchingLine) {
      if (matchingLine.toLowerCase().includes("fermé")) {
        hoursText = "Fermé"
      } else {
        const parts = matchingLine.split(":")
        if (parts.length > 1) {
          hoursText = parts.slice(1).join(":").trim()
        } else {
          hoursText = matchingLine
        }
      }
    }

    return {
      dayName: day,
      hoursText,
      isToday: day === currentDayName,
    }
  })

  // Déterminer grossièrement si c'est ouvert maintenant
  const todaySchedule = schedules.find((s) => s.isToday)
  let isOpenNow = false

  if (todaySchedule && todaySchedule.hoursText !== "Fermé" && todaySchedule.hoursText !== "Horaires sur demande") {
    // Recherche de plages horaires au format "12h00 - 14h30" ou "12:00 - 14:30"
    const timeMatches = todaySchedule.hoursText.matchAll(/(\d{1,2})[h:](\d{2})?\s*[-–]\s*(\d{1,2})[h:](\d{2})?/gi)
    for (const match of timeMatches) {
      const startH = parseInt(match[1], 10)
      const startM = match[2] ? parseInt(match[2], 10) : 0
      const endH = parseInt(match[3], 10)
      const endM = match[4] ? parseInt(match[4], 10) : 0

      const startTotal = startH * 60 + startM
      const endTotal = endH * 60 + endM

      if (currentMinutes >= startTotal && currentMinutes <= endTotal) {
        isOpenNow = true
        break
      }
    }
  }

  return {
    schedules,
    isOpenNow,
    hasHours: true,
  }
}
