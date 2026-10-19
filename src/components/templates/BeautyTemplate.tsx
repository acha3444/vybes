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

  const navLinks = [
    { label: "L'Institut", href: "#apropos" },
    ...(content.services_or_menu && content.services_or_menu.length > 0
      ? [{ label: "Prestations", href: "#prestations" }]
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
      className={`min-h-screen bg-[#faf8f5] text-stone-800 selection:bg-rose-200 selection:text-stone-900 ${beautyBody.className}`}
    >
      {/* 1. NAVBAR ÉLÉGANTE EN TONS CLAIRS */}
      <TemplateNavbar
        businessName={content.business_name}
        tagline="Maison de Beauté & Soins Personnalisés"
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
          className={`relative overflow-hidden border-b border-stone-200/80 ${
            isPreview ? "pt-4 pb-8" : "pt-8 pb-16 sm:pt-14 sm:pb-24"
          }`}
        >
          <div
            className={`max-w-6xl mx-auto ${
              isPreview ? "px-3.5 sm:px-5" : "px-4 sm:px-8 lg:px-12"
            }`}
          >
            <div
              className={`relative rounded-3xl overflow-hidden flex flex-col justify-end border border-stone-200/80 shadow-2xl ${
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
                      ? "text-xl sm:text-3xl"
                      : "text-2xl sm:text-4xl lg:text-5xl"
                  } font-normal text-white tracking-tight leading-tight ${beautyHeading.className}`}
                >
                  {content.business_name}
                </h1>

                {content.tagline && (
                  <p className="mt-2 text-xs sm:text-base text-stone-200 font-light leading-relaxed text-balance max-w-xl">
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
                      className={`h-11 sm:h-13 px-5 sm:px-7 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-950/20 active:scale-95 transition cursor-pointer ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Prendre rendez-vous</span>
                    </a>
                  )}

                  {content.services_or_menu && content.services_or_menu.length > 0 && (
                    <a
                      href="#prestations"
                      className={`h-11 sm:h-13 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-white/90 hover:bg-white text-stone-900 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition cursor-pointer shadow-md ${
                        isPreview ? "w-full" : "w-full sm:w-auto"
                      }`}
                    >
                      <span>Découvrir nos soins</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECTION À PROPOS / BIEN-ÊTRE */}
        {content.about && (
          <TemplateSection
            id="apropos"
            badge="Philosophie"
            title="Un havre de calme et de beauté sur-mesure"
            subtitle="Chaque protocole est pensé comme un moment suspendu où douceur, gestuelle experte et produits d'exception se rencontrent."
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-200">
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                    <Feather className="w-4 h-4 text-rose-500 mb-1.5" />
                    <h4 className="font-bold text-xs text-stone-900">Toucher expert</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">Gestuelle apaisante</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                    <Flower2 className="w-4 h-4 text-rose-500 mb-1.5" />
                    <h4 className="font-bold text-xs text-stone-900">Actifs purs</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">Cosmétiques ciblés</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-rose-500 mb-1.5" />
                    <h4 className="font-bold text-xs text-stone-900">Diagnostic peau</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">Conseils sur-mesure</p>
                  </div>
                </div>
              </div>

              <div className={isPreview ? "w-full" : "lg:col-span-5"}>
                <ImageWithFallback
                  src={content.gallery_images && content.gallery_images[0]}
                  alt={`Cabine de soin et espace détente - ${content.business_name}`}
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

        {/* 4. SECTION PRESTATIONS AVEC CATÉGORIES & DURÉES */}
        {content.services_or_menu && content.services_or_menu.length > 0 && (
          <TemplateSection
            id="prestations"
            badge="Carte des soins"
            title="Nos rituels & prestations"
            subtitle="Prenez le temps d'un soin visage personnalisé, d'un massage délassant ou d'une mise en beauté complète."
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

            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-[#faf8f5] border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                <span>
                  Bons cadeaux disponibles pour tous nos soins et forfaits sur demande.
                </span>
              </div>
              {content.phone && (
                <a
                  href={isPreview ? "#" : formatTelHref(content.phone)}
                  style={{ backgroundColor: primaryColor, color: ctaTextColor }}
                  className="h-10 px-5 rounded-xl font-bold uppercase text-[11px] tracking-wider flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition"
                >
                  Prendre RDV au {content.phone}
                </a>
              )}
            </div>
          </TemplateSection>
        )}

        {/* 5. SECTION GALERIE DOUCE */}
        {content.gallery_images && content.gallery_images.length > 0 && (
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
              {content.gallery_images.map((imgUrl, idx) => (
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

        {/* 6. AVIS CLIENTS */}
        <TemplateSection
          id="avis"
          badge="Avis clients"
          title="Avis clients"
          subtitle="Les retours de nos clientes et clients après leur soin."
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
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold block">
                    Prise de rendez-vous
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
                className="w-full h-11 sm:h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Itinéraire Google Maps</span>
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
