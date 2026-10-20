"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, LayoutDashboard, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/dashboard", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard },
  { href: "/trouver", label: "Trouver un commerce", short: "Trouver", icon: Compass },
  { href: "/prospects", label: "Mes prospects", short: "Prospects", icon: Users },
  { href: "/abonnement", label: "Abonnement", short: "Compte", icon: CreditCard },
]

function useIsActive() {
  const pathname = usePathname()
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarNav() {
  const isActive = useIsActive()

  return (
    <nav className="space-y-1 pt-2">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group relative flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
              active
                ? "text-white bg-gradient-to-r from-indigo-500/15 to-transparent"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-gradient-to-b from-indigo-400 to-violet-500 transition-all duration-500 ease-out-expo",
                active ? "h-6 opacity-100" : "h-0 opacity-0"
              )}
            />
            <Icon
              className={cn(
                "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                active ? "text-indigo-400" : "text-neutral-500 group-hover:text-neutral-300"
              )}
            />
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

export function BottomNav() {
  const isActive = useIsActive()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/85 backdrop-blur-xl border-t border-white/[0.06] px-3 py-2 flex items-center justify-around md:hidden">
      {LINKS.map(({ href, short, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-col items-center gap-1 py-1 px-3 transition-colors active:scale-95"
          >
            <span
              className={cn(
                "absolute -top-2 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-500 ease-out-expo",
                active ? "w-8 opacity-100" : "w-0 opacity-0"
              )}
            />
            <Icon
              className={cn(
                "w-5 h-5 transition-all duration-300",
                active ? "text-indigo-400 -translate-y-0.5" : "text-neutral-500"
              )}
            />
            <span
              className={cn(
                "text-[11px]",
                active ? "font-semibold text-white" : "font-medium text-neutral-500"
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
