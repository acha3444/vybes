import { DemoContent } from "@/types/database"
import { Phone, MapPin, Clock, Star, Sparkles, ArrowUpRight } from "lucide-react"

export default function BeautyTemplate({
  content,
  isPreview = false,
}: {
  content: DemoContent
  isPreview?: boolean
}) {
  const primaryColor = content.primary_color || "#be185d"

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-pink-600 selection:text-white pb-24">
      {/* BARRE FLOTTANTE MOBILE */}
      <div
        className={`${
          isPreview ? "absolute" : "fixed"
        } bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-3 sm:hidden flex items-center gap-2`}
      >
        <a
          href={isPreview ? "#" : `tel:${content.phone}`}
          style={{ backgroundColor: primaryColor }}
          className="flex-1 h-12 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4" />
          <span>Réserver un créneau</span>
        </a>
        <a
          href={
            isPreview
              ? "#"
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  content.business_name + " " + content.address
                )}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-xl bg-stone-850 border border-stone-750 flex items-center justify-center text-stone-200 shrink-0 active:scale-95 transition-transform"
          title="Itinéraire"
        >
          <MapPin className="w-5 h-5" />
        </a>
      </div>

      {/* HEADER ÉPURÉ */}
      <header className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between border-b border-stone-900">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: primaryColor }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white uppercase">
            {content.business_name}
          </span>
        </div>

        <a
          href={isPreview ? "#" : `tel:${content.phone}`}
          style={{ borderColor: primaryColor, color: primaryColor }}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{content.phone}</span>
        </a>
      </header>

      {/* HERO SECTION LUMINEUSE */}
      <section className="relative max-w-4xl mx-auto px-4 pt-6 pb-10 sm:pt-10 sm:pb-16">
        <div className="relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[500px] flex flex-col justify-end p-6 sm:p-10 shadow-2xl border border-stone-850">
          <img
            src={content.hero_image_url}
            alt={content.business_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-transparent" />

          {/* Badges */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-750 text-pink-300 text-xs font-bold">
              <Star className="w-3 h-3 fill-pink-400 text-pink-400" />
              <span>4.9 / 5 sur Google</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-800 text-stone-300 text-xs font-medium">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>Sur rendez-vous</span>
            </span>
          </div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {content.business_name}
            </h1>
            <p className="text-sm sm:text-base text-stone-200 mt-2 font-medium leading-relaxed">
              {content.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <a
                href={isPreview ? "#" : `tel:${content.phone}`}
                style={{ backgroundColor: primaryColor }}
                className="h-12 px-6 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:opacity-95 transition-opacity active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Prendre rendez-vous</span>
              </a>

              <a
                href="#soins"
                className="h-12 px-5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-750 text-stone-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md transition-colors"
              >
                <span>Les soins</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INFOS INSTITUT */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-850">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Institut
            </span>
            <p className="text-xs font-semibold text-white leading-relaxed">
              {content.address}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-850">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Horaires
            </span>
            <p className="text-xs font-semibold text-white leading-relaxed">
              {content.opening_hours?.[0] || "10h00 - 19h00"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-850">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Réservations
            </span>
            <p className="text-xs font-semibold text-white leading-relaxed">
              {content.phone}
            </p>
          </div>
        </div>
      </section>

      {/* CARTE DES SOINS */}
      <section id="soins" className="max-w-4xl mx-auto px-4 py-8 border-t border-stone-900">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
              Prestations & Rituels
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Carte des Soins
            </h2>
          </div>
          <span className="text-xs text-stone-400 hidden sm:block">
            Gestes experts & produits professionnels
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.services_or_menu?.map((soin, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-900/80 border border-stone-850 flex flex-col justify-between hover:border-stone-750 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="font-bold text-sm text-white">{soin.name}</h3>
                <span
                  style={{ color: primaryColor }}
                  className="font-extrabold text-sm shrink-0"
                >
                  {soin.price}
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">{soin.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* À PROPOS DE L'INSTITUT */}
      <section className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/50 border border-stone-850 flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-5/12 rounded-2xl overflow-hidden aspect-square border border-stone-850">
            <img
              src={content.gallery_images?.[0] || content.hero_image_url}
              alt={content.business_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-7/12 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">
              L&apos;Institut
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Un lieu calme pour prendre soin de vous.
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {content.about}
            </p>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      {content.gallery_images && content.gallery_images.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-3">
            {content.gallery_images.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden border border-stone-850"
              >
                <img
                  src={img}
                  alt={`Soin ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto px-4 pt-10 text-center text-xs text-stone-400">
        <p className="font-semibold text-stone-300">
          {content.business_name} • {content.address}
        </p>
        <p className="mt-1">Rendez-vous : {content.phone}</p>
      </footer>
    </div>
  )
}
