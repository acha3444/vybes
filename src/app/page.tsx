import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Search,
  Smartphone,
  MessageSquare,
  Check,
  ExternalLink,
  ChevronDown,
} from "lucide-react"
import { HeroVisual } from "@/components/landing/HeroVisual"
import { RoiCalculator } from "@/components/landing/RoiCalculator"
import { VybeLogo } from "@/components/ui/VybeLogo"

const STEPS = [
  {
    number: "01",
    title: "Trouve les commerces sans site",
    text: "Entre une ville et une catégorie. L'outil filtre les établissements locaux établis qui ne possèdent aucun site web officiel.",
    caption: "Données issues de Google Maps",
  },
  {
    number: "02",
    title: "Génère la démo mobile",
    text: "En un clic, un aperçu adapté aux smartphones est créé avec son nom, son adresse, ses horaires et ses coordonnées réelles.",
    caption: "Templates restaurant, barber et institut",
  },
  {
    number: "03",
    title: "Envoie le message et suis l'ouverture",
    text: "Copie un message sobre prêt à être envoyé par SMS ou DM Instagram, avec un lien de démo unique pour savoir quand le commerçant consulte le site.",
    caption: "Lien de suivi unique",
  },
]

const FEATURES = [
  "Recherches incluses (usage équitable)",
  "Génération de démos pour restaurants, barbers et instituts",
  "Liens de démo avec suivi des consultations",
  "Messages de prospection prêts à l'envoi (SMS, DM, email)",
  "Tableau de bord de suivi des prospects",
]

const FAQ_ITEMS = [
  {
    q: "D'où viennent les données ?",
    a: "Les données proviennent de Google Maps et des informations publiques des établissements (adresses, horaires, téléphones, avis).",
  },
  {
    q: "Faut-il savoir coder ?",
    a: "Non, aucun code n'est requis. Les démos sont générées automatiquement à partir des templates optimisés pour mobile, et personnalisables via un éditeur simple.",
  },
  {
    q: "Que se passe-t-il quand le commerçant accepte ?",
    a: "Tu as plusieurs options : tu peux lui facturer l'installation du site, lui rattacher son propre nom de domaine ou exporter son contenu pour le publier sur la solution de ton choix.",
  },
  {
    q: "Puis-je annuler ?",
    a: "Oui, à tout moment en un clic depuis les paramètres de ton compte. Tu conserves l'accès jusqu'à la fin de ta période de facturation, sans frais cachés.",
  },
  {
    q: "Les démos sont-elles publiques ?",
    a: "Les démos sont accessibles uniquement via leur lien unique partagé au commerçant. Elles ne sont pas indexées par les moteurs de recherche.",
  },
  {
    q: "Combien de recherches par jour ?",
    a: "Pour garantir un service fluide et équitable, chaque compte dispose d'un quota de 30 recherches par jour, largement suffisant pour une prospection quotidienne.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F0F11] text-[#EDEDEF] selection:bg-[#6C5CE7] selection:text-white">
      {/* HEADER : FOND OPAQUE #0F0F11 + BORDURE BASSE #2A2A2F */}
      <header className="sticky top-0 z-50 bg-[#0F0F11] border-b border-[#2A2A2F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <VybeLogo size="md" variant="standalone" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="text-xs font-medium text-[#A0A0A8] hover:text-[#EDEDEF] transition-colors px-2 py-1"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="h-8 px-3.5 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-xs flex items-center justify-center transition-colors"
            >
              Essayer 7 jours
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Colonne gauche : titre sobre, texte et actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEDEF] leading-[1.12]">
              Trouve un commerce sans site. Génère sa démo en 60 secondes.
            </h1>

            <p className="text-sm sm:text-base text-[#A0A0A8] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Identifie les commerces de ta ville sans présence web mobile, prépare leur site de démonstration en situation réelle et contacte-les avec un aperçu concret.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/inscription"
                className="w-full sm:w-auto h-11 px-6 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Essayer 7 jours gratuitement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/connexion"
                className="text-xs text-[#A0A0A8] hover:text-[#EDEDEF] underline underline-offset-4 px-3 py-2 transition-colors"
              >
                J&apos;ai déjà un compte
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-[#6E6E76]">
              <span>7 jours d&apos;essai</span>
              <span>•</span>
              <span>29 € / mois sans engagement</span>
              <span>•</span>
              <span>Annulation en un clic</span>
            </div>
          </div>

          {/* Colonne droite : aperçu réel */}
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* LIEN VERS DÉMO EXEMPLE */}
      <section className="border-y border-[#2A2A2F] bg-[#17171A] py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="text-sm font-medium text-[#EDEDEF]">
              Envie de voir à quoi ressemble un site de démonstration en situation réelle ?
            </p>
            <p className="text-xs text-[#A0A0A8] mt-0.5">
              Consulte le template restaurant avec un établissement fictif.
            </p>
          </div>
          <Link
            href="/d/exemple"
            target="_blank"
            className="h-9 px-4 rounded-[8px] bg-[#1E1E22] hover:bg-[#2A2A2F] text-[#EDEDEF] border border-[#2A2A2F] text-xs font-medium inline-flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Voir une démo exemple</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#6E6E76]" />
          </Link>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE : 3 ÉTAPES CLAIRES */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-10">
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#6C5CE7]">
            Méthode de prospection
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEDEF]">
            Comment ça marche
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A8] max-w-xl">
            Trois étapes directes pour contacter des commerçants avec une proposition tangible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="p-5 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#6C5CE7] tabular-nums block">
                  {step.number}
                </span>
                <h3 className="text-base font-semibold text-[#EDEDEF]">
                  {step.title}
                </h3>
                <p className="text-xs text-[#A0A0A8] leading-relaxed">
                  {step.text}
                </p>
              </div>
              <div className="pt-3 border-t border-[#2A2A2F] text-[11px] text-[#6E6E76]">
                {step.caption}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION : QUI A FAIT VYBE */}
      <section className="border-t border-[#2A2A2F] bg-[#17171A]/50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[12px] overflow-hidden shrink-0 border border-[#2A2A2F]">
            <Image
              src="/founder.jpg"
              alt="Achraf, créateur de Vybe"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 96px, 112px"
            />
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div>
              <h3 className="text-base font-bold text-[#EDEDEF]">
                Qui a fait Vybe
              </h3>
              <p className="text-xs text-[#A0A0A8]">
                Achraf • Développeur et freelance
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#A0A0A8] leading-relaxed">
              Je vends des sites à des restaurants et commerces de quartier depuis plusieurs années. J&apos;ai construit l&apos;outil que j&apos;utilise moi-même au quotidien : trouver les commerces sans site web, leur préparer un aperçu mobile propre et leur envoyer un message direct. Pas de promesse magique, juste un outil de travail conçu pour les freelances qui veulent signer des clients locaux.
            </p>

            <div className="pt-1">
              <a
                href="https://tiktok.com/@MON_COMPTE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#6C5CE7] hover:underline font-medium"
              >
                <span>Suivre mes retours d&apos;expérience sur TikTok (@MON_COMPTE)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SIMULATEUR DE RENTABILITÉ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#6C5CE7]">
            Calcul simple
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEDEF]">
            Rentabiliser ton abonnement
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A8] max-w-xl">
            Tu fixes librement tes tarifs auprès des commerçants. Ajuste le curseur pour mesurer l&apos;impact d&apos;une seule vente.
          </p>
        </div>

        <div className="max-w-xl">
          <RoiCalculator />
        </div>
      </section>

      {/* TARIF UNIQUE (29 € / MOIS) */}
      <section id="tarif" className="border-t border-[#2A2A2F] bg-[#17171A]/40 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-md mx-auto p-6 sm:p-8 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[#A0A0A8]">
              Abonnement unique
            </span>
            <div className="text-4xl sm:text-5xl font-bold text-[#EDEDEF] tabular-nums">
              29 €<span className="text-sm text-[#A0A0A8] font-normal"> / mois</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium">
              7 jours d&apos;essai gratuit • Annulation en 1 clic
            </p>
          </div>

          <ul className="space-y-2.5 text-left text-xs text-[#A0A0A8] pt-2 border-t border-[#2A2A2F]">
            {FEATURES.map((feat) => (
              <li key={feat} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[#EDEDEF]">{feat}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/inscription"
            className="w-full h-11 rounded-[8px] bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>Démarrer 7 jours gratuits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FAQ COURTE (6 QUESTIONS EXACTES) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEDEF]">
            Questions fréquentes
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A8]">
            Réponses directes sur le fonctionnement de Vybe.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-[12px] bg-[#17171A] border border-[#2A2A2F] space-y-2"
            >
              <h3 className="text-sm font-semibold text-[#EDEDEF]">
                {item.q}
              </h3>
              <p className="text-xs text-[#A0A0A8] leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2A2A2F] py-8 px-4 sm:px-6 text-xs text-[#6E6E76]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Vybe. Outil de prospection pour freelances.</p>
          <div className="flex flex-wrap items-center gap-4 text-[#A0A0A8]">
            <Link href="/mentions-legales" className="hover:text-[#EDEDEF] transition-colors">
              Mentions légales
            </Link>
            <span>•</span>
            <Link href="/cgv" className="hover:text-[#EDEDEF] transition-colors">
              CGV
            </Link>
            <span>•</span>
            <Link href="/politique-de-confidentialite" className="hover:text-[#EDEDEF] transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
