import Link from "next/link"
import { ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Conditions Générales de Vente (CGV) | Vybe",
  description: "Conditions Générales de Vente et d'utilisation du service SaaS Vybe : abonnement 29€/mois, essai 7 jours et résiliation sans engagement.",
}

function ToComplete({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/40 font-semibold mx-1">
      [À COMPLÉTER : {label}]
    </span>
  )
}

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 selection:bg-indigo-500 selection:text-white">
      {/* HEADER */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-sm text-white">
              V
            </div>
            <span>Vybe</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>
      </header>

      {/* CONTENU */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Contrat de Service
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
            Conditions Générales de Vente & d&apos;Abonnement
          </h1>
          <p className="text-sm text-neutral-400 mt-3">
            Applicables à l&apos;offre Vybe Pro • Dernière mise à jour : 19 octobre 2026
          </p>
        </div>

        {/* RÉSUMÉ DES CONDITIONS ESSENTIELLES */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-indigo-950/30 border border-indigo-500/30 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>En résumé : Vos garanties Vybe</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-neutral-300">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="font-bold text-white block mb-1">Essai gratuit 7 jours</span>
              Accès immédiat à toutes les fonctionnalités sans prélèvement immédiat.
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="font-bold text-white block mb-1">29 € / mois</span>
              Tarif unique sans frais cachés pour l&apos;ensemble de la boîte à outils.
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="font-bold text-white block mb-1">Résiliation en 1 clic</span>
              Sans aucun engagement de durée. Arrêt immédiat depuis votre tableau de bord.
            </div>
          </div>
        </div>

        {/* ARTICLE 1 : OBJET & IDENTIFICATION */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">Article 1 — Identification du Vendeur & Objet</h2>
          <p className="text-sm leading-relaxed">
            Les présentes Conditions Générales de Vente (ci-après &quot;CGV&quot;) régissent les relations contractuelles entre :
          </p>
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1.5 text-sm">
            <p>
              <strong className="text-white">Le Vendeur :</strong> <ToComplete label="Raison sociale ou Nom Commercial" />, <ToComplete label="Forme juridique : SASU / SAS / EI" />, au capital de <ToComplete label="Capital social" /> euros, dont le siège social est situé au <ToComplete label="Adresse complète" />, immatriculée au RCS de <ToComplete label="Ville du RCS" /> sous le numéro <ToComplete label="Numéro SIREN" />, représentée par <ToComplete label="Nom du Dirigeant" /> en sa qualité de dirigeant.
            </p>
            <p>
              <strong className="text-white">Contact :</strong> <ToComplete label="Adresse email de support client (ex: support@vybe.fr)" />
            </p>
          </div>
          <p className="text-sm leading-relaxed">
            Et toute personne physique ou morale souscrivant au service SaaS en ligne proposé sur le site (ci-après &quot;le Client&quot;).
          </p>
          <p className="text-sm leading-relaxed">
            Vybe est une plateforme logicielle en ligne (SaaS) conçue pour assister les créateurs et prestataires de services dans la détection d&apos;entreprises locales sans site web, la génération automatisée de maquettes de démonstration interactives et le suivi commercial de leurs prospects.
          </p>
        </section>

        {/* ARTICLE 2 : OFFRE & TARIF */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">Article 2 — Tarifs et Modalités d&apos;Abonnement</h2>
          <p className="text-sm leading-relaxed">
            L&apos;accès à la plateforme Vybe est commercialisé sous la formule suivante :
          </p>
          <ul className="space-y-2.5 text-sm list-disc pl-5 text-neutral-300">
            <li>
              <strong className="text-white">Formule &quot;Vybe Pro&quot; :</strong> Facturée au tarif de <strong className="text-white">29 € par mois</strong> (prix Toutes Taxes Comprises ou Hors Taxes selon l&apos;assujettissement du Client, <ToComplete label="Mention TVA applicable ou franchise article 293 B du CGI" />).
            </li>
            <li>
              <strong className="text-white">Inclusions :</strong> Recherche illimitée de commerces locaux sans site officiel, génération illimitée de démos mobiles (restaurant, barber, institut de beauté), liens uniques sécurisés avec suivi des visites, scripts de prospection multicanaux et accès au support technique.
            </li>
            <li>
              L&apos;éditeur se réserve le droit de modifier le tarif de l&apos;abonnement à tout moment pour les périodes futures, sous réserve d&apos;en informer le Client au moins 30 jours à l&apos;avance par courrier électronique.
            </li>
          </ul>
        </section>

        {/* ARTICLE 3 : ESSAI GRATUIT */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">Article 3 — Période d&apos;Essai Gratuit de 7 Jours</h2>
          <p className="text-sm leading-relaxed">
            À l&apos;ouverture de son compte, chaque nouvel utilisateur bénéficie d&apos;une période d&apos;essai gratuit de sept (7) jours consécutifs, sans engagement de durée.
          </p>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>
              Durant ces 7 jours, l&apos;utilisateur a un accès complet aux outils de recherche, d&apos;édition et de partage de démos.
            </li>
            <li>
              Aucun prélèvement n&apos;est effectué avant l&apos;expiration exacte de la période d&apos;essai de 7 jours (168 heures à compter de la création du compte).
            </li>
            <li>
              Si le Client résilie son compte ou son abonnement avant la fin de ces 7 jours, aucun montant ne lui sera facturé.
            </li>
          </ul>
        </section>

        {/* ARTICLE 4 : PAIEMENT */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">Article 4 — Modalités de Paiement & Facturation</h2>
          <p className="text-sm leading-relaxed">
            Le règlement de l&apos;abonnement s&apos;effectue par prélèvement bancaire automatique récurrent via la passerelle de paiement certifiée PCI-DSS <strong className="text-white">Stripe</strong>.
          </p>
          <p className="text-sm leading-relaxed">
            Les cartes bancaires acceptées sont : Carte Bancaire, Visa, Mastercard, American Express. Les coordonnées bancaires sont chiffrées de bout en bout et ne transitent jamais sur les serveurs de Vybe.
          </p>
          <p className="text-sm leading-relaxed">
            Les factures acquittées sont téléchargeables à tout moment depuis l&apos;espace Client via le Portail de Facturation Stripe.
          </p>
        </section>

        {/* ARTICLE 5 : RÉSILIATION */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">Article 5 — Résiliation Sans Engagement</h2>
          <p className="text-sm leading-relaxed">
            L&apos;abonnement Vybe Pro est sans engagement de durée minimale.
          </p>
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-sm">
            <p>
              <strong className="text-white">Comment résilier ?</strong> Le Client peut résilier son abonnement à tout moment, en 1 seul clic, depuis son espace tableau de bord dans la section &quot;Abonnement&quot;, via le bouton &quot;Gérer ou résilier mon abonnement&quot; menant au Portail Stripe.
            </p>
            <p>
              <strong className="text-white">Effet de la résiliation :</strong> La résiliation prend effet à la fin de la période mensuelle de facturation en cours. Le Client conserve l&apos;accès à son compte et à ses démos jusqu&apos;à l&apos;échéance de la période payée.
            </p>
            <p>
              <strong className="text-white">Absence de pénalités :</strong> Aucun frais de dossier ni pénalité de résiliation n&apos;est appliqué.
            </p>
          </div>
        </section>

        {/* ARTICLE 6 : RÉTRACTATION */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">Article 6 — Droit de Rétractation</h2>
          <p className="text-sm leading-relaxed">
            Conformément aux dispositions de l&apos;article L.221-18 du Code de la consommation, le Client consommateur dispose en principe d&apos;un délai de quatorze (14) jours francs pour exercer son droit de rétractation à compter de la souscription.
          </p>
          <p className="text-sm leading-relaxed">
            Toutefois, s&apos;agissant d&apos;un service numérique dont l&apos;exécution commence dès la création du compte avec l&apos;accord exprès du Client durant la période d&apos;essai gratuite de 7 jours, le Client peut à tout moment renoncer au service sans débourser le moindre euro en résiliant avant la fin de ladite période d&apos;essai.
          </p>
        </section>

        {/* ARTICLE 7 : RESPONSABILITÉ & OBLIGATIONS */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">Article 7 — Responsabilité & Utilisation du Service</h2>
          <p className="text-sm leading-relaxed">
            Le Client est seul responsable de l&apos;utilisation qu&apos;il fait des outils de Vybe, notamment de la personnalisation des démos, du respect du droit des marques, et des messages de prospection qu&apos;il adresse à ses prospects dans le respect des règles légales applicables (respect des règles de prospection B2B, absence de spam et de harcèlement).
          </p>
          <p className="text-sm leading-relaxed">
            Vybe met en œuvre tous les moyens raisonnables pour assurer un fonctionnement continu 24h/24 du service, mais ne saurait être tenu responsable d&apos;interruptions temporaires liées à la maintenance technique, aux réseaux de télécommunication ou à des cas de force majeure.
          </p>
        </section>

        {/* ARTICLE 8 : DROIT APPLICABLE & LITIGES */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">Article 8 — Loi Applicable & Règlement des Litiges</h2>
          <p className="text-sm leading-relaxed">
            Les présentes CGV sont soumises à la loi française. En cas de contestation, les parties s&apos;engagent à rechercher prioritairement une solution amiable en contactant le support à <ToComplete label="Adresse email de support" />.
          </p>
          <p className="text-sm leading-relaxed">
            À défaut d&apos;accord amiable sous 30 jours, tout litige sera porté devant les tribunaux compétents du ressort du siège social de l&apos;éditeur.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 py-8 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Vybe. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <span>•</span>
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
