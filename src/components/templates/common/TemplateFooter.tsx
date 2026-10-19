import { Phone, MapPin, Heart } from "lucide-react"

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

interface TemplateFooterProps {
  businessName: string
  address?: string
  phone?: string
  instagramHandle?: string
  primaryColor?: string
  themeMode?: "dark" | "light"
}

export default function TemplateFooter({
  businessName,
  address,
  phone,
  instagramHandle,
  primaryColor = "#c2410c",
  themeMode = "dark",
}: TemplateFooterProps) {
  const isLight = themeMode === "light"

  return (
    <footer
      className={`border-t pt-14 pb-28 md:pb-16 transition-colors ${
        isLight
          ? "bg-neutral-100/80 border-neutral-200 text-neutral-600"
          : "bg-neutral-950 border-neutral-900 text-neutral-400"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-neutral-200/60 dark:border-neutral-900">
          {/* Identité */}
          <div className="md:col-span-6 space-y-3">
            <h3
              className={`text-xl font-extrabold tracking-tight ${
                isLight ? "text-neutral-900" : "text-white"
              }`}
            >
              {businessName}
            </h3>
            <p className="text-xs sm:text-sm max-w-sm leading-relaxed">
              Une adresse locale engagée pour la qualité, l&apos;accueil et la satisfaction de chacun de ses clients.
            </p>
          </div>

          {/* Contact & Accès */}
          <div className="md:col-span-6 flex flex-col sm:flex-row sm:items-start sm:justify-end gap-6 text-xs">
            {address && (
              <div className="space-y-1">
                <span className="font-bold text-neutral-300 uppercase tracking-wider text-[10px] block">
                  Adresse
                </span>
                <p className="flex items-center gap-1.5 max-w-xs">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>{address}</span>
                </p>
              </div>
            )}

            {phone && (
              <div className="space-y-1">
                <span className="font-bold text-neutral-300 uppercase tracking-wider text-[10px] block">
                  Téléphone
                </span>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-1.5 font-bold hover:underline"
                  style={{ color: primaryColor }}
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{phone}</span>
                </a>
              </div>
            )}

            {instagramHandle && (
              <div className="space-y-1">
                <span className="font-bold text-neutral-300 uppercase tracking-wider text-[10px] block">
                  Réseaux
                </span>
                <a
                  href={`https://instagram.com/${instagramHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <InstagramIcon className="w-3.5 h-3.5 shrink-0 text-pink-400" />
                  <span>{instagramHandle}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bas de page légal & discret */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} {businessName}. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            <span>Créé avec exigence pour les commerces de proximité</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" />
          </p>
        </div>
      </div>
    </footer>
  )
}
