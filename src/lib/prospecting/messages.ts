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
    rating,
    reviewsCount,
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
      ? "votre carte, vos horaires et votre contact direct"
      : category === "barber"
      ? "vos prestations, vos horaires et la prise de rendez-vous"
      : "vos soins, vos horaires et la prise de rendez-vous"

  const ratingMention =
    rating && rating > 0
      ? ` (${rating} sur Google${reviewsCount ? ` avec ${reviewsCount} avis` : ""})`
      : ""

  // 1. VERSION DM INSTAGRAM (Sobre, direct, sans spam)
  const instagram = `Bonjour,

J'ai découvert votre établissement à ${city}${ratingMention} et j'ai remarqué que vous n'aviez pas encore de site web mobile officiel.

Pour vous montrer ce que cela donnerait, j'ai pris l'initiative de préparer un aperçu adapté aux smartphones pour présenter ${offerType} :

${demoUrl}

Vous pouvez le consulter librement quand vous avez deux minutes, c'est sans engagement.

Bien à vous,
${freelanceName}`

  // 2. VERSION SMS / WHATSAPP (Court, direct, mobile)
  const sms = `Bonjour, c'est ${freelanceName}. J'ai préparé un aperçu de site web mobile pour ${businessName} à ${city} afin de présenter ${offerType} : ${demoUrl} . Vous pouvez y jeter un coup d'œil quand vous voulez, c'est sans engagement. Bonne journée.`

  // 3. VERSION EMAIL (Structuré et professionnel)
  const emailSubject = `Aperçu de site web mobile pour ${businessName}`

  const emailBody = `Bonjour,

Je m'appelle ${freelanceName}, je conçois des sites web sobres et adaptés aux smartphones pour les commerces locaux à ${city}.

En consultant votre fiche à ${city}${ratingMention}, j'ai constaté que ${categoryNoun} ne disposait pas encore d'un site web dédié.

Pour vous faire gagner du temps et vous montrer le rendu en situation réelle, j'ai préparé une première version de votre site :

${demoUrl}

Si le rendu vous intéresse, je serais ravi d'échanger quelques minutes avec vous pour vous l'installer. Dans le cas contraire, aucun problème.

Bien cordialement,

${freelanceName}`

  return {
    instagram,
    sms,
    email: {
      subject: emailSubject,
      body: emailBody,
    },
  }
}
