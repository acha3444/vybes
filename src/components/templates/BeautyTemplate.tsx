import { DemoContent } from "@/types/database"
import { Phone, MapPin, Clock, Star, Sparkles, ChevronRight, Heart } from "lucide-react"

export default function BeautyTemplate({ content }: { content: DemoContent }) {
  const primaryColor = content.primary_color || "#db2777"

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-pink-600 selection:text-white pb-16">
      {/* BARRE CONTACT FLOTTANTE MOBILE FIXÉE EN BAS */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-3 sm:hidden flex items-center gap-2">
        <a
          href={`tel:${content.phone}`}
          style={{ backgroundColor: primaryColor }}
          className="flex-1 h-12 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4" />
          <span>Réserver un Soin</span>
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            content.business_name + " " + content.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 shrink-0 active:scale-95 transition-transform"
          title="Itinéraire"
        >
          <MapPin className="w-5 h-5" />
        </a>
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: primaryColor }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md"
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            {content.business_name}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${content.phone}`}
            style={{ backgroundColor: primaryColor }}
            className="px-5 py-2.5 rounded-full text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" />
            <span>Prendre rendez-vous</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION COCOONING */}
      <section className="relative max-w-5xl mx-auto px-4 pt-4 pb-12 sm:pt-8 sm:pb-20">
        <div className="relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-12 shadow-2xl border border-stone-800">
          <img
            src={content.hero_image_url}
            alt={content.business_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/20" />

          {/* Badges */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-pink-500/30 text-pink-300 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
              <span>4.9 / 5 • Soins d&apos;exception</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700 text-stone-300 text-xs font-medium">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span>Cosmétiques naturels & bio</span>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {content.business_name}
            </h1>
            <p className="text-base sm:text-lg text-stone-200 mt-3 font-normal leading-relaxed">
              {content.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-7">
              <a
                href={`tel:${content.phone}`}
                style={{ backgroundColor: primaryColor }}
                className="h-12 px-7 rounded-full text-white font-bold text-sm flex items-center gap-2 shadow-xl hover:opacity-90 transition-opacity active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Prendre rendez-vous</span>
              </a>

              <a
                href="#soins"
                className="h-12 px-6 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-stone-200 font-semibold text-xs flex items-center gap-2 backdrop-blur-md transition-colors"
              >
                <span>Découvrir la carte des soins</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION SOINS & RITUELS */}
      <section id="soins" className="max-w-5xl mx-auto px-4 py-8 sm:py-14 border-t border-stone-800">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span
            style={{ color: primaryColor }}
            className="text-xs font-bold uppercase tracking-wider block mb-1"
          >
            Votre bien-être est notre priorité
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Carte des Soins & Rituels
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Des protocoles de soins sur-mesure pour sublimer votre peau et vous relaxer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.services_or_menu?.map((soin, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 flex flex-col justify-between hover:border-pink-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    style={{ color: primaryColor }}
                    className="p-1.5 rounded-full bg-pink-500/10 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-bold text-base text-white">
                    {soin.name}
                  </h3>
                </div>
                <span
                  style={{ color: primaryColor }}
                  className="font-extrabold text-base shrink-0"
                >
                  {soin.price}
                </span>
              </div>
              <p className="text-xs text-stone-400 pl-8 leading-relaxed">
                {soin.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* L'INSTITUT & PHILOSOPHIE */}
      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden aspect-square border border-stone-800">
            <img
              src={content.gallery_images?.[0] || content.hero_image_url}
              alt={content.business_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <span
              style={{ color: primaryColor }}
              className="text-xs font-bold uppercase tracking-wider block"
            >
              Une Parenthèse Précieuse
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Prenez du temps rien que pour vous
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              {content.about}
            </p>
            <div className="pt-2">
              <a
                href={`tel:${content.phone}`}
                style={{ backgroundColor: primaryColor }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
              >
                <Phone className="w-4 h-4" />
                <span>Nous contacter</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INFOS PRATIQUES */}
      <section className="max-w-5xl mx-auto px-4 py-10 border-t border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800">
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-400" />
              <span>Adresse de l&apos;Institut</span>
            </h4>
            <p className="text-sm text-stone-300 font-medium">{content.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                content.business_name + " " + content.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-pink-400 hover:text-pink-300 font-bold inline-block mt-3"
            >
              Plan d&apos;accès Google Maps →
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800">
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" />
              <span>Horaires d&apos;ouverture</span>
            </h4>
            <div className="space-y-1 text-xs text-stone-300">
              {content.opening_hours?.map((h, i) => (
                <p key={i}>{h}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto px-4 text-center text-xs text-stone-500">
        <p className="font-bold text-stone-400">
          {content.business_name} • {content.phone}
        </p>
      </footer>
    </div>
  )
}
