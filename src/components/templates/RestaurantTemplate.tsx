import { DemoContent } from "@/types/database"
import { Phone, MapPin, Clock, Star, Utensils, Calendar, ChevronRight } from "lucide-react"

export default function RestaurantTemplate({ content }: { content: DemoContent }) {
  const primaryColor = content.primary_color || "#ea580c"

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-600 selection:text-white pb-16">
      {/* BARRE CONTACT FLOTTANTE MOBILE FIXÉE EN BAS */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-3 sm:hidden flex items-center gap-2">
        <a
          href={`tel:${content.phone}`}
          style={{ backgroundColor: primaryColor }}
          className="flex-1 h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4" />
          <span>Appeler pour réserver</span>
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            content.business_name + " " + content.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 shrink-0 active:scale-95 transition-transform"
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md"
          >
            <Utensils className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            {content.business_name}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${content.phone}`}
            style={{ backgroundColor: primaryColor }}
            className="px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" />
            <span>{content.phone}</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION IMMERSIVE */}
      <section className="relative max-w-5xl mx-auto px-4 pt-4 pb-12 sm:pt-8 sm:pb-20">
        <div className="relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-12 shadow-2xl border border-stone-800">
          {/* Image de fond avec overlay sombre */}
          <img
            src={content.hero_image_url}
            alt={content.business_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

          {/* Badges au-dessus du titre */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700/80 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.8 / 5 sur Google</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700/80 text-stone-200 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Ouvert ce midi et ce soir</span>
            </div>
          </div>

          {/* Titre et accroche */}
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {content.business_name}
            </h1>
            <p className="text-base sm:text-xl text-stone-300 mt-2 font-medium leading-relaxed">
              {content.tagline}
            </p>

            {/* Boutons d'action Hero */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <a
                href={`tel:${content.phone}`}
                style={{ backgroundColor: primaryColor }}
                className="h-12 px-6 rounded-2xl text-white font-bold text-sm flex items-center gap-2 shadow-xl hover:opacity-90 transition-opacity active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Réserver une table</span>
              </a>

              <a
                href="#menu"
                className="h-12 px-5 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-stone-200 font-semibold text-sm flex items-center gap-2 backdrop-blur-md transition-colors"
              >
                <span>Découvrir la carte</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INFOS CLÉS RAPIDES (Adresse, Horaires, Réservations) */}
      <section className="max-w-5xl mx-auto px-4 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start gap-3.5">
            <div
              style={{ color: primaryColor }}
              className="p-2.5 rounded-xl bg-stone-800 shrink-0 mt-0.5"
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Nous trouver</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {content.address}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start gap-3.5">
            <div
              style={{ color: primaryColor }}
              className="p-2.5 rounded-xl bg-stone-800 shrink-0 mt-0.5"
            >
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Horaires</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {content.opening_hours?.[0] || "12h-14h30 • 19h-22h30"}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start gap-3.5">
            <div
              style={{ color: primaryColor }}
              className="p-2.5 rounded-xl bg-stone-800 shrink-0 mt-0.5"
            >
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Réservation directe</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {content.phone}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION CARTE & MENUS */}
      <section id="menu" className="max-w-5xl mx-auto px-4 py-8 sm:py-12 border-t border-stone-800/80">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span
            style={{ color: primaryColor }}
            className="text-xs font-bold uppercase tracking-wider block mb-1"
          >
            Fait maison avec passion
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Les Incontournables de la Carte
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Des recettes savoureuses élaborées chaque jour à base de produits frais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.services_or_menu?.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-col justify-between hover:border-stone-700 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                  {item.name}
                </h3>
                <span
                  style={{ color: primaryColor }}
                  className="font-extrabold text-base shrink-0"
                >
                  {item.price}
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION NOTRE HISTOIRE & PHILOSOPHIE */}
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden aspect-video sm:aspect-square">
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
              Notre Maison
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Une histoire de passion et de convivialité
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              {content.about}
            </p>
            <div className="pt-2">
              <a
                href={`tel:${content.phone}`}
                style={{ backgroundColor: primaryColor }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
              >
                <Calendar className="w-4 h-4" />
                <span>Nous rendre visite</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE PHOTOS */}
      {content.gallery_images && content.gallery_images.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h3 className="text-lg font-bold text-white mb-4">
            L&apos;Ambiance & Les Assiettes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {content.gallery_images.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden border border-stone-800"
              >
                <img
                  src={img}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto px-4 pt-12 border-t border-stone-900 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-400">
          {content.business_name} • {content.address}
        </p>
        <p className="mt-1">
          Réservations & Commandes par téléphone au {content.phone}
        </p>
      </footer>
    </div>
  )
}
