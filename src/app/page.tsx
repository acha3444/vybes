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
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* HEADER NAVIGATION */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/25">
            V
          </div>
          <div>
            <span className="font-black text-2xl tracking-tight text-white block">
              Vybe
            </span>
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase tracking-wider">
              Vente de sites locaux
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            Essai 7j gratuit
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
        {/* Pilule annonce */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Spécialement conçu pour les freelances débutants</span>
        </div>

        {/* Titre Promesse */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
          Trouve un commerce sans site.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
            Génère sa démo en 60 secondes.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-neutral-300 mt-6 leading-relaxed">
          Identifie les commerces de ta ville qui n&apos;ont aucun site web, génère leur démo mobile personnalisée en 1 clic et envoie-leur un message prêt à signer.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/inscription"
            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <span>Démarrer 7 jours gratuits</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/connexion"
            className="w-full sm:w-auto h-14 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-base flex items-center justify-center transition-colors"
          >
            Accéder à mon compte
          </Link>
        </div>

        {/* Reassurance */}
        <div className="flex items-center justify-center gap-6 text-xs text-neutral-400 font-medium mt-6">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> 7 jours d&apos;essai
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> 29€ / mois sans engagement
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Annulable en 1 clic
          </span>
        </div>
      </section>

      {/* DÉMONSTRATION DU PARCOURS EN 3 ÉTAPES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-neutral-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            La méthode la plus directe pour prospecter les commerces locaux
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2">
            Pas besoin de savoir coder, pas besoin de négocier pendant des heures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Étape 1 */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 font-bold text-lg">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Étape 1
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Trouve les commerces sans site
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Entre une ville et une catégorie (restaurant, barber, institut). Notre outil filtre directement ceux qui n&apos;ont aucun site web officiel.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400 font-medium flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Données officielles d&apos;entreprises en temps réel</span>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 font-bold text-lg">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider block mb-1">
                Étape 2
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Génère sa démo en 60 secondes
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                En 1 clic, un site de démo complet est créé avec son nom, son adresse et ses horaires. Personnalise photos et couleurs en 2 minutes si tu veux.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400 font-medium flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-violet-400" />
              <span>3 templates professionnels inclus</span>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 font-bold text-lg">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Étape 3
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Envoie le message & Suis les visites
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Copie le message DM Instagram, SMS ou Email pré-rédigé contenant le lien direct vers sa démo personnalisée.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400 font-medium flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Lien unique sécurisé avec compteur de visites</span>
            </div>
          </div>
        </div>
      </section>

      {/* OFFRE COMMERCIALE CLAIRE (29€/MOIS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-gradient-to-br from-neutral-900 to-indigo-950/40 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
          <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            Tarif unique & transparent
          </span>

          <h3 className="text-3xl sm:text-5xl font-black text-white mt-4">
            29 € <span className="text-lg text-neutral-400 font-normal">/ mois</span>
          </h3>
          <p className="text-emerald-400 font-semibold text-sm mt-1">
            7 jours d&apos;essai gratuit sans engagement
          </p>

          <div className="max-w-md mx-auto my-8 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-neutral-200">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Recherches illimitées de commerces sans site</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-200">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Génération de démos illimitées (Restaurant, Barber, Institut)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-200">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Liens de démo uniques et sécurisés avec suivi des consultations</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-200">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Générateur de messages de prospection (DM Insta, SMS, Email)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-200">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Tableau de bord de suivi des prospects</span>
            </div>
          </div>

          <Link
            href="/inscription"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.98]"
          >
            <span>Lancer mes 7 jours d&apos;essai gratuit</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
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
      </footer>
    </div>
  )
}
