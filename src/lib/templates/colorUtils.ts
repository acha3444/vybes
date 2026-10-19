/**
 * Calcule la luminance relative WCAG d'une couleur hexadécimale
 * et renvoie la couleur de texte idéale (#ffffff ou #09090b)
 * pour garantir un contraste conforme WCAG AA (au minimum 4.5:1).
 */
export function getContrastTextColor(hexColor?: string): string {
  if (!hexColor || !hexColor.startsWith("#")) {
    return "#ffffff"
  }

  const cleanHex = hexColor.replace("#", "")
  let r = 0, g = 0, b = 0

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16)
    g = parseInt(cleanHex[1] + cleanHex[1], 16)
    b = parseInt(cleanHex[2] + cleanHex[2], 16)
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16)
    g = parseInt(cleanHex.substring(2, 4), 16)
    b = parseInt(cleanHex.substring(4, 6), 16)
  } else {
    return "#ffffff"
  }

  // Conversion sRGB vers luminance relative linéaire (WCAG 2.1)
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const v = val / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })

  const luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs

  // Seuil de contraste : si luminance > 0.45, texte sombre, sinon blanc
  return luminance > 0.45 ? "#09090b" : "#ffffff"
}

export function hexToRgba(hexColor: string, alpha: number): string {
  if (!hexColor || !hexColor.startsWith("#")) {
    return `rgba(255, 255, 255, ${alpha})`
  }

  const cleanHex = hexColor.replace("#", "")
  let r = 0, g = 0, b = 0

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16)
    g = parseInt(cleanHex[1] + cleanHex[1], 16)
    b = parseInt(cleanHex[2] + cleanHex[2], 16)
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16)
    g = parseInt(cleanHex.substring(2, 4), 16)
    b = parseInt(cleanHex.substring(4, 6), 16)
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
