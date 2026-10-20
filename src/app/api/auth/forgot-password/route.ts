import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendPasswordResetEmail, getBaseAppUrl } from "@/lib/email"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email valide requis" }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const adminSupabase = createAdminClient()
    const appUrl = getBaseAppUrl()
    const redirectTo = `${appUrl}/auth/callback?next=/reinitialiser-mot-de-passe`

    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: "recovery",
      email: cleanEmail,
      options: {
        redirectTo,
      },
    })

    if (!error && data?.properties?.action_link) {
      await sendPasswordResetEmail({
        email: cleanEmail,
        resetUrl: data.properties.action_link,
      })
    } else {
      console.warn("[forgot-password] Impossible de générer le lien de récupération :", error?.message)
    }

    // Toujours renvoyer success: true pour éviter l'énumération des comptes
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[forgot-password] Erreur :", err)
    return NextResponse.json(
      { success: false, error: err?.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}
