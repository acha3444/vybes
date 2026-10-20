import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getSafeRedirectPath } from "@/lib/auth/redirect"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const rawRedirect = searchParams.get("redirect") || searchParams.get("next")
  const safeNext = getSafeRedirectPath(rawRedirect, "/dashboard")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(safeNext, origin))
    }
  }

  // En cas d'erreur, redirection avec message
  return NextResponse.redirect(`${origin}/connexion?error=auth_failed`)
}
