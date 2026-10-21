import React from "react"

interface VybeMarkProps {
  size?: number
  className?: string
  /**
   * "standalone": deux tons sur fond sombre (#5B4BFF et #A89FFF)
   * "app-icon": squircle violet (#5B4BFF) avec V blanc et lavande (identique au mockup)
   * "white": pour fond sombre alternatif ou contrasté
   */
  variant?: "standalone" | "app-icon" | "white"
}

export function VybeMark({
  size = 36,
  className = "",
  variant = "standalone",
}: VybeMarkProps) {
  if (variant === "app-icon") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-hidden="true"
      >
        <rect width="100" height="100" rx="28" fill="#5B4BFF" />
        <g transform="translate(24, 24) scale(0.52)">
          <line
            x1="86.5"
            y1="14"
            x2="59.5"
            y2="75"
            stroke="#B5AEFF"
            strokeWidth="21.5"
            strokeLinecap="round"
          />
          <line
            x1="13.5"
            y1="14"
            x2="48.5"
            y2="87.5"
            stroke="#FFFFFF"
            strokeWidth="21.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    )
  }

  const leftColor = variant === "white" ? "#FFFFFF" : "#5B4BFF"
  const rightColor = variant === "white" ? "rgba(255,255,255,0.7)" : "#A89FFF"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <line
        x1="86.5"
        y1="14"
        x2="59.5"
        y2="75"
        stroke={rightColor}
        strokeWidth="21.5"
        strokeLinecap="round"
      />
      <line
        x1="13.5"
        y1="14"
        x2="48.5"
        y2="87.5"
        stroke={leftColor}
        strokeWidth="21.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface VybeLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "standalone" | "app-icon"
  subtitle?: string
  className?: string
  showText?: boolean
}

export function VybeLogo({
  size = "md",
  variant = "standalone",
  subtitle,
  className = "",
  showText = true,
}: VybeLogoProps) {
  const markSize = {
    sm: variant === "app-icon" ? 28 : 24,
    md: variant === "app-icon" ? 38 : 32,
    lg: variant === "app-icon" ? 44 : 38,
    xl: variant === "app-icon" ? 54 : 46,
  }[size]

  const textClass = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  }[size]

  const gapClass = {
    sm: "gap-2",
    md: "gap-2.5",
    lg: "gap-3",
    xl: "gap-3.5",
  }[size]

  return (
    <div className={`inline-flex items-center ${gapClass} ${className}`}>
      <VybeMark size={markSize} variant={variant} />
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-black tracking-[-0.035em] text-white leading-none ${textClass}`}
            style={{
              fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            vybe
          </span>
          {subtitle && (
            <span className="text-[11px] text-[#A0A0A8] font-normal mt-0.5 leading-none">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default VybeLogo
