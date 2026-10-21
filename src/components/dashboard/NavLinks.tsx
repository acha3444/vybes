"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, LayoutDashboard, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/dashboard", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard },
  { href: "/trouver", label: "Trouver un commerce", short: "Trouver", icon: Compass },
  { href: "/prospects", label: "Mes prospects", short: "Prospects", icon: Users },
  { href: "/abonnement", label: "Abonnement", short: "Abonnement", icon: CreditCard },
]

function useIsActive() {
  const pathname = usePathname()
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarNav() {
  const isActive = useIsActive()

  return (
    <nav className="space-y-1 pt-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors",
              active
                ? "bg-[#1E1E22] text-[#EDEDEF] border border-[#2A2A2F]"
                : "text-[#A0A0A8] hover:text-[#EDEDEF] hover:bg-[#17171A] border border-transparent"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 shrink-0 transition-colors",
                active ? "text-[#6C5CE7]" : "text-[#6E6E76]"
              )}
            />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function BottomNav() {
  const isActive = useIsActive()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F11] border-t border-[#2A2A2F] px-2 py-1.5 flex items-center justify-around md:hidden">
      {LINKS.map(({ href, short, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-3 rounded-[8px] transition-colors",
              active ? "text-[#6C5CE7]" : "text-[#6E6E76] hover:text-[#A0A0A8]"
            )}
          >
            <Icon className="w-4 h-4" />
            <span
              className={cn(
                "text-[11px]",
                active ? "font-semibold text-[#EDEDEF]" : "font-normal"
              )}
            >
              {short}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
