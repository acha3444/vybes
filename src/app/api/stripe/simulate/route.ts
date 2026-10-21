import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isStripeConfigured } from "@/lib/stripe/stripe"

export async function POST(request: NextRequest) {
  // Action strictement interdite en production : renvoie 403 immédiatement
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Action strictement interdite en production" },
      { status: 403 }
    )
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { targetStatus } = await request.json()

    const adminSupabase = createAdminClient()

    let updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (targetStatus === "active") {
      updateData.subscription_status = "active"
      updateData.trial_ends_at = null
    } else if (targetStatus === "trial_expired") {
      updateData.subscription_status = "trialing"
      // Date d'essai passée (hier) pour tester le paywall
      updateData.trial_ends_at = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    } else if (targetStatus === "trial_fresh") {
      updateData.subscription_status = "trialing"
      // 7 jours d'essai à partir de maintenant
      updateData.trial_ends_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    } else {
      return NextResponse.json({ error: "Statut cible invalide" }, { status: 400 })
    }

    const { data, error } = await adminSupabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur simulation" },
      { status: 500 }
    )
  }
}
