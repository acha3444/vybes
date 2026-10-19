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
}: TemplateSectionProps) {
  const hasHeader = badge || title || subtitle

  return (
    <section
      id={id}
      className={`scroll-mt-24 py-14 sm:py-20 lg:py-24 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        {hasHeader && (
          <div
            className={`mb-10 sm:mb-14 ${
              align === "center"
                ? "text-center max-w-2xl mx-auto"
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
                  className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-balance leading-tight ${headingFontClass}`}
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
