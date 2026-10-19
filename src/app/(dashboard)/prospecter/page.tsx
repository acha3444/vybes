import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProspectingView from "@/components/prospecting/ProspectingView"

export const dynamic = "force-dynamic"

export default async function ProspecterPage({
  searchParams,
}: {
  searchParams: Promise<{ demo_id?: string }>
}) {
  const { demo_id } = await searchParams

  if (!demo_id) {
    redirect("/prospects")
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  // 1. Récupération du profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single()

  const freelanceName = profile?.full_name?.split(" ")[0] || "Alexandre"

  // 2. Récupération de la démo et de son prospect
  const { data: demo, error: demoErr } = await supabase
    .from("demos")
    .select("*, prospects(*)")
    .eq("id", demo_id)
    .eq("user_id", user.id)
    .single()

  if (demoErr || !demo || !demo.prospects) {
    redirect("/prospects")
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3001"

  return (
    <ProspectingView
      demo={demo}
      prospect={demo.prospects}
      initialFreelanceName={freelanceName}
      rootDomain={rootDomain}
    />
  )
}
