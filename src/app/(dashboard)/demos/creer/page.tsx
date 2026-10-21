import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"
import { generateDefaultDemoContent } from "@/lib/templates/defaultContent"
import { normalizeBusinessName } from "@/lib/templates/nameUtils"

export const dynamic = "force-dynamic"

export default async function CreerDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ prospect_id?: string }>
}) {
  const { prospect_id } = await searchParams

  if (!prospect_id) {
    redirect("/trouver")
  }

  const supabase = await createClient()

  // 1. Vérification de l'utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  // 2. Vérification de l'abonnement actif ou période d'essai valide côté serveur
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, trial_ends_at")
    .eq("id", user.id)
    .single()

  const isSubscribed =
    profile?.subscription_status === "active" ||
    (profile?.subscription_status === "trialing" &&
      (!profile.trial_ends_at || new Date(profile.trial_ends_at).getTime() > Date.now()))

  if (!isSubscribed) {
    redirect("/abonnement?paywall=true")
  }

  // 3. Récupération du prospect
  const { data: prospect, error: prospectErr } = await supabase
    .from("prospects")
    .select("*")
    .eq("id", prospect_id)
    .eq("user_id", user.id)
    .single()

  if (prospectErr || !prospect) {
    redirect("/trouver")
  }

  // 4. Vérifier si une démo existe déjà pour ce prospect
  const { data: existingDemo } = await supabase
    .from("demos")
    .select("id")
    .eq("prospect_id", prospect.id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingDemo) {
    redirect(`/demos/${existingDemo.id}/edit`)
  }

  // 5. Génération du code unique de 10 caractères
  const slug = nanoid(10)
  const cleanBusinessName = normalizeBusinessName(prospect.name)

  // 6. Préparation du contenu complet personnalisé
  const defaultContent = {
    ...generateDefaultDemoContent(
      prospect.category,
      cleanBusinessName,
      prospect.city || "votre ville",
      prospect.address || "",
      prospect.phone || ""
    ),
    rating: prospect.rating ?? null,
    reviews_count: prospect.user_ratings_total ?? null,
  }

  // 7. Insertion de la démo
  const { data: newDemo, error: demoErr } = await supabase
    .from("demos")
    .insert({
      prospect_id: prospect.id,
      user_id: user.id,
      slug,
      template_type: prospect.category,
      content: defaultContent,
      views_count: 0,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    })
    .select("id")
    .single()

  if (demoErr || !newDemo) {
    console.error("Erreur création démo :", demoErr)
    redirect("/trouver?error=demo_creation_failed")
  }

  // Redirection vers l'éditeur de personnalisation
  redirect(`/demos/${newDemo.id}/edit?created=true`)
}
