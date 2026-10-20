import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { VybeLogo } from "@/components/ui/VybeLogo"

export const metadata = {
  title: "Mentions Légales | Vybe",
  description: "Mentions légales et informations réglementaires de la plateforme Vybe.",
}

function ToComplete({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/40 font-semibold mx-1">
      [À COMPLÉTER : {label}]
    </span>
  )
}

export default function MentionsLegalesPage() {
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
            Cadre Réglementaire
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
            Mentions Légales
          </h1>
          <p className="text-sm text-neutral-400 mt-3">
            Dernière mise à jour : 19 octobre 2026
          </p>
        </div>

        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">1. Éditeur du site</h2>
          <p className="text-sm leading-relaxed">
            Le site internet accessible à l&apos;adresse principale de Vybe est édité par :
          </p>
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-sm">
            <p>
              <strong className="text-white">Dénomination sociale / Nom commercial :</strong> Vybe - <ToComplete label="Nom ou Raison sociale de l'entreprise" />
            </p>
            <p>
              <strong className="text-white">Forme juridique :</strong> <ToComplete label="SAS, SASU, SARL, Entreprise Individuelle, etc." />
            </p>
            <p>
              <strong className="text-white">Capital social :</strong> <ToComplete label="Capital social en euros (si société)" />
            </p>
            <p>
              <strong className="text-white">Siège social :</strong> <ToComplete label="Adresse complète du siège social" />
            </p>
            <p>
              <strong className="text-white">Numéro d&apos;immatriculation :</strong> <ToComplete label="RCS + Ville d'immatriculation" />
            </p>
            <p>
              <strong className="text-white">Numéro SIREN / SIRET :</strong> <ToComplete label="Numéro SIREN à 9 chiffres ou SIRET à 14 chiffres" />
            </p>
            <p>
              <strong className="text-white">Numéro de TVA intracommunautaire :</strong> <ToComplete label="Numéro de TVA (ex: FRXX... ou 'Franchise en base de TVA selon article 293 B du CGI')" />
            </p>
            <p>
              <strong className="text-white">Directeur de la publication :</strong> <ToComplete label="Nom et Prénom du dirigeant / directeur de la publication" />
            </p>
            <p>
              <strong className="text-white">Contact email :</strong> <ToComplete label="Adresse email de contact (ex: contact@vybe.fr)" />
            </p>
            <p>
              <strong className="text-white">Contact téléphonique :</strong> <ToComplete label="Numéro de téléphone professionnel" />
            </p>
          </div>
        </section>

        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">2. Hébergement du site</h2>
          <p className="text-sm leading-relaxed">
            Le site est hébergé par des prestataires d&apos;infrastructure de premier rang garantissant la sécurité et la haute disponibilité :
          </p>
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-sm">
            <p>
              <strong className="text-white">Hébergeur d&apos;application :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (Serveurs déployés en Union Européenne).
            </p>
            <p>
              <strong className="text-white">Base de données & Authentification :</strong> Supabase Inc., 970 Toa Payoh North #07-04, Singapour (Région de stockage des données : Union Européenne / Francfort).
            </p>
            <p>
              <strong className="text-white">Passerelle de paiement :</strong> Stripe Payments Europe Ltd, 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irlande.
            </p>
          </div>
        </section>

        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">3. Propriété intellectuelle</h2>
          <p className="text-sm leading-relaxed">
            L&apos;ensemble des éléments composant le site Vybe (notamment logiciels, codes sources, textes, arborescences, interfaces graphiques, logos, icônes, animations, bases de données) sont protégés par le droit de la propriété intellectuelle et demeurent la propriété exclusive de l&apos;éditeur ou de ses partenaires titulaires des droits.
          </p>
          <p className="text-sm leading-relaxed">
            Toute reproduction, représentation, diffusion, extraction ou modification, totale ou partielle, sans l&apos;accord exprès préalable de l&apos;éditeur, est strictement interdite et constitutive d&apos;une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>

        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">4. Données à caractère personnel</h2>
          <p className="text-sm leading-relaxed">
            Pour obtenir toutes les informations relatives à la collecte, au traitement et à la protection de vos données personnelles, ainsi qu&apos;à l&apos;exercice de vos droits en vertu du Règlement Général sur la Protection des Données (RGPD), veuillez consulter notre{" "}
            <Link href="/politique-de-confidentialite" className="text-indigo-400 font-semibold hover:underline">
              Politique de Confidentialité
            </Link>.
          </p>
        </section>

        <section className="space-y-4 border-t border-neutral-900 pt-8">
          <h2 className="text-xl font-bold text-white">5. Droit applicable & Juridiction compétente</h2>
          <p className="text-sm leading-relaxed">
            Les présentes mentions légales sont soumises au droit français. En cas de litige relatif à la validité, l&apos;interprétation ou l&apos;exécution du service, et à défaut de résolution amiable, compétence exclusive est attribuée aux tribunaux compétents du ressort du siège social de l&apos;éditeur.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 py-8 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Vybe. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <Link href="/cgv" className="hover:text-white transition-colors">
              CGV
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
