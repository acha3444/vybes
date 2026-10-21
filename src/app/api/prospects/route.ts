import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeCityName } from "@/lib/templates/nameUtils"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      google_place_id,
      name,
      category,
      address,
      city,
      phone,
      rating,
      user_ratings_total,
    } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: "Nom et catégorie requis" },
        { status: 400 }
      )
    }

    // 1. Vérifier si le prospect existe déjà pour ce freelance
    if (google_place_id) {
      const { data: existing } = await supabase
        .from("prospects")
        .select("id")
        .eq("user_id", user.id)
        .eq("google_place_id", google_place_id)
        .single()

      if (existing) {
        return NextResponse.json({
          success: true,
          prospectId: existing.id,
          alreadyExisted: true,
        })
      }
    }

    // 2. Insérer le prospect sélectionné
    const { data: newProspect, error } = await supabase
      .from("prospects")
      .insert({
        user_id: user.id,
        google_place_id: google_place_id || null,
        name,
        category,
        address: address || null,
        city: city ? normalizeCityName(city) : null,
        phone: phone || null,
        rating: rating || null,
        user_ratings_total: user_ratings_total || 0,
        status: "a_contacter",
      })
      .select("id")
      .single()

    if (error) {
      console.error("Erreur insertion prospect:", error)
      return NextResponse.json(
        { error: "Impossible d'enregistrer le prospect" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      prospectId: newProspect.id,
      alreadyExisted: false,
    })
  } catch (error) {
    console.error("Erreur POST /api/prospects:", error)
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ prospects: [] })
  }

  const { data: prospects, error } = await supabase
    .from("prospects")
    .select("id, name, google_place_id")
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ prospects: [] })
  }

  return NextResponse.json({ prospects: prospects || [] })
}

