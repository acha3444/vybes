import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isStripeConfigured } from "@/lib/stripe/stripe"
import SubscriptionManager from "@/components/subscription/SubscriptionManager"

export const dynamic = "force-dynamic"

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ paywall?: string; success?: string; canceled?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, trial_ends_at, stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .single()

  const configured = isStripeConfigured()
  const isPaywall = params.paywall === "true"

  return (
    <SubscriptionManager
      initialStatus={profile?.subscription_status || "trialing"}
      trialEndsAt={profile?.trial_ends_at || null}
      hasStripeCustomer={Boolean(profile?.stripe_customer_id)}
      isConfigured={configured}
      isPaywall={isPaywall}
      isDev={process.env.NODE_ENV === "development"}
    />
  )
}
