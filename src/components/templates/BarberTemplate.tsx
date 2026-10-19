import { DemoContent } from "@/types/database"
import { Phone, MapPin, Clock, Star, Scissors, ChevronRight, Check } from "lucide-react"

export default function BarberTemplate({ content }: { content: DemoContent }) {
  const primaryColor = content.primary_color || "#d97706"

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-600 selection:text-white pb-16">
      {/* BARRE CONTACT FLOTTANTE MOBILE FIXÉE EN BAS */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-3 sm:hidden flex items-center gap-2">
        <a
          href={`tel:${content.phone}`}
          style={{ backgroundColor: primaryColor }}
          className="flex-1 h-12 rounded-xl text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4" />
          <span>Prendre Rendez-vous</span>
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            content.business_name + " " + content.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-xl bg-zinc-850 border border-zinc-700 flex items-center justify-center text-zinc-200 shrink-0 active:scale-95 transition-transform"
          title="Itinéraire"
        >
          <MapPin className="w-5 h-5" />
        </a>
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between border-b border-zinc-850">
        <div className="flex items-center gap-2.5">
          <div
            style={{ backgroundColor: primaryColor }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-950 font-black text-base shadow-md"
          >
            <Scissors className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tight text-white uppercase">
            {content.business_name}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${content.phone}`}
            style={{ backgroundColor: primaryColor }}
            className="px-5 py-2.5 rounded-xl text-zinc-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" />
            <span>Appeler le salon</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION STYLE BARBER MAT */}
      <section className="relative max-w-5xl mx-auto px-4 pt-6 pb-12 sm:pt-10 sm:pb-20">
        <div className="relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-12 shadow-2xl border border-zinc-800">
          <img
            src={content.hero_image_url}
            alt={content.business_name}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/30" />

          {/* Badges */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.9 / 5 sur Google (Avis vérifiés)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-zinc-300 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Avec ou Sans Rendez-vous</span>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
              {content.business_name}
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 mt-3 font-medium leading-relaxed">
              {content.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-7">
              <a
                href={`tel:${content.phone}`}
                style={{ backgroundColor: primaryColor }}
                className="h-12 px-7 rounded-2xl text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl hover:opacity-90 transition-opacity active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Prendre Rendez-vous</span>
              </a>

              <a
                href="#tarifs"
                className="h-12 px-5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur-md transition-colors"
              >
                <span>Voir les tarifs</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION PRESTATIONS & TARIFS */}
      <section id="tarifs" className="max-w-5xl mx-auto px-4 py-8 sm:py-14 border-t border-zinc-850">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span
            style={{ color: primaryColor }}
            className="text-xs font-black uppercase tracking-widest block mb-1"
          >
            Coupe de précision & Barbe
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Nos Prestations & Tarifs
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Des barbiers diplômés pour un style soigné et sans compromis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.services_or_menu?.map((service, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    style={{ color: primaryColor }}
                    className="p-1.5 rounded-lg bg-zinc-800 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-bold text-base text-white">
                    {service.name}
                  </h3>
                </div>
                <span
                  style={{ color: primaryColor }}
                  className="font-black text-lg shrink-0"
                >
                  {service.price}
                </span>
              </div>
              <p className="text-xs text-zinc-400 pl-8 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* L'EXPÉRIENCE DU SALON */}
      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden aspect-square border border-zinc-800">
            <img
              src={content.gallery_images?.[0] || content.hero_image_url}
              alt={content.business_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <span
              style={{ color: primaryColor }}
              className="text-xs font-black uppercase tracking-widest block"
            >
              L&apos;Atelier & Le Savoir-Faire
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Plus qu&apos;une coupe, une routine d&apos;exception
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {content.about}
            </p>
            <div className="pt-2">
              <a
                href={`tel:${content.phone}`}
                style={{ backgroundColor: primaryColor }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity"
              >
                <Phone className="w-4 h-4" />
                <span>Réserver un créneau</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE RÉALISATIONS */}
      {content.gallery_images && content.gallery_images.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Dernières Réalisations du Salon
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {content.gallery_images.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden border border-zinc-800 group"
              >
                <img
                  src={img}
                  alt={`Coupe ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INFOS & CONTACT */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-zinc-850">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Adresse du salon</span>
            </h4>
            <p className="text-sm text-zinc-300 font-medium">{content.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                content.business_name + " " + content.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-block mt-3"
            >
              Ouvrir dans Google Maps →
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Horaires d&apos;ouverture</span>
            </h4>
            <div className="space-y-1 text-xs text-zinc-300">
              {content.opening_hours?.map((h, i) => (
                <p key={i}>{h}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto px-4 text-center text-xs text-zinc-500">
        <p className="font-bold text-zinc-400">
          {content.business_name} • {content.phone}
        </p>
      </footer>
    </div>
  )
}
