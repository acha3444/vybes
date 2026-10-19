import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 })
    }

    // Nom de fichier propre et sécurisé
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    
    // RÈGLE 7 : Stockage strictement dans le dossier de l'utilisateur auth.uid()
    const filePath = `${user.id}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from("demo-photos")
      .upload(filePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      })

    if (uploadError) {
      console.error("Erreur upload storage :", uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    // Récupération de l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from("demo-photos")
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    })
  } catch (error) {
    console.error("Erreur générale upload :", error)
    return NextResponse.json(
      { error: "Impossible de téléverser l'image" },
      { status: 500 }
    )
  }
}
