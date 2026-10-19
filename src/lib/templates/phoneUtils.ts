/**
 * Utilitaire pour formater les numéros de téléphone pour les liens `tel:`.
 * Transforme les numéros français et internationaux en format standard international sans espaces (ex : tel:+33478284590),
 * tout en conservant le texte d'origine lisible pour l'affichage visuel de l'utilisateur.
 */
export function formatTelHref(phone?: string | null): string {
  if (!phone || typeof phone !== "string") {
    return "#"
  }

  const trimmed = phone.trim()
  if (!trimmed) {
    return "#"
  }

  // Nettoyage de tous les séparateurs courants : espaces, points, tirets, parenthèses, slashes
  const cleaned = trimmed.replace(/[\s.\-()/\\_]/g, "")

  if (!cleaned) {
    return "#"
  }

  // Déjà au format international avec + (ex: +33478284590)
  if (cleaned.startsWith("+")) {
    return `tel:${cleaned}`
  }

  // Préfixe international 00 (ex: 0033478284590)
  if (cleaned.startsWith("00")) {
    return `tel:+${cleaned.slice(2)}`
  }

  // Numéro français à 10 chiffres commençant par 0 (ex: 0478284590 -> +33478284590)
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `tel:+33${cleaned.slice(1)}`
  }

  // Numéro commençant par l'indicatif français sans + (ex: 33478284590 -> +33478284590)
  if (cleaned.startsWith("33") && cleaned.length === 11) {
    return `tel:+${cleaned}`
  }

  // Fallback sécurisé
  return `tel:${cleaned}`
}
