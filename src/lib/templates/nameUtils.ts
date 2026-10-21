/**
 * Normalise les noms d'établissements venant de Google Places
 * - Minuscules pour les petits mots français : du, de, la, le, les, des, et, à, au, aux, d', l'
 * - Sauf si le petit mot est le premier mot du nom
 * - Nettoie les sigles juridiques superflus (SARL, SAS, etc.)
 * - Préserve la casse propre pour les autres mots
 */

const FRENCH_LOWERCASE_WORDS = new Set([
  "du",
  "de",
  "la",
  "le",
  "les",
  "des",
  "et",
  "à",
  "au",
  "aux",
])

export function normalizeBusinessName(rawName?: string | null): string {
  if (!rawName) return "Commerce local"

  // 1. Nettoie les sigles juridiques et espaces multiples
  let cleaned = rawName
    .replace(/\b(SARL|SAS|SASU|EURL|SNC|SCI|EI)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()

  if (!cleaned) return "Commerce local"

  // 2. Découpe par mots en conservant la structure
  // Si tout le nom est en MAJUSCULES (ex: "RESTAURANT DU PORT"), on le met en titre propre d'abord
  const isAllUpper = cleaned === cleaned.toUpperCase() && /[A-Z]/.test(cleaned)
  const baseWords = cleaned.split(" ")

  const formattedWords = baseWords.map((word, index) => {
    if (!word) return ""

    // Gestion des apostrophes comme "l'Atelier" ou "d'Or"
    const apostropheIndex = word.indexOf("'")
    if (apostropheIndex > 0 && apostropheIndex < word.length - 1) {
      const prefix = word.slice(0, apostropheIndex).toLowerCase()
      const remainder = word.slice(apostropheIndex + 1)
      const capRemainder =
        remainder.charAt(0).toUpperCase() + remainder.slice(1).toLowerCase()

      if (index === 0) {
        return prefix.charAt(0).toUpperCase() + prefix.slice(1) + "'" + capRemainder
      } else {
        return prefix.toLowerCase() + "'" + capRemainder
      }
    }

    // Gestion des tirets (ex: "Ball-trap-club")
    if (word.includes("-")) {
      return word
        .split("-")
        .map((part, pIdx) => {
          if (!part) return ""
          const lowerPart = part.toLowerCase()
          if (pIdx > 0 && FRENCH_LOWERCASE_WORDS.has(lowerPart)) {
            return lowerPart
          }
          if (isAllUpper) {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          }
          return part
        })
        .join("-")
    }

    const lowerWord = word.toLowerCase()

    // Premier mot du nom complet : toujours en majuscule
    if (index === 0) {
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1)
    }

    // Petits mots français : toujours en minuscules sauf en début de nom
    if (FRENCH_LOWERCASE_WORDS.has(lowerWord)) {
      return lowerWord
    }

    // Autres mots : Majuscule au début si tout était en majuscules ou si le mot est en minuscule
    if (isAllUpper || word === word.toLowerCase()) {
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1)
    }

    // Préserve la casse d'origine si déjà correctement capitalisé
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  return formattedWords.filter(Boolean).join(" ")
}

/**
 * Génère une phrase d'accueil avec une grammaire française irréprochable
 * Ex: "Bienvenue au Restaurant du Ball-trap-club", "Bienvenue chez Johne Coiffure", "Bienvenue à l'Atelier"
 */
export function generateWelcomePhrase(
  rawName: string,
  category: "restaurant" | "barber" | "beauty" = "restaurant",
  city?: string
): string {
  let name = normalizeBusinessName(rawName)

  // Nettoie un éventuel suffixe "De [Ville]" ou "- De Lyon" redondant à la fin du nom commercial
  if (city) {
    const cityRegex = new RegExp(`\\s+(de|à|sur)\\s+${city}$`, "i")
    name = name.replace(cityRegex, "").trim()
  }

  const lower = name.toLowerCase()

  // 1. Déjà "Chez ..."
  if (lower.startsWith("chez ")) {
    return `Bienvenue ${name.charAt(0).toLowerCase() + name.slice(1)}`
  }

  // 2. Débute par un article défini : Le, La, L', Les
  if (lower.startsWith("le ")) {
    return `Bienvenue au ${name.slice(3)}`
  }
  if (lower.startsWith("la ")) {
    return `Bienvenue à la ${name.slice(3)}`
  }
  if (lower.startsWith("l'") || lower.startsWith("l’")) {
    return `Bienvenue à ${name}`
  }
  if (lower.startsWith("les ")) {
    return `Bienvenue aux ${name.slice(4)}`
  }

  // 3. Débute par un nom d'établissement masculin
  const masculineStarts = [
    "restaurant",
    "bistrot",
    "bistro",
    "café",
    "cafe",
    "bar",
    "salon",
    "comptoir",
    "relais",
    "pub",
    "studio",
  ]
  for (const m of masculineStarts) {
    if (lower === m || lower.startsWith(`${m} `)) {
      return `Bienvenue au ${name}`
    }
  }

  // 4. Débute par une voyelle / mot avec élision (Atelier, Institut, Espace)
  const elisionStarts = ["atelier", "institut", "espace"]
  for (const e of elisionStarts) {
    if (lower === e || lower.startsWith(`${e} `)) {
      return `Bienvenue à l'${name}`
    }
  }

  // 5. Par défaut pour barber / institut portant un nom de personne ou d'enseigne
  if (category === "barber" || category === "beauty") {
    return `Bienvenue chez ${name}`
  }

  // 6. Par défaut pour restaurant
  return `Bienvenue au ${name}`
}

const KNOWN_FRENCH_CITIES: Record<string, string> = {
  "venissieux": "Vénissieux",
  "saint-etienne": "Saint-Étienne",
  "saint etienne": "Saint-Étienne",
  "saint-denis": "Saint-Denis",
  "saint denis": "Saint-Denis",
  "villefranche-sur-saone": "Villefranche-sur-Saône",
  "villefranche sur saone": "Villefranche-sur-Saône",
  "aix-en-provence": "Aix-en-Provence",
  "aix en provence": "Aix-en-Provence",
  "nimes": "Nîmes",
  "orleans": "Orléans",
  "beziers": "Béziers",
  "clermont-ferrand": "Clermont-Ferrand",
  "clermont ferrand": "Clermont-Ferrand",
  "boulogne-billancourt": "Boulogne-Billancourt",
  "asnières-sur-seine": "Asnières-sur-Seine",
  "asnieres sur seine": "Asnières-sur-Seine",
  "asnieres-sur-seine": "Asnières-sur-Seine",
  "le havre": "Le Havre",
  "la rochelle": "La Rochelle",
}

/**
 * Normalise le nom d'une ville (casse normale avec accents, jamais de MAJUSCULES intégrales)
 * Ex: "VENISSIEUX" -> "Vénissieux", "VILLEFRANCHE-SUR-SAONE" -> "Villefranche-sur-Saône"
 */
export function normalizeCityName(rawCity?: string | null): string {
  if (!rawCity) return ""
  const clean = rawCity.trim().replace(/\s+/g, " ")
  const lower = clean.toLowerCase()
  if (KNOWN_FRENCH_CITIES[lower]) {
    return KNOWN_FRENCH_CITIES[lower]
  }

  const particles = new Set(["sur", "sous", "les", "le", "la", "aux", "au", "en", "de", "du"])

  return clean
    .split(" ")
    .map((word, wIdx) => {
      return word
        .split("-")
        .map((part, pIdx) => {
          if (!part) return ""
          const pLower = part.toLowerCase()
          if ((wIdx > 0 || pIdx > 0) && particles.has(pLower)) {
            return pLower
          }
          return pLower.charAt(0).toUpperCase() + pLower.slice(1)
        })
        .join("-")
    })
    .join(" ")
}

