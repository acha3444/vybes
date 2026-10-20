"use client"

import { cn } from "@/lib/utils"

/** Carte avec un halo lumineux qui suit le curseur (voir `.spotlight` dans globals.css). */
export function Spotlight({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`)
  }

  return (
    <div onPointerMove={handleMove} className={cn("spotlight", className)}>
      {children}
    </div>
  )
}
