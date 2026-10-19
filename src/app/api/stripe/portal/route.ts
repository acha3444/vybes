import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe, isStripeConfigured } from "@/lib/stripe/stripe"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json({
        configured: false,
        message: "Stripe n'est pas encore configuré avec des clés réelles.",
      })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Aucun profil client Stripe trouvé pour cet utilisateur" },
        { status: 400 }
      )
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NEXT_PUBLIC_ROOT_DOMAIN
        ? `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
        : "http://localhost:3001")

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/abonnement`,
    })

    return NextResponse.json({ url: session.url, configured: true })
  } catch (error: any) {
    console.error("Erreur portail Stripe Billing :", error)
    return NextResponse.json(
      { error: error?.message || "Impossible d'accéder au portail de facturation" },
      { status: 500 }
    )
  }
}
