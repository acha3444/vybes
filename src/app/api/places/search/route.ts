import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { searchPlacesWithoutWebsite } from "@/lib/google-places"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // 1. Vérification de la session utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Pour le développement local, si pas encore connecté on accepte ou renvoie 401
  // On laisse passer si la requête contient un header dev ou si la session est présente
  if (!user && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city") || "Paris"
  const category = (searchParams.get("category") || "all") as
    | "restaurant"
    | "barber"
    | "beauty"
    | "all"

  if (!city || city.trim().length === 0) {
    return NextResponse.json(
      { error: "Veuillez spécifier une ville" },
      { status: 400 }
    )
  }

  try {
    const { places, source } = await searchPlacesWithoutWebsite(city, category)
    return NextResponse.json({
      success: true,
      city,
      category,
      count: places.length,
      source,
      places,
    })
  } catch (error) {
    console.error("Erreur API search places:", error)
    return NextResponse.json(
      { error: "Impossible de récupérer les commerces" },
      { status: 500 }
    )
  }
}
