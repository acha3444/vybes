import {
  Playfair_Display,
  Plus_Jakarta_Sans,
  Outfit,
  Cormorant_Garamond,
} from "next/font/google"

export const restaurantHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-restaurant-heading",
  display: "swap",
})

export const restaurantBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-restaurant-body",
  display: "swap",
})

export const barberHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-barber-heading",
  display: "swap",
  weight: ["600", "700", "800", "900"],
})

export const barberBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-barber-body",
  display: "swap",
})

export const beautyHeading = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-beauty-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const beautyBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-beauty-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})
