import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProspectsTracker, { ProspectWithDemo } from "@/components/prospects/ProspectsTracker"

export const dynamic = "force-dynamic"

export default async function ProspectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  // Récupère tous les prospects de l'utilisateur avec leur démo associée
  const { data: prospects, error } = await supabase
    .from("prospects")
    .select("*, demos(id, slug, views_count, expires_at, is_active, created_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur chargement prospects:", error)
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3001"

  return (
    <ProspectsTracker
      initialProspects={(prospects as ProspectWithDemo[]) || []}
      rootDomain={rootDomain}
    />
  )
}
