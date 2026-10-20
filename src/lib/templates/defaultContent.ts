import { DemoContent, BusinessCategory } from "@/types/database"

export const TEMPLATE_DEFAULT_THEMES = {
  restaurant: {
    primaryColor: "#c2410c", // Terracotta chaud élégant
    heroImage:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    ],
  },
  barber: {
    primaryColor: "#eab308", // Or brossé mat
    heroImage:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    ],
  },
  beauty: {
    primaryColor: "#be185d", // Framboise doux
    heroImage:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    ],
  },
}

export const DEFAULT_SUBTITLES: Record<BusinessCategory, string> = {
  restaurant: "Restaurant & Cuisine de saison",
  barber: "Barbier & Coiffure masculine",
  beauty: "Institut de beauté & Bien-être",
}

export function generateDefaultDemoContent(
  category: BusinessCategory,
  businessName: string,
  city = "votre ville",
  address = "",
  phone = "04 91 00 00 00"
): DemoContent {
  const theme = TEMPLATE_DEFAULT_THEMES[category]

  if (category === "restaurant") {
    return {
      business_name: businessName,
      subtitle: DEFAULT_SUBTITLES.restaurant,
      tagline: `Cuisine de marché, produits frais & carte de saison`,
      about: `Des arrivages frais chaque matin, une carte courte qui évolue au fil des saisons et des cuissons au feu de bois. Une adresse de quartier pensée pour bien manger et passer un bon moment, le midi comme le soir.`,
      primary_color: theme.primaryColor,
      phone: phone || "04 91 00 00 00",
      address: address || `Centre-ville, ${city}`,
      opening_hours: [
        "Mardi - Samedi : 12h00 - 14h30 • 19h00 - 22h30",
        "Dimanche & Lundi : Fermé",
      ],
      hero_image_url: theme.heroImage,
      gallery_images: theme.gallery,
      services_or_menu: [
        {
          name: "Pièce de boucher grillée (300g)",
          price: "24 €",
          desc: "Frites fraîches maison, jus réduit au thym et salade croquante",
        },
        {
          name: "Pêche du jour rôtie",
          price: "22 €",
          desc: "Légumes de saison glacés et émulsion d'herbes fraîches",
        },
        {
          name: "Burger maison au cheddar affiné",
          price: "18 €",
          desc: "Pain brioché d'artisan, steak bouchère, pickles et oignons confits",
        },
        {
          name: "Tarte fine aux pommes caramélisées",
          price: "8 €",
          desc: "Servie tiède, crème glacée vanille artisanale",
        },
      ],
      instagram_handle: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    }
  }

  if (category === "barber") {
    return {
      business_name: businessName,
      subtitle: DEFAULT_SUBTITLES.barber,
      tagline: `Coupes de précision, barbes taillées au coupe-choux & soins`,
      about: `Un espace dédié au style masculin. Dégradés millimétrés (taper, fade), taille de barbe à l'ancienne avec rituel serviette chaude, et conseils personnalisés pour l'entretien au quotidien.`,
      primary_color: theme.primaryColor,
      phone: phone || "04 91 00 00 00",
      address: address || `Centre-ville, ${city}`,
      opening_hours: [
        "Mardi - Vendredi : 09h30 - 19h30",
        "Samedi : 09h00 - 19h00",
        "Dimanche & Lundi : Fermé",
      ],
      hero_image_url: theme.heroImage,
      gallery_images: theme.gallery,
      services_or_menu: [
        {
          name: "Coupe & Coiffage",
          price: "25 €",
          desc: "Shampoing, coupe sur-mesure aux ciseaux et tondeuse, finition au rasoir",
        },
        {
          name: "Taille de Barbe & Serviette Chaude",
          price: "20 €",
          desc: "Contours nets au coupe-choux, serviette chaude et huile de soin",
        },
        {
          name: "Formule Complète (Coupe + Barbe)",
          price: "40 €",
          desc: "La formule totale : coupe de précision + rituel complet barbe",
        },
        {
          name: "Tonte Express & Contours",
          price: "16 €",
          desc: "Rafraîchissement des contours de nuque et tempes au rasoir",
        },
      ],
      instagram_handle: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    }
  }

  // beauty
  return {
    business_name: businessName,
    subtitle: DEFAULT_SUBTITLES.beauty,
    tagline: `Soins experts du visage, onglerie & rituels de détente`,
    about: `Un institut intimiste et lumineux au cœur de ${city}. Protocoles de soins du visage adaptés à chaque type de peau, onglerie soignée et rituels relaxants. Des produits professionnels et une attention portée à chaque détail.`,
    primary_color: theme.primaryColor,
    phone: phone || "04 91 00 00 00",
    address: address || `Centre-ville, ${city}`,
    opening_hours: [
      "Mardi - Vendredi : 10h00 - 19h00",
      "Samedi : 09h30 - 18h00",
      "Dimanche & Lundi : Fermé",
    ],
    hero_image_url: theme.heroImage,
    gallery_images: theme.gallery,
    services_or_menu: [
      {
        name: "Soin Visage Éclat Profond (60 min)",
        price: "65 €",
        desc: "Nettoyage, gommage doux, vapeur, extraction, modelage relaxant et masque",
      },
      {
        name: "Pose Complète Semi-Permanent",
        price: "40 €",
        desc: "Manucure combinée, mise en forme des ongles et vernis longue tenue",
      },
      {
        name: "Massage Décontractant (50 min)",
        price: "68 €",
        desc: "Pression ciblée dos, nuque et épaules aux huiles chaudes végétales",
      },
      {
        name: "Rehaussement de Cils & Teinture",
        price: "48 €",
        desc: "Courbure naturelle longue durée pour ouvrir le regard sans maquillage",
      },
    ],
    instagram_handle: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
  }
}
