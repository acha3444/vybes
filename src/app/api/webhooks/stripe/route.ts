import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import Stripe from "stripe"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret || webhookSecret.includes("...")) {
    return NextResponse.json(
      { error: "Stripe webhook secret not configured" },
      { status: 400 }
    )
  }

  if (!stripe) {
    return NextResponse.json({ error: "Stripe client not initialized" }, { status: 400 })
  }

  const sig = request.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const rawBody = await request.text()
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    console.error("Erreur validation webhook Stripe :", err?.message)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err?.message}` },
      { status: 400 }
    )
  }

  const adminSupabase = createAdminClient()

  try {
    switch (event.type) {
      // 1. Session Checkout terminée avec succès
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        const userId =
          session.metadata?.supabase_uid ||
          (session.client_reference_id as string)

        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (userId) {
          let status: "active" | "trialing" = "active"
          let trialEndsAt: string | null = null

          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            status = subscription.status === "trialing" ? "trialing" : "active"
            if (subscription.trial_end) {
              trialEndsAt = new Date(subscription.trial_end * 1000).toISOString()
            }
          }

          await adminSupabase
            .from("profiles")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: status,
              trial_ends_at: trialEndsAt,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)
        }
        break
      }

      // 2. Mise à jour de l'abonnement (renouvellement, changement de statut)
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const status = subscription.status
        const customerId = subscription.customer as string

        const validStatuses = ["trialing", "active", "past_due", "canceled", "incomplete", "unpaid"]
        const normalizedStatus = validStatuses.includes(status) ? status : "canceled"

        const trialEndsAt = subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null

        await adminSupabase
          .from("profiles")
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: normalizedStatus,
            trial_ends_at: trialEndsAt,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)
        break
      }

      // 3. Résiliation de l'abonnement
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await adminSupabase
          .from("profiles")
          .update({
            subscription_status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)
        break
      }

      // 4. Paiement de facture réussi
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const subscriptionId = (invoice as any).subscription

        if (subscriptionId) {
          await adminSupabase
            .from("profiles")
            .update({
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_customer_id", customerId)
        }
        break
      }

      // 5. Échec de paiement de facture
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        await adminSupabase
          .from("profiles")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)
        break
      }

      default:
        console.log(`Événement Stripe non géré : ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error("Erreur traitement événement Stripe :", err)
    return NextResponse.json(
      { error: "Erreur serveur lors du traitement webhook" },
      { status: 500 }
    )
  }
}
