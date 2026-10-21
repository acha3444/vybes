"use client"

import { useState } from "react"
import Image from "next/image"
import { LucideIcon, Sparkles } from "lucide-react"

interface ImageWithFallbackProps {
  src?: string | null
  alt: string
  className?: string
  aspectRatioClass?: string
  primaryColor?: string
  fallbackIcon?: LucideIcon
  priority?: boolean
  sizes?: string
  overlay?: boolean
  overlayClassName?: string
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  aspectRatioClass = "aspect-[16/9]",
  primaryColor = "#c2410c",
  fallbackIcon: FallbackIcon = Sparkles,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  overlay = false,
  overlayClassName = "bg-black/30",
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)

  const isInvalidSrc = !src || src.trim() === "" || hasError

  if (isInvalidSrc) {
    return (
      <div
        className={`relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none ${aspectRatioClass} ${className}`}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, #171717 100%)`,
          borderColor: `${primaryColor}30`,
        }}
      >
        {/* Motif d'arrière-plan discret */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Halo subtil */}
        <div
          className="w-20 h-20 rounded-full blur-2xl opacity-20 absolute"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner"
            style={{
              backgroundColor: `${primaryColor}20`,
              borderColor: `${primaryColor}40`,
              color: primaryColor,
            }}
          >
            <FallbackIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-normal text-neutral-400 max-w-[80%] line-clamp-1">
            {alt}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setHasError(true)}
        className="object-cover transition-transform duration-500 will-change-transform"
      />
      {overlay && (
        <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
      )}
    </div>
  )
}
