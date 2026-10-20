import Link from "next/link"
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from "lucide-react"
import { VybeLogo } from "@/components/ui/VybeLogo"

export const metadata = {
  title: "Politique de Confidentialité | Vybe",
  description: "Politique de confidentialité et protection des données personnelles (RGPD) de la plateforme Vybe.",
}

function ToComplete({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/40 font-semibold mx-1">
      [À COMPLÉTER : {label}]
    </span>
  )
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 selection:bg-indigo-500 selection:text-white">
      {/* HEADER */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-95 transition-opacity">
            <VybeLogo size="sm" variant="standalone" />
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
            Protection de vos données personnelles
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-neutral-400 mt-3">
            Conforme au Règlement Général sur la Protection des Données (RGPD) • Dernière mise à jour : 19 octobre 2026
          </p>
        </div>

        {/* ENGAGEMENT CLÉ RGPD */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-emerald-950/30 border border-emerald-500/30 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Nos engagements pour la confidentialité de vos données</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Chez Vybe, nous considérons la vie privée comme un droit fondamental. Nous ne vendons jamais vos données, nous ne faisons aucun profilage publicitaire invasif, et les adresses IP des visiteurs de vos démos sont hachées cryptographiquement de manière irréversible pour protéger leur anonymat tout en prévenant les fraudes de comptage.
          </p>
        </div>

        {/* 1. RESPONSABLE DU TRAITEMENT */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">1. Responsable du Traitement des Données</h2>
          <p className="text-sm leading-relaxed">
            Le responsable du traitement des données personnelles collectées dans le cadre de l&apos;utilisation du service Vybe est :
          </p>
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1.5 text-sm">
            <p>
              <strong className="text-white">Identité :</strong> <ToComplete label="Nom ou Raison sociale de l'entreprise éditrice" />
            </p>
            <p>
              <strong className="text-white">Adresse postale :</strong> <ToComplete label="Adresse du siège social" />
            </p>
            <p>
              <strong className="text-white">Contact DPO / Données Personnelles :</strong> <ToComplete label="Adresse email dédiée (ex: dpo@vybe.fr ou contact@vybe.fr)" />
            </p>
          </div>
        </section>

        {/* 2. DONNÉES COLLECTÉES */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">2. Données Personnelles Collectées</h2>
          <p className="text-sm leading-relaxed">
            Nous limitons strictement la collecte des données aux éléments nécessaires à la fourniture et à la sécurité du service :
          </p>
          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800">
              <strong className="text-white block mb-1">Données de compte utilisateur :</strong>
              Adresse email, mot de passe chiffré (géré de manière sécurisée par Supabase Auth), nom ou prénom professionnel indiqué facultativement.
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800">
              <strong className="text-white block mb-1">Données de prospection & démos :</strong>
              Noms, adresses publiques, numéros de téléphone professionnels et informations publiques d&apos;entreprises locales importées ou éditées par le Client pour créer ses démos.
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800">
              <strong className="text-white block mb-1">Données techniques de consultation des démos :</strong>
              Afin de mesurer si un prospect a ouvert sa démo sans porter atteinte à sa vie privée, l&apos;adresse IP du visiteur est immédiatement hachée via un algorithme cryptographique non réversible (SHA-256 avec sel). Aucune adresse IP en clair n&apos;est enregistrée en base. L&apos;user-agent est enregistré de façon sommaire pour distinguer les ordinateurs et téléphones.
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800">
              <strong className="text-white block mb-1">Données de paiement :</strong>
              Traitées directement et exclusivement par notre partenaire bancaire Stripe (PCI-DSS niveau 1). Vybe n&apos;a jamais accès à vos numéros complets de carte bancaire.
            </div>
          </div>
        </section>

        {/* 3. FINALITÉS & BASES LÉGALES */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">3. Finalités et Bases Légales des Traitements</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-800 rounded-xl overflow-hidden">
              <thead className="bg-neutral-900 text-neutral-300 font-bold">
                <tr>
                  <th className="p-3 border-b border-neutral-800">Finalité</th>
                  <th className="p-3 border-b border-neutral-800">Données concernées</th>
                  <th className="p-3 border-b border-neutral-800">Base légale (RGPD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                <tr>
                  <td className="p-3">Création et gestion du compte utilisateur</td>
                  <td className="p-3">Email, mot de passe hashé</td>
                  <td className="p-3 font-semibold text-white">Exécution du contrat (Art. 6.1.b)</td>
                </tr>
                <tr>
                  <td className="p-3">Facturation et gestion de l&apos;abonnement 29€/mois</td>
                  <td className="p-3">ID Stripe, historique des factures</td>
                  <td className="p-3 font-semibold text-white">Obligation légale & Exécution (Art. 6.1.c)</td>
                </tr>
                <tr>
                  <td className="p-3">Génération et partage des liens de démo</td>
                  <td className="p-3">Contenus de démo, photos, coordonnées du commerce</td>
                  <td className="p-3 font-semibold text-white">Exécution du contrat (Art. 6.1.b)</td>
                </tr>
                <tr>
                  <td className="p-3">Comptage fiable des vues et prévention des abus</td>
                  <td className="p-3">Hash cryptographique d&apos;IP, user-agent</td>
                  <td className="p-3 font-semibold text-white">Intérêt légitime (Art. 6.1.f)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. DESTINATAIRES DES DONNÉES */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">4. Sous-traitants & Hébergement Européen</h2>
          <p className="text-sm leading-relaxed">
            Vos données ne font l&apos;objet d&apos;aucune commercialisation. Elles sont transmises uniquement aux prestataires techniques indispensables au service :
          </p>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>
              <strong className="text-white">Supabase Inc. :</strong> Hébergement de la base de données PostgreSQL, de l&apos;authentification et du stockage d&apos;images dans la zone Union Européenne (Francfort, Allemagne).
            </li>
            <li>
              <strong className="text-white">Stripe Payments Europe Ltd :</strong> Traitement sécurisé des abonnements et paiements, respectant les normes bancaires européennes.
            </li>
            <li>
              <strong className="text-white">Vercel Inc. :</strong> Hébergement et distribution CDN du site avec serveurs en Europe.
            </li>
          </ul>
        </section>

        {/* 5. DURÉE DE CONSERVATION */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">5. Durée de Conservation des Données</h2>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>
              <strong className="text-white">Données de compte :</strong> Conservées pendant toute la durée active de l&apos;abonnement, puis archivées ou supprimées sous 3 ans à compter de la dernière inactivité.
            </li>
            <li>
              <strong className="text-white">Factures et pièces comptables :</strong> Conservées 10 ans conformément aux obligations du Code de commerce.
            </li>
            <li>
              <strong className="text-white">Démos inactives :</strong> Les liens de démo ont une validité standard de 14 jours et peuvent être purgés après expiration.
            </li>
          </ul>
        </section>

        {/* 6. VOS DROITS */}
        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">6. Vos Droits Informatique & Libertés</h2>
          <p className="text-sm leading-relaxed">
            Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <strong className="text-white block mb-1">Droit d&apos;accès & de rectification</strong>
              Obtenir confirmation du traitement et rectifier les données inexactes.
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <strong className="text-white block mb-1">Droit à l&apos;effacement (&quot;Droit à l&apos;oubli&quot;)</strong>
              Demander la suppression complète de votre compte et de vos données.
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <strong className="text-white block mb-1">Droit à la limitation & d&apos;opposition</strong>
              Vous opposer à tout moment au traitement pour des motifs légitimes.
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <strong className="text-white block mb-1">Droit à la portabilité</strong>
              Recevoir vos données dans un format structuré et lisible par machine.
            </div>
          </div>
          <p className="text-sm leading-relaxed pt-2">
            Pour exercer l&apos;un de ces droits, adressez simplement votre demande par email à : <ToComplete label="Adresse email de contact RGPD (ex: rgpd@vybe.fr ou contact@vybe.fr)" />.
          </p>
          <p className="text-sm leading-relaxed">
            Si vous estimez après nous avoir contactés que vos droits ne sont pas respectés, vous avez le droit d&apos;introduire une réclamation auprès de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL — www.cnil.fr).
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
            <Link href="/cgv" className="hover:text-white transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
