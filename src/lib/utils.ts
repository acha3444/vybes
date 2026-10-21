import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ""
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString))
}

export function getDaysRemaining(targetDate: string | null | undefined): number {
  if (!targetDate) return 0
  const diff = new Date(targetDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Construit l'URL publique de la démo
 * Si un sous-domaine réel est configuré (NEXT_PUBLIC_DEMO_DOMAIN hors vercel.app), on l'utilise.
 * Sinon, repli systématique sur la route de secours /d/[slug] du domaine principal.
 */
export function getDemoUrl(slug: string): string {
  const customDemoDomain = process.env.NEXT_PUBLIC_DEMO_DOMAIN
  if (customDemoDomain && !customDemoDomain.includes("vercel.app")) {
    const protocol = customDemoDomain.startsWith("localhost") ? "http" : "https"
    return `${protocol}://${customDemoDomain}/${slug}`
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/d/${slug}`
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "vybes-lilac.vercel.app"
  const protocol = rootDomain.startsWith("localhost") ? "http" : "https"
  return `${protocol}://${rootDomain}/d/${slug}`
}

/**
 * Formate une date relative en français ("il y a 2 h", "hier")
 */
export function formatRelativeDate(dateString: string | null | undefined): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return "à l'instant"
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMin < 1) return "à l'instant"
  if (diffMin < 60) return `il y a ${diffMin} min`
  if (diffHours === 1) return "il y a 1 h"
  if (diffHours < 24) return `il y a ${diffHours} h`
  if (diffDays === 1) return "hier"
  if (diffDays < 7) return `il y a ${diffDays} j`
  return formatDate(dateString)
}

/**
 * Date d'expiration en clair en français : "Expire le 4 novembre"
 */
export function formatExpirationDate(dateString: string | null | undefined): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  const day = date.getDate()
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ]
  return `Expire le ${day} ${months[date.getMonth()]}`
}

