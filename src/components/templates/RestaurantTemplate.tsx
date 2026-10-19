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
import { Utensils, Star, Clock, MapPin, ChefHat, Sparkles, Flame, Wine } from "lucide-react"

export default function RestaurantTemplate({
  content,
  isPreview = false,
}: {
  content: DemoContent
  isPreview?: boolean
}) {
  const primaryColor = content.primary_color || "#c2410c"
  const ctaTextColor = getContrastTextColor(primaryColor)

  const navLinks = [
    { label: "À propos", href: "#apropos" },
    ...(content.services_or_menu && content.services_or_menu.length > 0
      ? [{ label: "La Carte", href: "#carte" }]
      : []),
    ...(content.gallery_images && content.gallery_images.length > 0
      ? [{ label: "Galerie", href: "#galerie" }]
      : []),
    { label: "Avis", href: "#avis" },
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
        tagline="Restaurant & Cuisine de Saison"
        phone={content.phone}
        primaryColor={primaryColor}
        icon={Utensils}
        links={navLinks}
        ctaLabel="Réserver"
        themeMode="dark"
        headingFontClass={restaurantHeading.className}
        isPreview={isPreview}
      />

      <main>
        {/* 2. HERO SECTION GASTRONOMIQUE */}
        <section
          className={`relative overflow-hidden border-b border-stone-900 ${
            isPreview ? "pt-4 pb-8" : "pt-8 pb-16 sm:pt-14 sm:pb-24"
          }`}
        >
          <div
            className={`max-w-6xl mx-auto ${
              isPreview ? "px-3.5 sm:px-5" : "px-4 sm:px-8 lg:px-12"
            }`}
          >
            <div
              className={`relative rounded-3xl overflow-hidden flex flex-col justify-end border border-stone-800 shadow-2xl ${
                isPreview
                  ? "min-h-[380px] p-4 sm:p-6"
                  : "min-h-[460px] sm:min-h-[560px] p-5 sm:p-10 lg:p-14"
              }`}
            >
              {/* Image de fond avec overlay sombre pour lisibilité 100% */}
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
                overlayClassName="bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/20"
              />

              {/* Contenu textuel Hero */}
              <div className="relative z-10 max-w-2xl">
                {/* Badges d'assurance */}
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-700/80 text-amber-400 text-[11px] sm:text-xs font-bold shadow-xs">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5 • Fait maison</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-700/80 text-stone-300 text-[11px] sm:text-xs font-medium shadow-xs">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400" />
                    <span>Midi & Soir</span>
                  </span>
                </div>

                {/* Titre (Gère les noms très longs sans jamais déborder) */}
                <h1
                  className={`${
                    isPreview
                      ? "text-xl sm:text-3xl"
                      : "text-2xl sm:text-4xl lg:text-5xl"
                  } font-black text-white tracking-tight text-balance leading-tight ${restaurantHeading.className}`}
                >
                  {content.business_name}
                </h1>

                {content.tagline && (
                  <p className="mt-2 text-xs sm:text-base text-stone-300 font-normal leading-relaxed text-balance max-w-xl">
                    {content.tagline}
                  </p>
                )}

                {/* Boutons d'action hero */}
                <div
                  className={`flex ${
                    isPreview ? "flex-col w-full" : "flex-col sm:flex-row"
                  } items-stretch sm:items-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-8`}
                >
                  {content.phone && (
                    <a
                      href={isPreview ? "#" : `tel:${content.phone}`}
                      style={{ backgroundColor: primaryColor, color: ctaTextColor }}
                      className={`h-11 sm:h-13 px-5 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-950/30 active:scale-95 transition cursor-pointer ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <Utensils className="w-4 h-4 shrink-0" />
                      <span>Réserver une table</span>
                    </a>
                  )}

                  {content.services_or_menu && content.services_or_menu.length > 0 && (
                    <a
                      href="#carte"
                      className={`h-11 sm:h-13 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition cursor-pointer ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <span>Découvrir la carte</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECTION À PROPOS / SAVOIR-FAIRE */}
        {content.about && (
          <TemplateSection
            id="apropos"
            badge="Notre engagement"
            title="Une table chaleureuse dédiée aux produits frais"
            subtitle="Chaque jour, notre brigade sélectionne les meilleurs produits du marché pour vous offrir une cuisine authentique et généreuse."
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
                } space-y-5 text-sm sm:text-base text-stone-300 leading-relaxed max-w-prose`}
              >
                <p className="text-stone-200 text-sm sm:text-lg font-medium leading-relaxed">
                  {content.about}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-900">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Cuisson maîtrisée</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Flamme & braise</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Fait maison</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Recettes artisanales</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      <Wine className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Cave choisie</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Vignerons passionnés</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={isPreview ? "w-full" : "lg:col-span-5"}>
                <ImageWithFallback
                  src={content.gallery_images && content.gallery_images[0]}
                  alt="Ambiance restaurant"
                  aspectRatioClass="aspect-[4/3] rounded-2xl sm:rounded-3xl"
                  className="rounded-2xl sm:rounded-3xl border border-stone-800 shadow-2xl"
                  primaryColor={primaryColor}
                  fallbackIcon={Utensils}
                />
              </div>
            </div>
          </TemplateSection>
        )}

        {/* 4. SECTION LA CARTE & LE MENU (Si items disponibles) */}
        {content.services_or_menu && content.services_or_menu.length > 0 && (
          <TemplateSection
            id="carte"
            badge="Carte de saison"
            title="Nos suggestions & spécialités du moment"
            subtitle="Tous nos plats sont cuisinés sur place à la commande à base d'ingrédients bruts rigoureusement sélectionnés."
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

            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-stone-900/80 border border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Allergies ou régimes particuliers ? Notre équipe adapte volontiers ses préparations sur demande.
                </span>
              </div>
              {content.phone && (
                <a
                  href={isPreview ? "#" : `tel:${content.phone}`}
                  className="font-bold shrink-0 hover:underline"
                  style={{ color: primaryColor }}
                >
                  Contacter le chef : {content.phone}
                </a>
              )}
            </div>
          </TemplateSection>
        )}

        {/* 5. SECTION GALERIE DE PHOTOS (Masquée si aucune photo) */}
        {content.gallery_images && content.gallery_images.length > 0 && (
          <TemplateSection
            id="galerie"
            badge="En images"
            title="L'expérience en salle et dans l'assiette"
            subtitle="Un aperçu de nos dressages, de nos cuissons et de l'atmosphère qui vous attend."
            primaryColor={primaryColor}
            headingFontClass={restaurantHeading.className}
            isPreview={isPreview}
          >
            <div
              className={`grid ${
                isPreview ? "grid-cols-2 gap-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              }`}
            >
              {content.gallery_images.map((imgUrl, idx) => (
                <div key={idx} className="group overflow-hidden rounded-xl sm:rounded-2xl border border-stone-800">
                  <ImageWithFallback
                    src={imgUrl}
                    alt={`Assiette ${idx + 1}`}
                    aspectRatioClass="aspect-[4/3]"
                    primaryColor={primaryColor}
                    fallbackIcon={Utensils}
                  />
                </div>
              ))}
            </div>
          </TemplateSection>
        )}

        {/* 6. AVIS CLIENTS & RÉPUTATION */}
        <TemplateSection
          id="avis"
          badge="Avis vérifiés"
          title="Ce que disent les convives"
          subtitle="Une régularité saluée par nos clients fidèles et les visiteurs de passage."
          primaryColor={primaryColor}
          headingFontClass={restaurantHeading.className}
          className="bg-stone-900/30 border-y border-stone-900"
          isPreview={isPreview}
        >
          <ReviewsCard
            businessName={content.business_name}
            rating={4.9}
            ratingsTotal={240}
            primaryColor={primaryColor}
            themeMode="dark"
            headingFontClass={restaurantHeading.className}
            isPreview={isPreview}
          />
        </TemplateSection>

        {/* 7. HORAIRES & ACCÈS */}
        <TemplateSection
          id="horaires"
          badge="Infos pratiques"
          title="Horaires d'ouverture & Accès"
          subtitle="Nous vous accueillons midi et soir. Réservation fortement conseillée pour le service du soir."
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
                isPreview ? "w-full p-4 sm:p-6" : "lg:col-span-5 p-6 sm:p-8"
              } bg-stone-900/90 border border-stone-800 rounded-2xl sm:rounded-3xl space-y-5`}
            >
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Adresse & Coordonnées</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
                  {content.address || "Adresse sur demande"}
                </p>
              </div>

              {content.phone && (
                <div className="pt-3 border-t border-stone-800">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">
                    Réservations par téléphone
                  </span>
                  <a
                    href={isPreview ? "#" : `tel:${content.phone}`}
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
                className="w-full h-11 sm:h-12 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-stone-700 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
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
