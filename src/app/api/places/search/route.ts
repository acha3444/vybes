import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { searchPlacesWithoutWebsite } from "@/lib/google-places"

interface UserQuota {
  date: string
  count: number
}

// Suivi du quota quotidien par utilisateur (en mémoire serveur)
const userDailyQuotas = new Map<string, UserQuota>()
const DEFAULT_LIMIT = 30

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // 1. Vérification de la session utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  const includeSurroundings = searchParams.get("includeSurroundings") === "true"

  if (!city || city.trim().length === 0) {
    return NextResponse.json(
      { error: "Veuillez spécifier une ville" },
      { status: 400 }
    )
  }

  // 2. Vérification du quota quotidien (usage équitable)
  const dailyLimit = parseInt(process.env.DAILY_SEARCH_LIMIT || `${DEFAULT_LIMIT}`, 10)
  const today = new Date().toISOString().split("T")[0]
  const quotaKey = user?.id || request.headers.get("x-forwarded-for") || "local_user"

  const userQuota = userDailyQuotas.get(quotaKey) || { date: today, count: 0 }
  if (userQuota.date !== today) {
    userQuota.date = today
    userQuota.count = 0
  }

  if (userQuota.count >= dailyLimit) {
    return NextResponse.json(
      {
        error: "quota_reached",
        message: `Quota quotidien atteint (${dailyLimit} recherches/jour). Revenez demain pour de nouvelles recherches.`,
        limit: dailyLimit,
        remaining: 0,
      },
      { status: 429 }
    )
  }

  try {
    const { places, source, cityDisplay } = await searchPlacesWithoutWebsite(
      city,
      category,
      includeSurroundings
    )
    
    // Incrémente le décompte
    userQuota.count += 1
    userDailyQuotas.set(quotaKey, userQuota)
    const remaining = Math.max(0, dailyLimit - userQuota.count)

    return NextResponse.json({
      success: true,
      city,
      cityDisplay,
      category,
      includeSurroundings,
      count: places.length,
      source,
      places,
      remaining,
      limit: dailyLimit,
    })
  } catch (error) {
    console.error("Erreur API search places:", error)
    return NextResponse.json(
      { error: "Impossible de récupérer les commerces pour le moment." },
      { status: 500 }
    )
  }
}
