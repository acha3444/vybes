import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status, notes } = body

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (status) {
      if (!["a_contacter", "demo_envoyee", "interesse", "signe", "perdu"].includes(status)) {
        return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
      }
      updateData.status = status
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data, error } = await supabase
      .from("prospects")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, prospect: data })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour du prospect" },
      { status: 500 }
    )
  }
}
