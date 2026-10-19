"use client"

import { DemoContent } from "@/types/database"
import { barberHeading, barberBody } from "@/lib/fonts"
import { getContrastTextColor } from "@/lib/templates/colorUtils"
import TemplateNavbar from "./common/TemplateNavbar"
import TemplateSection from "./common/TemplateSection"
import ImageWithFallback from "./common/ImageWithFallback"
import PriceList from "./common/PriceList"
import OpeningHoursCard from "./common/OpeningHoursCard"
import ReviewsCard from "./common/ReviewsCard"
import TemplateFooter from "./common/TemplateFooter"
import MobileStickyBar from "./common/MobileStickyBar"
import { formatTelHref } from "@/lib/templates/phoneUtils"
import { Scissors, Star, Clock, MapPin, Zap, Shield, Sparkles, UserCheck } from "lucide-react"

export default function BarberTemplate({
  content,
  isPreview = false,
}: {
  content: DemoContent
  isPreview?: boolean
}) {
  const primaryColor = content.primary_color || "#eab308"
  const ctaTextColor = getContrastTextColor(primaryColor)

  const navLinks = [
    { label: "Le Salon", href: "#apropos" },
    ...(content.services_or_menu && content.services_or_menu.length > 0
      ? [{ label: "Prestations", href: "#prestations" }]
      : []),
    ...(content.gallery_images && content.gallery_images.length > 0
      ? [{ label: "Réalisations", href: "#galerie" }]
      : []),
    { label: "Avis", href: "#avis" },
    { label: "Horaires & Plan", href: "#horaires" },
  ]

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${content.business_name} ${content.address}`
  )}`

  return (
    <div
      className={`min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 ${barberBody.className}`}
    >
      {/* 1. NAVBAR PRO */}
      <TemplateNavbar
        businessName={content.business_name}
        tagline="Barbershop & Grooming Studio"
        phone={content.phone}
        primaryColor={primaryColor}
        icon={Scissors}
        links={navLinks}
        ctaLabel="Prendre RDV"
        themeMode="dark"
        headingFontClass={barberHeading.className}
        isPreview={isPreview}
      />

      <main>
        {/* 2. HERO SECTION CONTRASTÉE & PUISSANTE */}
        <section
          className={`relative overflow-hidden border-b border-neutral-900 ${
            isPreview ? "pt-4 pb-8" : "pt-8 pb-16 sm:pt-14 sm:pb-24"
          }`}
        >
          <div
            className={`max-w-6xl mx-auto ${
              isPreview ? "px-3.5 sm:px-5" : "px-4 sm:px-8 lg:px-12"
            }`}
          >
            <div
              className={`relative rounded-3xl overflow-hidden flex flex-col justify-end border border-neutral-800 shadow-2xl ${
                isPreview
                  ? "min-h-[380px] p-4 sm:p-6"
                  : "min-h-[460px] sm:min-h-[560px] p-5 sm:p-10 lg:p-14"
              }`}
            >
              <ImageWithFallback
                src={content.hero_image_url}
                alt={content.business_name}
                aspectRatioClass="absolute inset-0 w-full h-full"
                className="absolute inset-0"
                primaryColor={primaryColor}
                fallbackIcon={Scissors}
                priority
                sizes="100vw"
                overlay
                overlayClassName="bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/30"
              />

              <div className="relative z-10 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  {content.rating ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-amber-300 text-[11px] sm:text-xs font-bold shadow-xs">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(content.rating).toFixed(1)} / 5</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-amber-300 text-[11px] sm:text-xs font-bold shadow-xs">
                      <Scissors className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                      <span>Barbier & Coiffure</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-neutral-300 text-[11px] sm:text-xs font-medium shadow-xs">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
                    <span>Avec ou sans RDV</span>
                  </span>
                </div>

                <h1
                  className={`${
                    isPreview
                      ? "text-xl sm:text-3xl"
                      : "text-2xl sm:text-4xl lg:text-5xl"
                  } font-black text-white tracking-tight uppercase leading-[1.05] ${barberHeading.className}`}
                >
                  {content.business_name}
                </h1>

                {content.tagline && (
                  <p className="mt-2 text-xs sm:text-base text-neutral-300 font-normal leading-relaxed text-balance max-w-xl">
                    {content.tagline}
                  </p>
                )}

                <div
                  className={`flex ${
                    isPreview ? "flex-col w-full" : "flex-col sm:flex-row"
                  } items-stretch sm:items-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-8`}
                >
                  {content.phone && (
                    <a
                      href={isPreview ? "#" : formatTelHref(content.phone)}
                      style={{ backgroundColor: primaryColor, color: ctaTextColor }}
                      className={`h-11 sm:h-13 px-5 sm:px-7 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/15 active:scale-95 transition cursor-pointer ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <Scissors className="w-4 h-4 shrink-0" />
                      <span>Prendre rendez-vous</span>
                    </a>
                  )}

                  {content.services_or_menu && content.services_or_menu.length > 0 && (
                    <a
                      href="#prestations"
                      className={`h-11 sm:h-13 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition cursor-pointer ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <span>Voir les tarifs</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECTION À PROPOS */}
        {content.about && (
          <TemplateSection
            id="apropos"
            badge="L'artisanat"
            title="Précision, style & savoir-faire masculin"
            subtitle="Ici, chaque coupe et chaque barbe est traitée avec le souci du détail absolu. Pas de travail à la chaîne : du sur-mesure."
            primaryColor={primaryColor}
            headingFontClass={barberHeading.className}
            isPreview={isPreview}
          >
            <div
              className={`grid ${
                isPreview ? "grid-cols-1 gap-6" : "grid-cols-1 lg:grid-cols-12 gap-10"
              } items-center`}
            >
              <div
                className={`${
                  isPreview ? "" : "lg:col-span-7"
                } space-y-5 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-prose`}
              >
                <p className="text-white text-sm sm:text-lg font-medium leading-relaxed">
                  {content.about}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-900">
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <Zap className="w-4 h-4 text-amber-400 mb-1.5" />
                    <h4 className="font-bold text-xs text-white">Dégradés laser</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Taper, skin fade, crop</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <Shield className="w-4 h-4 text-amber-400 mb-1.5" />
                    <h4 className="font-bold text-xs text-white">Barbe rituelle</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Coupe-choux & serviette</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <UserCheck className="w-4 h-4 text-amber-400 mb-1.5" />
                    <h4 className="font-bold text-xs text-white">Diagnostic morpho</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Conseils personnalisés</p>
                  </div>
                </div>
              </div>

              <div className={isPreview ? "w-full" : "lg:col-span-5"}>
                <ImageWithFallback
                  src={content.gallery_images && content.gallery_images[0]}
                  alt={`Espace de coiffure et barbier - ${content.business_name}`}
                  aspectRatioClass="aspect-[4/3] rounded-2xl sm:rounded-3xl"
                  className="rounded-2xl sm:rounded-3xl border border-neutral-800 shadow-2xl"
                  primaryColor={primaryColor}
                  fallbackIcon={Scissors}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </TemplateSection>
        )}

        {/* 4. SECTION PRESTATIONS AVEC DURÉES ET PRIX */}
        {content.services_or_menu && content.services_or_menu.length > 0 && (
          <TemplateSection
            id="prestations"
            badge="Tarifs & Soins"
            title="Menu des prestations"
            subtitle="Des formules complètes pour cheveux et barbe, exécutées dans les règles de l'art."
            primaryColor={primaryColor}
            headingFontClass={barberHeading.className}
            className="bg-neutral-900/40 border-y border-neutral-900"
            isPreview={isPreview}
          >
            <PriceList
              items={content.services_or_menu}
              primaryColor={primaryColor}
              themeMode="dark"
              headingFontClass={barberHeading.className}
              isPreview={isPreview}
            />

            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Tous nos rituels barbe comprennent serviette chaude aux huiles essentielles et baume nourrissant.
                </span>
              </div>
              {content.phone && (
                <a
                  href={isPreview ? "#" : formatTelHref(content.phone)}
                  style={{ backgroundColor: primaryColor, color: ctaTextColor }}
                  className="h-10 px-5 rounded-xl font-black uppercase text-[11px] tracking-wider flex items-center justify-center shrink-0 shadow-md active:scale-95 transition"
                >
                  Prendre RDV au {content.phone}
                </a>
              )}
            </div>
          </TemplateSection>
        )}

        {/* 5. SECTION RÉALISATIONS (GALERIE) */}
        {content.gallery_images && content.gallery_images.length > 0 && (
          <TemplateSection
            id="galerie"
            badge="Réalisations"
            title="Le feed du salon"
            subtitle="Découvrez quelques-unes de nos réalisations récentes sorties du fauteuil."
            primaryColor={primaryColor}
            headingFontClass={barberHeading.className}
            isPreview={isPreview}
          >
            <div
              className={`grid ${
                isPreview ? "grid-cols-2 gap-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              }`}
            >
              {content.gallery_images.map((imgUrl, idx) => (
                <div key={idx} className="group overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-800">
                  <ImageWithFallback
                    src={imgUrl}
                    alt={`Coupe de cheveux et taille de barbe soignée - ${content.business_name} (réalisation ${idx + 1})`}
                    aspectRatioClass="aspect-square"
                    primaryColor={primaryColor}
                    fallbackIcon={Scissors}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </TemplateSection>
        )}

        {/* 6. AVIS CLIENTS */}
        <TemplateSection
          id="avis"
          badge="Avis clients"
          title="Avis clients"
          subtitle="Les retours de nos clients après leur passage au fauteuil."
          primaryColor={primaryColor}
          headingFontClass={barberHeading.className}
          className="bg-neutral-900/30 border-y border-neutral-900"
          isPreview={isPreview}
        >
          <ReviewsCard
            businessName={content.business_name}
            rating={content.rating}
            ratingsTotal={content.reviews_count}
            primaryColor={primaryColor}
            themeMode="dark"
            headingFontClass={barberHeading.className}
            isPreview={isPreview}
          />
        </TemplateSection>

        {/* 7. HORAIRES & PLAN */}
        <TemplateSection
          id="horaires"
          badge="Accès"
          title="Horaires d'ouverture & Localisation"
          subtitle="Passez nous voir au shop. Parking à proximité."
          primaryColor={primaryColor}
          headingFontClass={barberHeading.className}
          isPreview={isPreview}
        >
          <div
            className={`grid ${
              isPreview ? "grid-cols-1 gap-6" : "grid-cols-1 lg:grid-cols-12 gap-8"
            } items-start`}
          >
            <div className={isPreview ? "w-full" : "lg:col-span-7"}>
              <OpeningHoursCard
                hoursList={content.opening_hours}
                primaryColor={primaryColor}
                themeMode="dark"
              />
            </div>

            <div
              className={`${
                isPreview ? "w-full p-4 sm:p-6" : "lg:col-span-5 p-6 sm:p-8"
              } bg-neutral-900/90 border border-neutral-800 rounded-2xl sm:rounded-3xl space-y-5`}
            >
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Adresse du shop</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 leading-relaxed">
                  {content.address || "Adresse sur demande"}
                </p>
              </div>

              {content.phone && (
                <div className="pt-3 border-t border-neutral-800">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold block">
                    Contact direct
                  </span>
                  <a
                    href={isPreview ? "#" : formatTelHref(content.phone)}
                    className="text-base sm:text-lg font-black mt-0.5 block tracking-tight hover:underline"
                    style={{ color: primaryColor }}
                  >
                    {content.phone}
                  </a>
                </div>
              )}

              <a
                href={isPreview ? "#" : mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 sm:h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-700 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Ouvrir dans Maps</span>
              </a>
            </div>
          </div>
        </TemplateSection>
      </main>

      {/* 8. FOOTER */}
      <TemplateFooter
        businessName={content.business_name}
        address={content.address}
        phone={content.phone}
        instagramHandle={content.instagram_handle}
        primaryColor={primaryColor}
        themeMode="dark"
      />

      {/* 9. BARRE FIXE MOBILE */}
      <MobileStickyBar
        phone={content.phone}
        address={content.address}
        businessName={content.business_name}
        primaryColor={primaryColor}
        ctaType="book_appointment"
        isPreview={isPreview}
      />
    </div>
  )
}
