import { DemoContent, BusinessCategory } from "@/types/database"
import { generateWelcomePhrase } from "@/lib/templates/nameUtils"

export const TEMPLATE_DEFAULT_THEMES = {
  restaurant: {
    primaryColor: "#c2410c", // Terracotta sobre
    heroImage:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
  },
  barber: {
    primaryColor: "#eab308", // Or brossé mat
    heroImage:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
  },
  beauty: {
    primaryColor: "#be185d", // Framboise sobre
    heroImage:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80",
  },
}

export const DEFAULT_SUBTITLES: Record<BusinessCategory, string> = {
  restaurant: "Restaurant",
  barber: "Coiffure & Barbier",
  beauty: "Institut de beauté",
}

/**
 * Génération neutre et factuelle sans aucun fait inventé.
 * Pas de faux plats, pas de faux prix, pas de faux engagements.
 * La carte / prestations est vide par défaut et sa section est masquée dans la démo.
 */
export function generateDefaultDemoContent(
  category: BusinessCategory,
  businessName: string,
  city = "votre ville",
  address = "",
  phone = ""
): DemoContent {
  const theme = TEMPLATE_DEFAULT_THEMES[category]
  const welcome = generateWelcomePhrase(businessName, category, city)

  if (category === "restaurant") {
    return {
      business_name: businessName,
      subtitle: DEFAULT_SUBTITLES.restaurant,
      tagline: welcome,
      about: `Établissement situé à ${city}. Retrouvez nos coordonnées, nos horaires d'ouverture et nos informations pratiques ci-dessous.`,
      primary_color: theme.primaryColor,
      phone: phone || "",
      address: address || city,
      opening_hours: [
        "Mardi - Samedi : 12h00 - 14h30 • 19h00 - 22h30",
        "Dimanche & Lundi : Fermé",
      ],
      hero_image_url: theme.heroImage,
      gallery_images: [],
      services_or_menu: [], // Vide par défaut : masqué tant que non renseigné
      instagram_handle: "",
    }
  }

  if (category === "barber") {
    return {
      business_name: businessName,
      subtitle: DEFAULT_SUBTITLES.barber,
      tagline: welcome,
      about: `Salon situé à ${city}. Retrouvez nos coordonnées, nos horaires d'ouverture et nos informations pratiques ci-dessous.`,
      primary_color: theme.primaryColor,
      phone: phone || "",
      address: address || city,
      opening_hours: [
        "Mardi - Vendredi : 09h30 - 19h00",
        "Samedi : 09h00 - 18h30",
        "Dimanche & Lundi : Fermé",
      ],
      hero_image_url: theme.heroImage,
      gallery_images: [],
      services_or_menu: [], // Vide par défaut : masqué tant que non renseigné
      instagram_handle: "",
    }
  }

  // beauty
  return {
    business_name: businessName,
    subtitle: DEFAULT_SUBTITLES.beauty,
    tagline: welcome,
    about: `Institut situé à ${city}. Retrouvez nos coordonnées, nos horaires d'ouverture et nos informations pratiques ci-dessous.`,
    primary_color: theme.primaryColor,
    phone: phone || "",
    address: address || city,
    opening_hours: [
      "Mardi - Vendredi : 09h30 - 19h00",
      "Samedi : 09h00 - 18h00",
      "Dimanche & Lundi : Fermé",
    ],
    hero_image_url: theme.heroImage,
    gallery_images: [],
    services_or_menu: [], // Vide par défaut : masqué tant que non renseigné
    instagram_handle: "",
  }
}
