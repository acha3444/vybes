import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DemoEditor from "@/components/demo-editor/DemoEditor"

export const dynamic = "force-dynamic"

export default async function DemoEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  // Récupération de la démo
  const { data: demo, error } = await supabase
    .from("demos")
    .select("*, prospects(name, city)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !demo) {
    notFound()
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3001"

  return <DemoEditor demo={demo} rootDomain={rootDomain} />
}
