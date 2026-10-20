import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  Search,
  Zap,
  MessageSquare,
  CheckCircle,
  ShieldCheck,
  Star,
  Smartphone,
  Eye,
  MapPin,
} from "lucide-react"
import { Reveal } from "@/components/motion/Reveal"
import { Spotlight } from "@/components/motion/Spotlight"
import { HeroVisual } from "@/components/landing/HeroVisual"
import { RoiCalculator } from "@/components/landing/RoiCalculator"

const STEPS = [
  {
    number: "01",
    icon: Search,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    title: "Trouve les commerces sans site",
    text: "Entre une ville et une catégorie (restaurant, barber, institut). Notre outil filtre directement ceux qui n'ont aucun site web officiel.",
    footIcon: Star,
    footIconClass: "text-amber-400 fill-amber-400",
    foot: "Données officielles d'entreprises en temps réel",
  },
  {
    number: "02",
    icon: Zap,
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    title: "Génère sa démo en 60 secondes",
    text: "En 1 clic, un site de démo complet est créé avec son nom, son adresse et ses horaires. Personnalise photos et couleurs en 2 minutes si tu veux.",
    footIcon: Smartphone,
    footIconClass: "text-violet-400",
    foot: "3 templates professionnels inclus",
  },
  {
    number: "03",
    icon: MessageSquare,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    title: "Envoie le message & suis les visites",
    text: "Copie le message DM Instagram, SMS ou Email pré-rédigé contenant le lien direct vers sa démo personnalisée.",
    footIcon: Eye,
    footIconClass: "text-emerald-400",
    foot: "Lien unique sécurisé avec compteur de visites",
  },
]

const FEATURES = [
  "Recherches illimitées de commerces sans site",
  "Génération de démos illimitées (Restaurant, Barber, Institut)",
  "Liens de démo uniques et sécurisés avec suivi des consultations",
  "Générateur de messages de prospection (DM Insta, SMS, Email)",
  "Tableau de bord de suivi des prospects",
]

const CITIES = [
  "Lyon",
  "Paris",
  "Marseille",
  "Bordeaux",
  "Lille",
  "Toulouse",
  "Nantes",
  "Montpellier",
  "Strasbourg",
  "Rennes",
  "Nice",
  "Grenoble",
]

export default function HomePage() {
  return (
    <div className="grain relative min-h-screen overflow-x-clip bg-[#07070b] text-white selection:bg-indigo-500 selection:text-white">
      {/* Fond : halos + grille */}
      <div className="absolute inset-x-0 top-0 h-[1100px] pointer-events-none">
        <div className="aurora" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#07070b]/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/30 transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg] group-hover:scale-105">
              V
            </div>
            <div>
              <span className="font-black text-xl sm:text-2xl tracking-tight text-white block leading-none">
                Vybe
              </span>
              <span className="hidden sm:block text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
                Vente de sites locaux
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/connexion"
              className="px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="px-4 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-sm hover:bg-indigo-50 transition-all active:scale-[0.97] shadow-[0_0_24px_-4px_rgb(129_140_248/0.6)]"
            >
              Essai 7j gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left">
          {/* Pilule annonce */}
          <div className="animate-fade-up inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-neutral-200 text-xs sm:text-sm font-medium mb-7 backdrop-blur">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              Nouveau
            </span>
            <span>Conçu pour les freelances qui se lancent</span>
          </div>

          {/* Titre Promesse */}
          <h1
            className="animate-fade-up text-[2.6rem] sm:text-6xl lg:text-[4.2rem] font-black tracking-[-0.035em] text-white leading-[1.02]"
            style={{ animationDelay: "100ms" }}
          >
            Trouve un commerce sans site.{" "}
            <span className="text-gradient">Génère sa démo en 60 secondes.</span>
          </h1>

          <p
            className="animate-fade-up max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-neutral-400 mt-6 leading-relaxed"
            style={{ animationDelay: "200ms" }}
          >
            Identifie les commerces de ta ville qui n&apos;ont aucun site web, génère leur démo mobile
            personnalisée en 1 clic et envoie-leur un message <span className="text-neutral-200">prêt à signer</span>.
          </p>

          {/* Boutons d'action */}
          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-9"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/inscription"
              className="btn-shine group w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold text-base shadow-[0_10px_40px_-10px_rgb(99_102_241/0.8)] hover:shadow-[0_14px_50px_-8px_rgb(139_92_246/0.9)] flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Démarrer 7 jours gratuits</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/connexion"
              className="w-full sm:w-auto h-14 px-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-neutral-300 hover:text-white font-semibold text-base flex items-center justify-center transition-colors backdrop-blur"
            >
              Accéder à mon compte
            </Link>
          </div>

          {/* Reassurance */}
          <div
            className="animate-fade-up flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-neutral-400 font-medium mt-7"
            style={{ animationDelay: "400ms" }}
          >
            {["7 jours d'essai", "29€ / mois sans engagement", "Annulable en 1 clic"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "250ms" }}>
          <HeroVisual />
        </div>
      </section>

      {/* BANDEAU VILLES */}
      <section className="relative border-y border-white/5 bg-white/[0.015] py-6">
        <p className="text-center text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-4">
          Prospecte dans n&apos;importe quelle ville
        </p>
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...CITIES, ...CITIES].map((city, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-6 text-lg sm:text-xl font-semibold text-neutral-500 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 text-indigo-400/70" />
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DÉMONSTRATION DU PARCOURS EN 3 ÉTAPES */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
            Comment ça marche
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-[-0.03em] mt-3 leading-[1.08]">
            La méthode la plus directe pour prospecter les commerces locaux
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-4">
            Pas besoin de savoir coder, pas besoin de négocier pendant des heures.
          </p>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Ligne de liaison entre les étapes */}
          <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-indigo-500/0 via-violet-500/40 to-emerald-500/0" />

          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 120} className="h-full">
              <Spotlight className="group h-full rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:border-white/15 hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`relative w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform duration-500 ease-out-expo group-hover:scale-110 group-hover:rotate-[-6deg] bg-[#0b0b12] ${step.color}`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-4xl font-bold text-white/[0.06] transition-colors duration-500 group-hover:text-white/15">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{step.text}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                  <step.footIcon className={`w-4 h-4 ${step.footIconClass}`} />
                  <span>{step.foot}</span>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CALCULATEUR DE RENTABILITÉ */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Fais le calcul
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-[-0.03em] mt-3 leading-[1.08]">
              Un client signé.{" "}
              <span className="text-neutral-500">Ton abonnement remboursé pour des mois.</span>
            </h2>
            <p className="text-neutral-400 mt-5 max-w-md leading-relaxed">
              Tu fixes ton prix, Vybe s&apos;occupe de te trouver les commerces et de leur montrer à
              quoi ressemblerait leur site. Déplace le curseur pour voir.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <RoiCalculator />
          </Reveal>
        </div>
      </section>

      {/* OFFRE COMMERCIALE CLAIRE (29€/MOIS) */}
      <section id="tarif" className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-72 bg-indigo-600/20 blur-[120px] pointer-events-none" />
        <Reveal>
          <div className="border-beam rounded-3xl">
            <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900/95 to-[#0b0b14]/95 backdrop-blur-xl border border-white/[0.06] p-8 sm:p-12 text-center overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

              <span className="px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                Tarif unique & transparent
              </span>

              <h3 className="text-5xl sm:text-7xl font-black text-white mt-6 tracking-[-0.04em]">
                29 €<span className="text-lg sm:text-xl text-neutral-500 font-medium tracking-normal"> / mois</span>
              </h3>
              <p className="text-emerald-400 font-semibold text-sm mt-2">
                7 jours d&apos;essai gratuit sans engagement
              </p>

              <ul className="max-w-md mx-auto my-9 space-y-3.5 text-left">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-neutral-200">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/inscription"
                className="btn-shine group inline-flex w-full sm:w-auto items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold text-base shadow-[0_10px_40px_-10px_rgb(99_102_241/0.8)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Lancer mes 7 jours d&apos;essai gratuit</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA FINAL */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.03em] leading-[1.08]">
            Ton prochain client n&apos;a pas encore de site.
            <br />
            <span className="text-gradient">Il t&apos;attend au coin de la rue.</span>
          </h2>
          <Link
            href="/inscription"
            className="group inline-flex items-center gap-2 mt-8 text-base font-semibold text-white border-b border-white/20 hover:border-white pb-1 transition-colors"
          >
            Commencer maintenant
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Vybe. Tous droits réservés.</p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-neutral-400">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgv" className="hover:text-white transition-colors">
              CGV
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Données hébergées en Europe • Conforme RGPD</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
