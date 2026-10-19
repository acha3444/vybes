import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const isStripeConfigured = () => {
  return Boolean(
    stripeSecretKey &&
    !stripeSecretKey.includes("...") &&
    stripeSecretKey.startsWith("sk_")
  )
}

export const stripe = stripeSecretKey && !stripeSecretKey.includes("...")
  ? new Stripe(stripeSecretKey, {
      typescript: true,
    })
  : null
