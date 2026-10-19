import { DemoContent, BusinessCategory } from "@/types/database"

export const TEMPLATE_DEFAULT_THEMES = {
  restaurant: {
    primaryColor: "#ea580c", // Ambre / Orange chaud
    heroImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    ],
  },
  barber: {
    primaryColor: "#d97706", // Or ambré / Cuivre sur fond sombre
    heroImage:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    ],
  },
  beauty: {
    primaryColor: "#db2777", // Rose framboise raffiné
    heroImage:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    ],
  },
}

export function generateDefaultDemoContent(
  category: BusinessCategory,
  businessName: string,
  city = "votre ville",
  address = "",
  phone = "01 23 45 67 89"
): DemoContent {
  const theme = TEMPLATE_DEFAULT_THEMES[category]

  if (category === "restaurant") {
    return {
      business_name: businessName,
      tagline: `Cuisine passionnée & produits frais au cœur de ${city}`,
      about: `Bienvenue chez ${businessName}. Nous vous accueillons dans un cadre chaleureux et convivial pour partager une cuisine généreuse, élaborée chaque jour avec des ingrédients locaux et de saison. Venez savourer un moment d'exception en famille ou entre amis.`,
      primary_color: theme.primaryColor,
      phone: phone || "01 23 45 67 89",
      address: address || `12 Rue Principale, ${city}`,
      opening_hours: [
        "Lundi - Vendredi : 12h00 - 14h30, 19h00 - 22h30",
        "Samedi : 19h00 - 23h00",
        "Dimanche : Fermé",
      ],
      hero_image_url: theme.heroImage,
      gallery_images: theme.gallery,
      services_or_menu: [
        {
          name: "Entrecôte Charolaise Grillée (300g)",
          price: "24.50 €",
          desc: "Cuite à la flamme, sauce béarnaise maison et frites fraîches dorées",
        },
        {
          name: "Burger Signature du Chef",
          price: "18.00 €",
          desc: "Steak haché façon bouchère, cheddar affiné 18 mois, oignons caramélisés et pain artisanal",
        },
        {
          name: "Filet de Bar Rôti",
          price: "22.00 €",
          desc: "Émulsion au citron confit, mousseline de panais et légumes de saison",
        },
        {
          name: "Mi-cuit au Chocolat Valrhona",
          price: "8.50 €",
          desc: "Cœur coulant intense, boule de glace vanille Bourbon de Madagascar",
        },
      ],
      instagram_handle: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    }
  }

  if (category === "barber") {
    return {
      business_name: businessName,
      tagline: `L'art du rasage traditionnel et de la coupe sur-mesure à ${city}`,
      about: `Installé à ${city}, ${businessName} réinvente l'expérience barbier. Nos barbiers passionnés maîtrisent à la fois les techniques de coupe modernes (dégradés à blanc, taper) et les rituels de rasage traditionnels à la serviette chaude. Installez-vous dans un fauteuil confortable et profitez d'un moment de détente absolu.`,
      primary_color: theme.primaryColor,
      phone: phone || "01 23 45 67 89",
      address: address || `18 Avenue Centrale, ${city}`,
      opening_hours: [
        "Mardi - Vendredi : 09h30 - 19h30",
        "Samedi : 09h00 - 19h00",
        "Dimanche & Lundi : Fermé",
      ],
      hero_image_url: theme.heroImage,
      gallery_images: theme.gallery,
      services_or_menu: [
        {
          name: "Coupe Homme & Coiffage",
          price: "25 €",
          desc: "Diagnostic personnalisé, dégradé de précision (taper / fade), shampoing et coiffage",
        },
        {
          name: "Taille de Barbe Traditionnelle",
          price: "20 €",
          desc: "Tracé des contours au coupe-choux, serviette chaude parfumée et huile nourrissante",
        },
        {
          name: "Formule Complète Coupe + Barbe",
          price: "40 €",
          desc: "Le rituel signature complet : coupe sur-mesure, taille et soin complet de la barbe",
        },
        {
          name: "Soin Visage Purifiant & Gommage",
          price: "18 €",
          desc: "Masque purifiant noir, vapeur chaude et hydratation profonde",
        },
      ],
      instagram_handle: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}_barber`,
    }
  }

  // category === "beauty"
  return {
    business_name: businessName,
    tagline: `Votre parenthèse bien-être, soins et beauté à ${city}`,
    about: `Bienvenue chez ${businessName}, votre havre de paix dédié à la beauté et à la relaxation à ${city}. Notre équipe d'esthéticiennes expertes vous propose des soins du visage sur-mesure, des rituels corps relaxants et une onglerie d'exception. Laissez vos soucis à la porte et prenez soin de vous.`,
    primary_color: theme.primaryColor,
    phone: phone || "01 23 45 67 89",
    address: address || `24 Rue de la Paix, ${city}`,
    opening_hours: [
      "Mardi - Vendredi : 10h00 - 19h00",
      "Samedi : 09h30 - 18h00",
      "Dimanche & Lundi : Fermé",
    ],
    hero_image_url: theme.heroImage,
    gallery_images: theme.gallery,
    services_or_menu: [
      {
        name: "Soin Visage Éclat & Anti-Âge (60 min)",
        price: "65 €",
        desc: "Nettoyage profond, gommage doux aux acides de fruits, modelage relaxant et masque hydratant",
      },
      {
        name: "Pose Complète Ongles en Gel / Semi-Permanent",
        price: "45 €",
        desc: "Manucure combinée russe, mise en forme et pose avec vernis haute brillance longue durée",
      },
      {
        name: "Massage Relaxant aux Huiles Précieuses (50 min)",
        price: "70 €",
        desc: "Dénoue les tensions musculaires, stimule la circulation et procure une détente profonde",
      },
      {
        name: "Beauté du Regard (Rehaussement & Teinture)",
        price: "50 €",
        desc: "Rehaussement de cils à la kératine et teinture naturelle pour un regard ouvert et intense",
      },
    ],
    instagram_handle: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}_institut`,
  }
}
