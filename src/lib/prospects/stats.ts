import { ProspectStatus } from "@/types/database"

export interface ProspectStatsItem {
  id: string
  status: ProspectStatus | string
  demos?: Array<{
    id?: string
    views_count?: number
  }> | null
}

export interface UnifiedKpis {
  demosCreated: number
  demosSent: number
  merchantsOpened: number
  clientsSigned: number
}

/**
 * Source unique de vérité pour le calcul des 4 KPIs Vybe
 * - Démos créées : nombre total de démos générées
 * - Démos envoyées : prospects passés à l'étape d'envoi (statut >= demo_envoyee)
 * - Commerçants qui ont ouvert : commerçants dont la démo comptabilise au moins 1 vue
 * - Clients signés : contrats conclus (statut === 'signe')
 */
export function calculateUnifiedKpis(
  prospects: ProspectStatsItem[] = [],
  totalDemosCount?: number
): UnifiedKpis {
  const sentStatuses = new Set(["demo_envoyee", "interesse", "signe", "perdu"])

  let demosCount = totalDemosCount ?? 0
  let demosSent = 0
  let merchantsOpened = 0
  let clientsSigned = 0

  for (const prospect of prospects) {
    if (sentStatuses.has(prospect.status)) {
      demosSent += 1
    }
    if (prospect.status === "signe") {
      clientsSigned += 1
    }

    const demo = prospect.demos && prospect.demos[0]
    if (demo && (demo.views_count || 0) > 0) {
      merchantsOpened += 1
    }

    if (totalDemosCount === undefined && prospect.demos && prospect.demos.length > 0) {
      demosCount += prospect.demos.length
    }
  }

  return {
    demosCreated: demosCount,
    demosSent,
    merchantsOpened,
    clientsSigned,
  }
}
