import { ProspectStatus } from "@/types/database"

export interface ProspectStatsItem {
  id: string
  status: ProspectStatus | string
  demos?: Array<{
    id?: string
    views_count?: number
    sent_at?: string | null
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
 * - Démos envoyées : démos avec sent_at non nul (ou statut demo_envoyee)
 * - Commerçants qui ont ouvert : commerçants dont la démo comptabilise au moins 1 consultation
 * - Clients signés : contrats conclus (statut === 'signe')
 */
export function calculateUnifiedKpis(
  prospects: ProspectStatsItem[] = [],
  totalDemosCount?: number
): UnifiedKpis {
  let demosCount = totalDemosCount ?? 0
  let demosSent = 0
  let merchantsOpened = 0
  let clientsSigned = 0

  for (const prospect of prospects) {
    const demo = prospect.demos && prospect.demos[0]
    const isSent = Boolean(demo?.sent_at) || prospect.status === "demo_envoyee"

    if (isSent) {
      demosSent += 1
    }
    if (prospect.status === "signe") {
      clientsSigned += 1
    }

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
