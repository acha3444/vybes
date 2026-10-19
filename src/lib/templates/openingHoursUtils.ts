/**
 * Utilitaire pour le parsing et l'affichage des horaires d'ouverture.
 * Gère le calcul du jour actuel et du statut "Ouvert / Fermé" selon le fuseau horaire Europe/Paris.
 */

export interface DaySchedule {
  dayName: string
  hoursText: string
  isToday: boolean
}

const ORDERED_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

/**
 * Récupère le nom du jour actuel et le nombre de minutes écoulées depuis minuit
 * dans le fuseau horaire Europe/Paris.
 */
export function getParisDateTime(): { currentDayName: string; currentMinutes: number } {
  try {
    const now = new Date()

    // Nom du jour en français dans le fuseau Europe/Paris
    const dayFormatter = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      timeZone: "Europe/Paris",
    })
    const dayRaw = dayFormatter.format(now).toLowerCase()
    const currentDayName = dayRaw.charAt(0).toUpperCase() + dayRaw.slice(1)

    // Heure et minute dans le fuseau Europe/Paris
    const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "Europe/Paris",
    })
    const parts = timeFormatter.formatToParts(now)
    const hourStr = parts.find((p) => p.type === "hour")?.value || "0"
    const minStr = parts.find((p) => p.type === "minute")?.value || "0"
    const currentMinutes = parseInt(hourStr, 10) * 60 + parseInt(minStr, 10)

    return { currentDayName, currentMinutes }
  } catch {
    // Fallback standard si l'environnement ne supporte pas l'Intl timeZone
    const now = new Date()
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    return {
      currentDayName: days[now.getDay()],
      currentMinutes: now.getHours() * 60 + now.getMinutes(),
    }
  }
}

export function parseOpeningHours(
  hoursList: string[] = [],
  computeLiveParis = true
): {
  schedules: DaySchedule[]
  isOpenNow: boolean
  hasHours: boolean
} {
  if (!hoursList || hoursList.length === 0) {
    return { schedules: [], isOpenNow: false, hasHours: false }
  }

  const { currentDayName, currentMinutes } = computeLiveParis
    ? getParisDateTime()
    : { currentDayName: "", currentMinutes: -1 }

  const schedules: DaySchedule[] = ORDERED_DAYS.map((day) => {
    // Chercher la ligne qui correspond à ce jour
    const matchingLine = hoursList.find((line) => {
      const lower = line.toLowerCase()
      const dayLower = day.toLowerCase()
      return (
        lower.includes(dayLower) ||
        // Plages de jours (ex: Mardi - Samedi, Lundi - Vendredi)
        (lower.includes("lundi - vendredi") &&
          ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].includes(day)) ||
        (lower.includes("mardi - samedi") &&
          ["Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].includes(day)) ||
        (lower.includes("lundi - samedi") &&
          ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].includes(day)) ||
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
      isToday: computeLiveParis && day === currentDayName,
    }
  })

  // Déterminer si le commerce est actuellement ouvert selon le fuseau Europe/Paris
  let isOpenNow = false
  if (computeLiveParis) {
    const todaySchedule = schedules.find((s) => s.isToday)

    if (
      todaySchedule &&
      todaySchedule.hoursText !== "Fermé" &&
      todaySchedule.hoursText !== "Horaires sur demande"
    ) {
      // Recherche de plages horaires au format "12h00 - 14h30" ou "12:00 - 14:30"
      const timeMatches = todaySchedule.hoursText.matchAll(
        /(\d{1,2})[h:](\d{2})?\s*[-–]\s*(\d{1,2})[h:](\d{2})?/gi
      )
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
  }

  return {
    schedules,
    isOpenNow,
    hasHours: true,
  }
}
