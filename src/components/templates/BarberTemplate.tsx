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
        <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-neutral-900">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[560px] flex flex-col justify-end p-6 sm:p-12 lg:p-16 border border-neutral-800 shadow-2xl">
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
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-amber-300 text-xs font-bold shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5 • Barbershop certifié</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-neutral-300 text-xs font-medium shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Avec ou sans RDV</span>
                  </span>
                </div>

                <h1
                  className={`text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.05] ${barberHeading.className}`}
                >
                  {content.business_name}
                </h1>

                {content.tagline && (
                  <p className="mt-3 text-sm sm:text-lg text-neutral-300 font-normal leading-relaxed text-balance max-w-xl">
                    {content.tagline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3.5 mt-8">
                  {content.phone && (
                    <a
                      href={isPreview ? "#" : `tel:${content.phone}`}
                      style={{ backgroundColor: primaryColor, color: ctaTextColor }}
                      className="h-13 px-7 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/15 active:scale-95 transition cursor-pointer"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>Prendre rendez-vous</span>
                    </a>
                  )}

                  {content.services_or_menu && content.services_or_menu.length > 0 && (
                    <a
                      href="#prestations"
                      className="h-13 px-6 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition cursor-pointer"
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
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-prose">
                <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                  {content.about}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-900">
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    <Zap className="w-5 h-5 text-amber-400 mb-2" />
                    <h4 className="font-bold text-xs text-white">Dégradés laser</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Taper, skin fade, crop</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    <Shield className="w-5 h-5 text-amber-400 mb-2" />
                    <h4 className="font-bold text-xs text-white">Barbe traditionnelle</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Coupe-choux & serviette</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    <UserCheck className="w-5 h-5 text-amber-400 mb-2" />
                    <h4 className="font-bold text-xs text-white">Diagnostic morpho</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Conseils personnalisés</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <ImageWithFallback
                  src={content.gallery_images && content.gallery_images[0]}
                  alt="Poste barbier"
                  aspectRatioClass="aspect-[4/3] rounded-3xl"
                  className="rounded-3xl border border-neutral-800 shadow-2xl"
                  primaryColor={primaryColor}
                  fallbackIcon={Scissors}
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
          >
            <PriceList
              items={content.services_or_menu}
              primaryColor={primaryColor}
              themeMode="dark"
              headingFontClass={barberHeading.className}
            />

            <div className="mt-12 p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-300">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Tous nos rituels barbe comprennent serviette chaude aux huiles essentielles et baume nourrissant.
                </span>
              </div>
              {content.phone && (
                <a
                  href={isPreview ? "#" : `tel:${content.phone}`}
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
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.gallery_images.map((imgUrl, idx) => (
                <div key={idx} className="group overflow-hidden rounded-2xl border border-neutral-800">
                  <ImageWithFallback
                    src={imgUrl}
                    alt={`Coupe barber ${idx + 1}`}
                    aspectRatioClass="aspect-square"
                    primaryColor={primaryColor}
                    fallbackIcon={Scissors}
                  />
                </div>
              ))}
            </div>
          </TemplateSection>
        )}

        {/* 6. AVIS CLIENTS */}
        <TemplateSection
          id="avis"
          badge="Confiance"
          title="La communauté du shop"
          subtitle="Déjà des centaines d'hommes exigeants font confiance au fauteuil chaque mois."
          primaryColor={primaryColor}
          headingFontClass={barberHeading.className}
          className="bg-neutral-900/30 border-y border-neutral-900"
        >
          <ReviewsCard
            businessName={content.business_name}
            rating={4.9}
            ratingsTotal={310}
            primaryColor={primaryColor}
            themeMode="dark"
            headingFontClass={barberHeading.className}
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
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <OpeningHoursCard
                hoursList={content.opening_hours}
                primaryColor={primaryColor}
                themeMode="dark"
              />
            </div>

            <div className="lg:col-span-5 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-400" />
                  <span>Adresse du shop</span>
                </h3>
                <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                  {content.address || "Adresse sur demande"}
                </p>
              </div>

              {content.phone && (
                <div className="pt-4 border-t border-neutral-800">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold block">
                    Contact direct
                  </span>
                  <a
                    href={isPreview ? "#" : `tel:${content.phone}`}
                    className="text-lg font-black mt-1 block tracking-tight hover:underline"
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
                className="w-full h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-700 transition cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-rose-400" />
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
