export interface ProspectingMessageInput {
  businessName: string
  category: "restaurant" | "barber" | "beauty"
  city: string
  phone?: string | null
  rating?: number | null
  reviewsCount?: number
  demoUrl: string
  freelanceName: string
}

export interface GeneratedMessages {
  instagram: string
  sms: string
  email: {
    subject: string
    body: string
  }
}

export function generateProspectingMessages(
  input: ProspectingMessageInput
): GeneratedMessages {
  const {
    businessName,
    category,
    city,
    rating = 4.8,
    reviewsCount = 45,
    demoUrl,
    freelanceName,
  } = input

  const categoryNoun =
    category === "restaurant"
      ? "votre restaurant"
      : category === "barber"
      ? "votre salon de coiffure"
      : "votre institut"

  const offerType =
    category === "restaurant"
      ? "votre carte, vos horaires et votre bouton d'appel pour réserver"
      : category === "barber"
      ? "vos prestations, vos tarifs et un bouton de prise de rendez-vous"
      : "vos soins, vos tarifs et la réservation directe"

  // 1. VERSION DM INSTAGRAM (Court, percutant, friendly, sans spam)
  const instagram = `Salut l'équipe de ${businessName} 👋

Je suis tombé sur votre compte et vos super retours à ${city} (${rating}★, bravo pour le travail !).

J'ai remarqué que vous n'aviez pas encore de site web mobile dédié pour afficher ${offerType}.

Pour vous montrer ce que ça donnerait, je vous ai préparé un aperçu complet et gratuit sur smartphone :
👉 ${demoUrl}

Jetez un œil quand vous avez 2 minutes, c'est sans aucun engagement. Dites-moi ce que vous en pensez !

Belle journée,
${freelanceName}`

  // 2. VERSION SMS / WHATSAPP (Direct, mobile-first, lien immédiat)
  const sms = `Bonjour ${businessName}, c'est ${freelanceName}. J'adore votre établissement à ${city} (${rating}★ sur Google !). J'ai pris l'initiative de créer un modèle de site web moderne adapté aux smartphones pour présenter ${offerType} : ${demoUrl} . Vous pouvez regarder quand vous voulez, c'est offert. Bonne journée !`

  // 3. VERSION EMAIL (Objet accrocheur avec fort taux d'ouverture + structure claire)
  const emailSubject = `Aperçu de site web pour ${businessName} (démo prête sur mobile)`

  const emailBody = `Bonjour l'équipe de ${businessName},

Je m'appelle ${freelanceName}, je crée des sites web épurés pour les commerces locaux à ${city}.

En consultant vos avis Google (${rating}★ sur ${reviewsCount} avis), j'ai remarqué que ${categoryNoun} ne disposait pas encore d'un site internet optimisé pour smartphone.

Aujourd'hui, plus de 80% des clients cherchent ${categoryNoun} sur leur téléphone avant de réserver ou de se déplacer.

Pour vous faire gagner du temps, j'ai conçu un aperçu sur-mesure de ce à quoi pourrait ressembler votre site officiel (avec ${offerType}) :

👉 Voir la démonstration : ${demoUrl}

Si le rendu vous plaît, je serais ravi d'échanger 5 minutes avec vous pour vous l'installer définitivement. Dans le cas contraire, aucun souci !

Bien cordialement,

${freelanceName}
Créateur de sites pour commerces locaux`

  return {
    instagram,
    sms,
    email: {
      subject: emailSubject,
      body: emailBody,
    },
  }
}
