import React from "react"

interface TemplateSectionProps {
  id?: string
  badge?: string
  title?: string
  subtitle?: string
  primaryColor?: string
  children: React.ReactNode
  className?: string
  headingFontClass?: string
  align?: "left" | "center"
  headerRight?: React.ReactNode
  isPreview?: boolean
}

export default function TemplateSection({
  id,
  badge,
  title,
  subtitle,
  primaryColor = "#c2410c",
  children,
  className = "",
  headingFontClass = "",
  align = "left",
  headerRight,
  isPreview = false,
}: TemplateSectionProps) {
  const hasHeader = badge || title || subtitle

  return (
    <section
      id={id}
      className={`scroll-mt-24 ${
        isPreview ? "py-8 sm:py-10" : "py-12 sm:py-20 lg:py-24"
      } ${className}`}
    >
      <div
        className={`max-w-6xl mx-auto ${
          isPreview ? "px-3.5 sm:px-5" : "px-4 sm:px-8 lg:px-12"
        }`}
      >
        {hasHeader && (
          <div
            className={`mb-8 sm:mb-14 ${
              align === "center"
                ? "text-center max-w-2xl mx-auto"
                : isPreview
                ? "flex flex-col gap-3"
                : "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
            }`}
          >
            <div>
              {badge && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 border shadow-xs"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    borderColor: `${primaryColor}30`,
                    color: primaryColor,
                  }}
                >
                  <span>{badge}</span>
                </div>
              )}

              {title && (
                <h2
                  className={`font-extrabold tracking-tight text-balance leading-tight ${
                    isPreview
                      ? "text-lg sm:text-2xl"
                      : "text-2xl sm:text-3xl lg:text-4xl"
                  } ${headingFontClass}`}
                >
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className="mt-3 text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>

            {headerRight && (
              <div className="shrink-0 self-start sm:self-end">
                {headerRight}
              </div>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  )
}
