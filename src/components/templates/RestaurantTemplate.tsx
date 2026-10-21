"use client"

import { DemoContent } from "@/types/database"
import { restaurantHeading, restaurantBody } from "@/lib/fonts"
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
import { Utensils, Star, MapPin, ChefHat } from "lucide-react"

export default function RestaurantTemplate({
  content,
  isPreview = false,
}: {
  content: DemoContent
  isPreview?: boolean
}) {
  const primaryColor = content.primary_color || "#c2410c"
  const ctaTextColor = getContrastTextColor(primaryColor)

  const hasRealRating = typeof content.rating === "number" && content.rating > 0
  const validGallery = (content.gallery_images || []).filter(
    (img) => typeof img === "string" && img.trim().length > 0
  )
  const hasMenu = Boolean(content.services_or_menu && content.services_or_menu.length > 0)

  const navLinks = [
    { label: "À propos", href: "#apropos" },
    ...(hasMenu ? [{ label: "La Carte", href: "#carte" }] : []),
    ...(validGallery.length > 0 ? [{ label: "Galerie", href: "#galerie" }] : []),
    ...(hasRealRating ? [{ label: "Avis", href: "#avis" }] : []),
    { label: "Horaires & Accès", href: "#horaires" },
  ]

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${content.business_name} ${content.address}`
  )}`

  return (
    <div
      className={`min-h-screen bg-stone-950 text-stone-100 selection:bg-orange-600 selection:text-white ${restaurantBody.className}`}
    >
      {/* 1. HEADER & NAVBAR */}
      <TemplateNavbar
        businessName={content.business_name}
        tagline={content.subtitle || "Restaurant"}
        phone={content.phone}
        primaryColor={primaryColor}
        icon={Utensils}
        links={navLinks}
        ctaLabel={content.phone ? "Appeler" : "Contact"}
        themeMode="dark"
        headingFontClass={restaurantHeading.className}
        isPreview={isPreview}
      />

      <main>
        {/* 2. HERO SECTION */}
        <section
          className={`relative overflow-hidden ${
            isPreview ? "pt-3 pb-5" : "pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-stone-900"
          }`}
        >
          <div
            className={`max-w-6xl mx-auto ${
              isPreview ? "px-3.5" : "px-4 sm:px-8 lg:px-12"
            }`}
          >
            <div
              className={`relative rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-end border border-stone-800 shadow-xl ${
                isPreview
                  ? "min-h-[360px] p-4"
                  : "min-h-[440px] sm:min-h-[520px] p-5 sm:p-10 lg:p-12"
              }`}
            >
              {/* Image de fond avec overlay sombre */}
              <ImageWithFallback
                src={content.hero_image_url}
                alt={content.business_name}
                aspectRatioClass="absolute inset-0 w-full h-full"
                className="absolute inset-0"
                primaryColor={primaryColor}
                fallbackIcon={ChefHat}
                priority
                sizes="100vw"
                overlay
                overlayClassName="bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/25"
              />

              {/* Contenu textuel Hero */}
              <div className="relative z-10 max-w-2xl">
                {/* Note réelle Google si disponible (aucun badge inventé) */}
                {hasRealRating && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/90 border border-stone-700/80 text-amber-400 text-xs font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(content.rating).toFixed(1)} / 5</span>
                    </span>
                  </div>
                )}

                {/* Titre */}
                <h1
                  className={`${
                    isPreview
                      ? "text-xl"
                      : "text-2xl sm:text-4xl lg:text-5xl"
                  } font-black text-white tracking-tight leading-tight ${restaurantHeading.className}`}
                >
                  {content.business_name}
                </h1>

                {content.tagline && (
                  <p
                    className={`mt-2 ${
                      isPreview ? "text-xs" : "text-xs sm:text-base"
                    } text-stone-300 font-normal leading-relaxed max-w-xl`}
                  >
                    {content.tagline}
                  </p>
                )}

                {/* Boutons d'action hero */}
                <div
                  className={`flex ${
                    isPreview
                      ? "flex-col w-full items-stretch gap-2 mt-4"
                      : "flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mt-5 sm:mt-7"
                  }`}
                >
                  {content.phone && (
                    <a
                      href={isPreview ? "#" : formatTelHref(content.phone)}
                      style={{ backgroundColor: primaryColor, color: ctaTextColor }}
                      className={`h-11 px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition cursor-pointer ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <Utensils className="w-4 h-4 shrink-0" />
                      <span>Appeler pour réserver</span>
                    </a>
                  )}

                  {hasMenu && (
                    <a
                      href="#carte"
                      className={`h-11 px-5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <span>Consulter la carte</span>
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
            title="À propos"
            subtitle="Présentation de l'établissement et informations pratiques."
            primaryColor={primaryColor}
            headingFontClass={restaurantHeading.className}
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
                } space-y-4 text-sm sm:text-base text-stone-300 leading-relaxed max-w-prose`}
              >
                <p className="text-stone-200 text-sm sm:text-base font-normal leading-relaxed">
                  {content.about}
                </p>
                {content.address && (
                  <p className="text-xs text-stone-400 flex items-center gap-1.5 pt-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{content.address}</span>
                  </p>
                )}
              </div>

              {validGallery.length > 0 && (
                <div className={isPreview ? "w-full" : "lg:col-span-5"}>
                  <ImageWithFallback
                    src={validGallery[0]}
                    alt={content.business_name}
                    aspectRatioClass="aspect-[4/3] rounded-2xl"
                    className="rounded-2xl border border-stone-800"
                    primaryColor={primaryColor}
                    fallbackIcon={Utensils}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          </TemplateSection>
        )}

        {/* 4. SECTION LA CARTE (Masquée tant que vide) */}
        {hasMenu && (
          <TemplateSection
            id="carte"
            title="La Carte"
            subtitle="Nos plats et suggestions."
            primaryColor={primaryColor}
            headingFontClass={restaurantHeading.className}
            className="bg-stone-900/40 border-y border-stone-900"
            isPreview={isPreview}
          >
            <PriceList
              items={content.services_or_menu}
              primaryColor={primaryColor}
              themeMode="dark"
              headingFontClass={restaurantHeading.className}
              isPreview={isPreview}
            />
          </TemplateSection>
        )}

        {/* 5. SECTION GALERIE DE PHOTOS (Masquée si aucune photo) */}
        {validGallery.length > 0 && (
          <TemplateSection
            id="galerie"
            title="Galerie"
            subtitle="Quelques aperçus de notre établissement."
            primaryColor={primaryColor}
            headingFontClass={restaurantHeading.className}
            isPreview={isPreview}
          >
            <div
              className={`grid ${
                isPreview ? "grid-cols-2 gap-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              }`}
            >
              {validGallery.map((imgUrl, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-stone-800">
                  <ImageWithFallback
                    src={imgUrl}
                    alt={`Photo - ${content.business_name} (${idx + 1})`}
                    aspectRatioClass="aspect-[4/3]"
                    primaryColor={primaryColor}
                    fallbackIcon={Utensils}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </TemplateSection>
        )}

        {/* 6. AVIS CLIENTS (Masquée si aucune note Google réelle) */}
        {hasRealRating && (
          <TemplateSection
            id="avis"
            title="Avis clients"
            subtitle="Notes et retours partagés sur Google Maps."
            primaryColor={primaryColor}
            headingFontClass={restaurantHeading.className}
            className="bg-stone-900/30 border-y border-stone-900"
            isPreview={isPreview}
          >
            <ReviewsCard
              businessName={content.business_name}
              rating={content.rating}
              ratingsTotal={content.reviews_count}
              primaryColor={primaryColor}
              themeMode="dark"
              headingFontClass={restaurantHeading.className}
              isPreview={isPreview}
            />
          </TemplateSection>
        )}

        {/* 7. HORAIRES & ACCÈS */}
        <TemplateSection
          id="horaires"
          title="Horaires d'ouverture & Accès"
          subtitle="Retrouvez nos horaires d'ouverture et nos coordonnées ci-dessous."
          primaryColor={primaryColor}
          headingFontClass={restaurantHeading.className}
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
                isPreview ? "w-full p-4 sm:p-5" : "lg:col-span-5 p-5 sm:p-7"
              } bg-stone-900/90 border border-stone-800 rounded-2xl space-y-4`}
            >
              <div>
                <h3 className="font-semibold text-white text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-stone-400" />
                  <span>Adresse & Coordonnées</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                  {content.address || "Adresse sur demande"}
                </p>
              </div>

              {content.phone && (
                <div className="pt-3 border-t border-stone-800">
                  <span className="text-[11px] text-stone-400 font-medium block">
                    Réservations par téléphone
                  </span>
                  <a
                    href={isPreview ? "#" : formatTelHref(content.phone)}
                    className="text-base sm:text-lg font-bold mt-0.5 block hover:underline"
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
                className="w-full h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium text-xs flex items-center justify-center gap-2 border border-stone-700 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Ouvrir sur Google Maps</span>
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

      {/* 9. BARRE FIXE BAS DE PAGE (MOBILE) */}
      <MobileStickyBar
        phone={content.phone}
        address={content.address}
        businessName={content.business_name}
        primaryColor={primaryColor}
        ctaType="reserve_table"
        isPreview={isPreview}
      />
    </div>
  )
}
