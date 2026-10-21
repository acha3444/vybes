"use client"

import { usePathname } from "next/navigation"

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/trouver": "Trouver un commerce",
  "/prospects": "Mes prospects",
  "/abonnement": "Abonnement",
  "/prospecter": "Prospection",
  "/demos/creer": "Nouvelle démo",
}

export function DashboardHeaderTitle() {
  const pathname = usePathname()

  let title = ROUTE_TITLES[pathname]
  if (!title) {
    if (pathname.startsWith("/demos/") && pathname.endsWith("/edit")) {
      title = "Éditeur de démo"
    } else if (pathname.startsWith("/prospecter")) {
      title = "Prospection"
    } else {
      title = "Tableau de bord"
    }
  }

  return (
    <span className="text-[13px] font-medium text-[#A0A0A8]">
      {title}
    </span>
  )
}
