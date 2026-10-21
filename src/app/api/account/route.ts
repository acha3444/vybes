import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function capitalize(str: string): string {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { firstName, lastName, password } = body

    // 1. Mise à jour de l'identité (prénom / nom)
    if (firstName !== undefined || lastName !== undefined) {
      const cleanFirst = capitalize(firstName?.trim() || "")
      const cleanLast = capitalize(lastName?.trim() || "")
      const fullName = [cleanFirst, cleanLast].filter(Boolean).join(" ")

      if (!fullName) {
        return NextResponse.json(
          { error: "Le prénom ou le nom ne peut pas être vide" },
          { status: 400 }
        )
      }

      // Mise à jour de profiles (autorisé par RLS "Users can update only their own full_name")
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("Erreur mise à jour profil :", profileError)
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }

      // Mise à jour de user_metadata
      await supabase.auth.updateUser({
        data: { full_name: fullName },
      })
    }

    // 2. Mise à jour du mot de passe
    if (password) {
      const cleanPassword = password.trim()
      if (cleanPassword.length < 8) {
        return NextResponse.json(
          { error: "Le mot de passe doit comporter au moins 8 caractères" },
          { status: 400 }
        )
      }

      const { error: pwdError } = await supabase.auth.updateUser({
        password: cleanPassword,
      })

      if (pwdError) {
        console.error("Erreur mise à jour mot de passe :", pwdError)
        return NextResponse.json({ error: pwdError.message }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Informations mises à jour avec succès",
    })
  } catch (error: any) {
    console.error("Erreur serveur PATCH /api/account :", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour du compte" },
      { status: 500 }
    )
  }
}
