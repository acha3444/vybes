/**
 * Normalise les noms d'établissements venant de Google Places ou du registre officiel
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
