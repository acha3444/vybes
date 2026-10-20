import { NextRequest, NextResponse } from "next/server"
import { sendAdminSignupNotification, sendUserWelcomeEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, provider, userId } = body

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email valide requis" }, { status: 400 })
    }

    // 1. Notification alerte admin (Achraf)
    const adminResult = await sendAdminSignupNotification({
      email: email.trim().toLowerCase(),
      fullName: fullName ? String(fullName).trim() : null,
      provider: provider || "email",
      userId,
    })

    // 2. Email de bienvenue utilisateur (tentative gracieuse)
    sendUserWelcomeEmail({
      email: email.trim().toLowerCase(),
      fullName: fullName ? String(fullName).trim() : null,
    }).catch((err) => {
      console.warn("[notify-signup] Ignored welcome email warning:", err?.message)
    })

    return NextResponse.json({
      success: true,
      adminNotified: adminResult.success,
    })
  } catch (error: any) {
    console.error("[notify-signup] Erreur route :", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
