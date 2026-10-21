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
    const { content, mark_sent } = body

    if (!content && !mark_sent) {
      return NextResponse.json({ error: "Contenu ou action requise" }, { status: 400 })
    }

    const updateFields: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (content) updateFields.content = content
    if (mark_sent) updateFields.sent_at = new Date().toISOString()

    // Mise à jour sécurisée via RLS (l'utilisateur ne met à jour que le content ou sent_at, jamais slug, expires_at ou views_count)
    const { data, error } = await supabase
      .from("demos")
      .update(updateFields)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Erreur update démo :", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, demo: data })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour" },
      { status: 500 }
    )
  }
}
