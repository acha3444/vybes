"use client"

import { DemoContent } from "@/types/database"
import { beautyHeading, beautyBody } from "@/lib/fonts"
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
import { Sparkles, Star, Clock, MapPin, Feather, Heart, Flower2, ShieldCheck } from "lucide-react"

export default function BeautyTemplate({
  content,
  isPreview = false,
}: {
  content: DemoContent
  isPreview?: boolean
}) {
  const primaryColor = content.primary_color || "#be185d"
  const ctaTextColor = getContrastTextColor(primaryColor)

  const hasRealRating = typeof content.rating === "number" && content.rating > 0
  const validGallery = (content.gallery_images || []).filter(
    (img) => typeof img === "string" && img.trim().length > 0
  )

  const navLinks = [
    { label: "L'Institut", href: "#apropos" },
    ...(content.services_or_menu && content.services_or_menu.length > 0
      ? [{ label: "Prestations", href: "#prestations" }]
      : []),
    ...(validGallery.length > 0 ? [{ label: "Galerie", href: "#galerie" }] : []),
    ...(hasRealRating ? [{ label: "Avis", href: "#avis" }] : []),
    { label: "Horaires & Accès", href: "#horaires" },
  ]

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${content.business_name} ${content.address}`
  )}`

  return (
    <div
      className={`min-h-screen bg-[#faf8f5] text-stone-800 selection:bg-rose-200 selection:text-stone-900 ${beautyBody.className}`}
    >
      {/* 1. NAVBAR ÉLÉGANTE EN TONS CLAIRS */}
      <TemplateNavbar
        businessName={content.business_name}
        tagline={content.subtitle || "Institut de beauté & Bien-être"}
        phone={content.phone}
        primaryColor={primaryColor}
        icon={Flower2}
        links={navLinks}
        ctaLabel="Prendre RDV"
        themeMode="light"
        headingFontClass={beautyHeading.className}
        isPreview={isPreview}
      />

      <main>
        {/* 2. HERO SECTION DOUCE & RAFINÉE */}
        <section
          className={`relative overflow-hidden ${
            isPreview ? "pt-3 pb-5" : "pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-stone-200/80"
          }`}
        >
          <div
            className={`max-w-6xl mx-auto ${
              isPreview ? "px-3.5" : "px-4 sm:px-8 lg:px-12"
            }`}
          >
            <div
              className={`relative rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-end border border-stone-200/80 shadow-2xl ${
                isPreview
                  ? "min-h-[360px] p-4"
                  : "min-h-[460px] sm:min-h-[560px] p-5 sm:p-10 lg:p-14"
              }`}
            >
              <ImageWithFallback
                src={content.hero_image_url}
                alt={content.business_name}
                aspectRatioClass="absolute inset-0 w-full h-full"
                className="absolute inset-0"
                primaryColor={primaryColor}
                fallbackIcon={Flower2}
                priority
                sizes="100vw"
                overlay
                overlayClassName="bg-gradient-to-t from-stone-950/85 via-stone-950/50 to-stone-900/10"
              />

              <div className="relative z-10 max-w-2xl text-white">
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  {content.rating ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-stone-950/70 backdrop-blur-md border border-white/20 text-amber-200 text-[11px] sm:text-xs font-bold shadow-xs">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-300 text-amber-300" />
                      <span>{Number(content.rating).toFixed(1)} / 5</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-stone-950/70 backdrop-blur-md border border-white/20 text-amber-200 text-[11px] sm:text-xs font-bold shadow-xs">
                      <Flower2 className="w-3.5 h-3.5 text-rose-300" />
                      <span>Institut & Bien-être</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-stone-950/70 backdrop-blur-md border border-white/20 text-stone-200 text-[11px] sm:text-xs font-medium shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-stone-300" />
                    <span>Sur rendez-vous</span>
                  </span>
                </div>

                <h1
                  className={`${
                    isPreview
                      ? "text-xl"
                      : "text-2xl sm:text-4xl lg:text-5xl"
                  } font-normal text-white tracking-tight leading-tight ${beautyHeading.className}`}
                >
                  {content.business_name}
                </h1>

                {content.tagline && (
                  <p
                    className={`mt-2 ${
                      isPreview ? "text-xs" : "text-xs sm:text-base"
                    } text-stone-200 font-light leading-relaxed text-balance max-w-xl`}
                  >
                    {content.tagline}
                  </p>
                )}

                <div
                  className={`flex ${
                    isPreview
                      ? "flex-col w-full items-stretch gap-2 mt-4"
                      : "flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-8"
                  }`}
                >
                  {content.phone && (
                    <a
                      href={isPreview ? "#" : formatTelHref(content.phone)}
                      style={{ backgroundColor: primaryColor, color: ctaTextColor }}
                      className={`h-11 sm:h-12 px-5 sm:px-6 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Prendre rendez-vous</span>
                    </a>
                  )}

                  {content.services_or_menu && content.services_or_menu.length > 0 && (
                    <a
                      href="#prestations"
                      className={`h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-white/90 hover:bg-white text-stone-900 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md transition cursor-pointer border border-stone-200/50 ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <span>Consulter les soins</span>
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
            badge="Présentation"
            title="L'institut"
            subtitle=""
            primaryColor={primaryColor}
            headingFontClass={beautyHeading.className}
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
                } space-y-5 text-sm sm:text-base text-stone-600 leading-relaxed max-w-prose`}
              >
                <p className="text-stone-900 text-sm sm:text-lg font-normal leading-relaxed">
                  {content.about}
                </p>
              </div>

              <div className={isPreview ? "w-full" : "lg:col-span-5"}>
                <ImageWithFallback
                  src={validGallery[0] || content.hero_image_url}
                  alt={`Espace détente - ${content.business_name}`}
                  aspectRatioClass="aspect-[4/3] rounded-2xl sm:rounded-3xl"
                  className="rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xl"
                  primaryColor={primaryColor}
                  fallbackIcon={Flower2}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </TemplateSection>
        )}

        {/* 4. SECTION PRESTATIONS (Masquée si vide) */}
        {content.services_or_menu && content.services_or_menu.length > 0 && (
          <TemplateSection
            id="prestations"
            badge="Tarifs"
            title="Nos soins et prestations"
            subtitle=""
            primaryColor={primaryColor}
            headingFontClass={beautyHeading.className}
            className="bg-white/80 border-y border-stone-200/80"
            isPreview={isPreview}
          >
            <PriceList
              items={content.services_or_menu}
              primaryColor={primaryColor}
              themeMode="light"
              headingFontClass={beautyHeading.className}
              isPreview={isPreview}
            />
          </TemplateSection>
        )}

        {/* 5. SECTION GALERIE DOUCE (Masquée si aucune photo réelle) */}
        {validGallery.length > 0 && (
          <TemplateSection
            id="galerie"
            badge="L'institut"
            title="L'atmosphère en images"
            subtitle="Poussez la porte de notre espace pensé pour votre détente."
            primaryColor={primaryColor}
            headingFontClass={beautyHeading.className}
            isPreview={isPreview}
          >
            <div
              className={`grid ${
                isPreview ? "grid-cols-2 gap-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              }`}
            >
              {validGallery.map((imgUrl, idx) => (
                <div key={idx} className="group overflow-hidden rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm">
                  <ImageWithFallback
                    src={imgUrl}
                    alt={`Soin du visage, corps et mise en beauté - ${content.business_name} (prestation ${idx + 1})`}
                    aspectRatioClass="aspect-[4/3]"
                    primaryColor={primaryColor}
                    fallbackIcon={Flower2}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </TemplateSection>
        )}

        {/* 6. AVIS CLIENTS (Masquée si aucune note réelle) */}
        {hasRealRating && (
          <TemplateSection
            id="avis"
            badge="Avis clients"
            title="Avis clients"
            subtitle="Les retours authentiques de nos clientes et clients après leur soin."
            primaryColor={primaryColor}
            headingFontClass={beautyHeading.className}
            className="bg-stone-100/60 border-y border-stone-200/80"
            isPreview={isPreview}
          >
            <ReviewsCard
              businessName={content.business_name}
              rating={content.rating}
              ratingsTotal={content.reviews_count}
              primaryColor={primaryColor}
              themeMode="light"
              headingFontClass={beautyHeading.className}
              isPreview={isPreview}
            />
          </TemplateSection>
        )}

        {/* 7. HORAIRES & PLAN */}
        <TemplateSection
          id="horaires"
          badge="Pratique"
          title="Horaires d'ouverture & Accès"
          subtitle="Notre équipe vous reçoit sur rendez-vous pour préserver votre tranquillité."
          primaryColor={primaryColor}
          headingFontClass={beautyHeading.className}
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
                themeMode="light"
              />
            </div>

            <div
              className={`${
                isPreview ? "w-full p-4 sm:p-6" : "lg:col-span-5 p-6 sm:p-8"
              } bg-white border border-stone-200 rounded-2xl sm:rounded-3xl space-y-5 shadow-md`}
            >
              <div>
                <h3 className="font-bold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Adresse & Coordonnées</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                  {content.address || "Adresse sur demande"}
                </p>
              </div>

              {content.phone && (
                <div className="pt-3 border-t border-stone-200">
                  <span className="text-xs text-stone-500 font-medium block">
                    Prise de rendez-vous
                  </span>
                  <a
                    href={isPreview ? "#" : formatTelHref(content.phone)}
                    className="text-base sm:text-lg font-bold mt-0.5 block tracking-tight hover:underline"
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
                className="w-full h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Ouvrir dans Google Maps</span>
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
        themeMode="light"
      />

      {/* 9. BARRE FIXE MOBILE */}
      <MobileStickyBar
        phone={content.phone}
        address={content.address}
        businessName={content.business_name}
        primaryColor={primaryColor}
        ctaType="book_treatment"
        isPreview={isPreview}
      />
    </div>
  )
}
