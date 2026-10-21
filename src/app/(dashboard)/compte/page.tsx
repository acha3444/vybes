import { redirect } from "next/navigation"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import AccountSettingsForm from "@/components/account/AccountSettingsForm"

export const metadata: Metadata = {
  title: "Mon compte | Vybe",
  description: "Gère tes informations personnelles et la sécurité de ton compte Vybe.",
}

export const dynamic = "force-dynamic"

function capitalize(str: string): string {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default async function ComptePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single()

  const rawFullName = profile?.full_name || user.user_metadata?.full_name || ""
  const parts = rawFullName.trim().split(/\s+/)
  const firstName = parts[0] ? capitalize(parts[0]) : ""
  const lastName = parts.slice(1).length > 0 ? parts.slice(1).map(capitalize).join(" ") : ""

  return (
    <AccountSettingsForm
      initialFirstName={firstName}
      initialLastName={lastName}
      email={profile?.email || user.email || ""}
    />
  )
}
