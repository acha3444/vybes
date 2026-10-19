import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { headers } from "next/headers"
import crypto from "crypto"
import RestaurantTemplate from "@/components/templates/RestaurantTemplate"
import BarberTemplate from "@/components/templates/BarberTemplate"
import BeautyTemplate from "@/components/templates/BeautyTemplate"
import DemoBanner from "@/components/templates/DemoBanner"
import DemoExpired from "@/components/templates/DemoExpired"
import { getDaysRemaining } from "@/lib/utils"

export const dynamic = "force-dynamic"

// RÈGLE IMPORTANTE : Les démos ne doivent JAMAIS être indexées par Google
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function PublicDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!slug || slug.length < 5) {
    notFound()
  }

  // 1. Récupération des informations de la requête
  const headerList = await headers()
  const forwardedFor = headerList.get("x-forwarded-for")
  const realIp = headerList.get("x-real-ip")
  const rawIp = (forwardedFor ? forwardedFor.split(",")[0] : realIp) || "127.0.0.1"
  const userAgent = headerList.get("user-agent") || "unknown"

  const salt = process.env.DEMO_IP_SALT || "vybe_secret_salt_2026"
  const ipHash = crypto.createHmac("sha256", salt).update(rawIp).digest("hex")

  // 2. Client Supabase (vérification session freelance)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Récupération de la démo
  const adminClient = createAdminClient()
  const { data: demo, error } = await adminClient
    .from("demos")
    .select("*, prospects(name, city)")
    .eq("slug", slug)
    .single()

  if (error || !demo) {
    notFound()
  }

  const isOwner = Boolean(user && user.id === demo.user_id)
  const isExpired = new Date(demo.expires_at).getTime() <= Date.now() || !demo.is_active

  // 4. Incrémentation de vue sécurisée (Anti-triche : les visites du propriétaire sont ignorées)
  if (!isExpired && !isOwner) {
    await adminClient.rpc("track_demo_view", {
      p_slug: slug,
      p_ip_hash: ipHash,
      p_user_agent: userAgent.slice(0, 250),
      p_is_owner: false,
    })
  }

  // Si la démo a dépassé 14 jours
  if (isExpired) {
    return <DemoExpired businessName={demo.content?.business_name} />
  }

  const daysLeft = getDaysRemaining(demo.expires_at)

  // Rendu du template correspondant
  const templateType = demo.template_type || "restaurant"

  return (
    <div className="relative min-h-screen">
      {/* Bandeau d'avertissement officiel */}
      <DemoBanner expiresInDays={daysLeft} />

      {/* Rendu du template ultra-soigné */}
      {templateType === "restaurant" && (
        <RestaurantTemplate content={demo.content} />
      )}
      {templateType === "barber" && <BarberTemplate content={demo.content} />}
      {templateType === "beauty" && <BeautyTemplate content={demo.content} />}
    </div>
  )
}
