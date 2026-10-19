import { notFound } from "next/navigation"
import PreviewTemplatesClient from "./PreviewTemplatesClient"

export const metadata = {
  title: "Laboratoire de Test des Templates | Vybe (Dev Only)",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PreviewTemplatesPage() {
  // Restriction stricte : accessible uniquement en environnement de développement
  if (process.env.NODE_ENV !== "development") {
    notFound()
  }

  return <PreviewTemplatesClient />
}
