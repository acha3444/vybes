import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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

    // Si Stripe n'est pas configuré sur le serveur
    if (!isStripeConfigured() || !stripe) {
      console.error("[Stripe Checkout] Configuration manquante : les clés Stripe (STRIPE_SECRET_KEY, STRIPE_PRICE_ID_MONTHLY) ne sont pas définies.")
      return NextResponse.json({
        configured: false,
        error: "Paiement bientôt disponible",
      }, { status: 503 })
    }

    const adminSupabase = createAdminClient()

    // Récupérer le profil
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("stripe_customer_id, full_name")
      .eq("id", user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    // Création du client Stripe si inexistant
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: {
          supabase_uid: user.id,
        },
      })
      customerId = customer.id

      await adminSupabase
        .from("profiles")
        .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
        .eq("id", user.id)
    }

    const priceId = process.env.STRIPE_PRICE_ID_MONTHLY
    if (!priceId || priceId.includes("...")) {
      return NextResponse.json(
        { error: "Identifiant de prix Stripe (STRIPE_PRICE_ID_MONTHLY) manquant" },
        { status: 400 }
      )
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NEXT_PUBLIC_ROOT_DOMAIN
        ? `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
        : "http://localhost:3001")

    // Création de la session Stripe Checkout avec 7 jours d'essai
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          supabase_uid: user.id,
        },
      },
      success_url: `${appUrl}/abonnement?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/abonnement?canceled=true`,
      metadata: {
        supabase_uid: user.id,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url, configured: true })
  } catch (error: any) {
    console.error("Erreur création session Stripe Checkout :", error)
    return NextResponse.json(
      { error: error?.message || "Impossible d'initier le paiement Stripe" },
      { status: 500 }
    )
  }
}
