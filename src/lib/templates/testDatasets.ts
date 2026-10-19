import { DemoContent } from "@/types/database"

export interface TestDemoCase {
  id: string
  name: string
  category: "restaurant" | "barber" | "beauty"
  variant: "complet" | "minimal"
  description: string
  content: DemoContent
}

export const TEST_DEMO_CASES: TestDemoCase[] = [
  // 1. RESTAURANT COMPLET
  {
    id: "restaurant-complet",
    name: "Restaurant (Complet)",
    category: "restaurant",
    variant: "complet",
    description: "Nom très long, 16 plats en 4 catégories, 6 photos, horaires complets et avis",
    content: {
      business_name: "Le Petit Bistrot de la Place du Marché - Cuisine Bourgeoise & Vins Nature",
      tagline: "Arrivages quotidiens de nos producteurs locaux, viandes françaises maturées et cave d'auteurs.",
      about: "Installé au cœur historique, notre bistrot perpétue l'amour du bon produit et de la cuisine de mémoire. Chaque matin, le chef sélectionne les pièces chez les maraîchers et éleveurs de la région. Les sauces sont réduites pendant 12 heures, le pain est pétri artisanalement et les vins sont choisis directement auprès de vignerons indépendants respectueux du vivant.",
      primary_color: "#c2410c",
      phone: "04 78 28 45 90",
      rating: 4.9,
      reviews_count: 240,
      address: "18 Place du Grand Marché, 69002 Lyon",
      opening_hours: [
        "Mardi - Samedi : 12h00 - 14h30 • 19h00 - 22h30",
        "Dimanche & Lundi : Fermé",
      ],
      hero_image_url:
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
      gallery_images: [
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      ],
      services_or_menu: [
        {
          name: "Terrine maison au poivre vert & pickles",
          price: "11 €",
          desc: "Pain de campagne toasté, beurre demi-sel de baratte",
          category: "Entrées",
          badge: "Maison",
        },
        {
          name: "Velouté de potimarron rôti & noisettes",
          price: "9 €",
          desc: "Émulsion de châtaigne et huile de courge toastée",
          category: "Entrées",
        },
        {
          name: "Œuf parfait bio & mousseline de céleri",
          price: "12 €",
          desc: "Crumble de sarrasin et jus corsé aux échalotes",
          category: "Entrées",
          badge: "Signature",
        },
        {
          name: "Burrata crémeuse des Pouilles & figues",
          price: "13 €",
          desc: "Huile d'olive première pression et réduction balsamique",
          category: "Entrées",
        },
        {
          name: "Entrecôte persillée d'Aubrac grillée (320g)",
          price: "29 €",
          desc: "Frites fraîches au couteau, jus réduit au thym sauvage",
          category: "Plats",
          badge: "Spécialité",
        },
        {
          name: "Filet de bar sauvage rôti sur peau",
          price: "26 €",
          desc: "Risotto crémeux safrané et légumes glacés de saison",
          category: "Plats",
        },
        {
          name: "Souris d'agneau confite 7 heures",
          price: "27 €",
          desc: "Purée fondante au beurre noisette et ail confit",
          category: "Plats",
          badge: "Coup de cœur",
        },
        {
          name: "Gnocchis artisanaux à la truffe d'été",
          price: "22 €",
          desc: "Crème de parmesan 24 mois et champignons des bois",
          category: "Plats",
        },
        {
          name: "Paris-Brest traditionnel praliné noisette",
          price: "9 €",
          desc: "Choux croustillant et éclats de noisettes du Piémont",
          category: "Desserts",
          badge: "Artisan",
        },
        {
          name: "Tartelette sablée citron bergamote meringuée",
          price: "8 €",
          desc: "Meringue italienne légèrement dorée au chalumeau",
          category: "Desserts",
        },
        {
          name: "Fondant chaud au chocolat Guanaja 70%",
          price: "9 €",
          desc: "Cœur coulant, glace vanille gousse de Madagascar",
          category: "Desserts",
        },
        {
          name: "Sélection de fromages affinés de notre région",
          price: "11 €",
          desc: "Confiture de cerises noires et pain aux noix",
          category: "Desserts",
        },
        {
          name: "Côtes du Rhône bio - Domaine de Beaurenard",
          price: "7 €",
          desc: "Verre 12cl • Rouge charpenté et fruité",
          category: "Boissons",
        },
        {
          name: "Chablis Premier Cru - Domaine Laroche",
          price: "9 €",
          desc: "Verre 12cl • Blanc minéral et tendu",
          category: "Boissons",
        },
        {
          name: "Limonade artisanale bio au citron de Menton",
          price: "5 €",
          desc: "Bouteille 33cl • Faible en sucre, pétillante",
          category: "Boissons",
        },
        {
          name: "Expresso torréfaction artisanale pure origine",
          price: "2.80 €",
          desc: "Café de terroir sélectionné par notre maître torréfacteur",
          category: "Boissons",
        },
      ],
      instagram_handle: "@bistrot.marche.lyon",
    },
  },

  // 2. RESTAURANT MINIMAL
  {
    id: "restaurant-minimal",
    name: "Restaurant (Minimal)",
    category: "restaurant",
    variant: "minimal",
    description: "Zéro photo, zéro menu, zéro horaire : juste nom + ville + téléphone",
    content: {
      business_name: "Chez Marco",
      tagline: "Cuisine familiale italienne et pizzas au feu de bois",
      about: "",
      primary_color: "#b91c1c",
      phone: "04 91 55 42 10",
      address: "12 Quai du Port, 13002 Marseille",
      opening_hours: [],
      hero_image_url: "",
      gallery_images: [],
      services_or_menu: [],
    },
  },

  // 3. BARBER COMPLET
  {
    id: "barber-complet",
    name: "Barber (Complet)",
    category: "barber",
    variant: "complet",
    description: "Nom long, 12 prestations avec durées précises, 6 photos et horaires",
    content: {
      business_name: "The Gentleman's Heritage Barbershop & Grooming Club",
      tagline: "L'art du rasage traditionnel au coupe-choux, dégradés millimétrés et soins masculins d'exception.",
      about: "Depuis 2018, notre salon accueille les hommes soucieux de leur apparence dans un cadre inspiré des clubs londoniens des années 30. Cuir patiné, musique soignée, café de spécialité offert et maîtres barbiers formés aux techniques de coupe les plus exigeantes.",
      primary_color: "#eab308",
      phone: "01 42 68 09 15",
      rating: 4.9,
      reviews_count: 310,
      address: "24 Rue Montorgueil, 75002 Paris",
      opening_hours: [
        "Mardi - Vendredi : 09h30 - 19h30",
        "Samedi : 09h00 - 19h00",
        "Dimanche & Lundi : Fermé",
      ],
      hero_image_url:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
      gallery_images: [
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
      ],
      services_or_menu: [
        {
          name: "Coupe Signature & Coiffage",
          price: "32 €",
          desc: "Shampoing massant, coupe aux ciseaux et tondeuse, finition au rasoir et coiffage",
          duration: "35 min",
          category: "Cheveux",
          badge: "Classique",
        },
        {
          name: "Dégradé à blanc (Skin Fade / Taper)",
          price: "35 €",
          desc: "Transition au shaver, contours taillés et mise en forme texturée",
          duration: "40 min",
          category: "Cheveux",
          badge: "Tendance",
        },
        {
          name: "Taille de barbe traditionnelle",
          price: "24 €",
          desc: "Taille sculptée aux ciseaux, contours au coupe-choux, serviette chaude et huile",
          duration: "30 min",
          category: "Barbe",
          badge: "Incontournable",
        },
        {
          name: "Rasage complet à l'ancienne",
          price: "32 €",
          desc: "Blaireau blaireau pur crin, crème moussante chaude, coupe-choux et soin fraîcheur",
          duration: "45 min",
          category: "Barbe",
        },
        {
          name: "Formule Complète : Coupe + Barbe Prestige",
          price: "52 €",
          desc: "Le combo total : coupe sur-mesure, rituel barbe complet et soin serviette chaude",
          duration: "1h10",
          category: "Formules",
          badge: "Best Seller",
        },
        {
          name: "Soin visage Détox & Masque Noir",
          price: "22 €",
          desc: "Gommage vapeur, extraction des impuretés et hydratation intense matifiante",
          duration: "25 min",
          category: "Soins",
        },
      ],
      instagram_handle: "@gentlemans.heritage.barber",
    },
  },

  // 4. BARBER MINIMAL
  {
    id: "barber-minimal",
    name: "Barber (Minimal)",
    category: "barber",
    variant: "minimal",
    description: "Zéro photo, zéro prestation, juste coordonnées",
    content: {
      business_name: "L'Atelier Barbier",
      tagline: "Coupe homme et entretien de la barbe",
      about: "",
      primary_color: "#d97706",
      phone: "03 88 32 14 00",
      address: "8 Rue des Serruriers, 67000 Strasbourg",
      opening_hours: [],
      hero_image_url: "",
      gallery_images: [],
      services_or_menu: [],
    },
  },

  // 5. BEAUTY COMPLET
  {
    id: "beauty-complet",
    name: "Institut de Beauté (Complet)",
    category: "beauty",
    variant: "complet",
    description: "Nom long et poétique, soins par catégories, durées et tons clairs aérés",
    content: {
      business_name: "Maison de Beauté & Spa Holistique Élixir Céleste",
      tagline: "Protocoles d'exception, soins anti-âge haute performance et massages bien-être sur-mesure.",
      about: "Poussez la porte d'un écrin intimiste niché au cœur de la ville. Nos esthéticiennes facialistes vous accueillent dans une atmosphère feutrée propice au lâcher-prise. Nous travaillons avec des marques d'actifs botaniques rigoureusement sélectionnés et des technologies non invasives respectueuses de l'équilibre cutané.",
      primary_color: "#be185d",
      phone: "05 61 23 87 60",
      rating: 4.8,
      reviews_count: 195,
      address: "32 Rue des Tourneurs, 31000 Toulouse",
      opening_hours: [
        "Lundi - Vendredi : 10h00 - 19h00",
        "Samedi : 09h30 - 18h30",
        "Dimanche : Fermé",
      ],
      hero_image_url:
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80",
      gallery_images: [
        "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512290900672-1f0616b3f7ef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
      ],
      services_or_menu: [
        {
          name: "Soin Visage Kobido Anti-Âge Japonais",
          price: "85 €",
          desc: "Massage ancestral liftant, digitopression et lissage des ridules pour un éclat instantané",
          duration: "1h00",
          category: "Visage",
          badge: "Signature",
        },
        {
          name: "Nettoyage de Peau Profond & Oxygénation",
          price: "72 €",
          desc: "Gommage enzymatique, vapeur d'ozone, extraction et masque hydratant à l'acide hyaluronique",
          duration: "50 min",
          category: "Visage",
        },
        {
          name: "Massage Décontractant aux Pierres Chaudes",
          price: "90 €",
          desc: "Diffusion lente de chaleur basaltique, dénoue les tensions musculaires du dos et de la nuque",
          duration: "1h15",
          category: "Corps",
          badge: "Détente",
        },
        {
          name: "Gommage Corps Sucre & Fleur de Cerisier",
          price: "55 €",
          desc: "Exfoliation soyeuse suivie d'une onction d'huile tiède satinante",
          duration: "40 min",
          category: "Corps",
        },
        {
          name: "Beauté des Mains Spa & Vernis Semi-Permanent",
          price: "48 €",
          desc: "Limage précis, soin des cuticules, gommage, modelage et pose de couleur longue tenue",
          duration: "50 min",
          category: "Ongles",
        },
        {
          name: "Rehaussement de Cils & Teinture Noire Intense",
          price: "60 €",
          desc: "Courbure naturelle spectaculaire qui ouvre le regard pendant 6 à 8 semaines",
          duration: "45 min",
          category: "Regard",
          badge: "Coup de cœur",
        },
      ],
      instagram_handle: "@elixir.celeste.spa",
    },
  },

  // 6. BEAUTY MINIMAL
  {
    id: "beauty-minimal",
    name: "Institut de Beauté (Minimal)",
    category: "beauty",
    variant: "minimal",
    description: "Zéro photo, zéro soin, nom simple, coordonnées uniquement",
    content: {
      business_name: "Institut Douceur & Sens",
      tagline: "Soins esthétiques et épilations",
      about: "",
      primary_color: "#9d174d",
      phone: "02 40 47 18 20",
      address: "15 Rue Crébillon, 44000 Nantes",
      opening_hours: [],
      hero_image_url: "",
      gallery_images: [],
      services_or_menu: [],
    },
  },
]
