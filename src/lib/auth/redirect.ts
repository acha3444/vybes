/**
 * Valide et assainit une URL de redirection relative pour éviter les failles Open Redirect.
 * 
 * Règles strictes :
 * - Accepte uniquement des chemins relatifs commençant par "/"
 * - Ne doit PAS commencer par "//" (protocol-relative URLs)
 * - Ne doit PAS contenir "://" (schémas absolus https://, http://, javascript://, etc.)
 * - Ne doit PAS commencer par "/\\"
 * - Sinon, redirige vers "/dashboard" (ou le fallback spécifié)
 */
export function getSafeRedirectPath(
  rawPath?: string | null,
  fallback = "/dashboard"
): string {
  if (!rawPath || typeof rawPath !== "string") {
    return fallback
  }

  const trimmed = rawPath.trim()

  // 1. Vérification directe
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("://") ||
    trimmed.startsWith("/\\")
  ) {
    return fallback
  }

  // 2. Vérification après décodage éventuel (anti-bypass par encodage %2f%2f)
  try {
    const decoded = decodeURIComponent(trimmed)
    if (
      !decoded.startsWith("/") ||
      decoded.startsWith("//") ||
      decoded.includes("://") ||
      decoded.startsWith("/\\")
    ) {
      return fallback
    }
  } catch {
    return fallback
  }

  return trimmed
}
