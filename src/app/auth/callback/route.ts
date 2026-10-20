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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      if (data?.user) {
        try {
          const createdAt = new Date(data.user.created_at).getTime()
          const isNewUser = Date.now() - createdAt < 5 * 60 * 1000 // 5 dernières minutes

          if (isNewUser) {
            const { sendAdminSignupNotification } = await import("@/lib/email")
            await sendAdminSignupNotification({
              email: data.user.email || "",
              fullName: (data.user.user_metadata?.full_name as string) || null,
              provider: (data.user.app_metadata?.provider as string) || "oauth",
              userId: data.user.id,
            }).catch((err) => console.warn("[auth/callback] Resend notify warning:", err))
          }
        } catch (e) {
          console.warn("[auth/callback] Notification nouvel utilisateur ignorée:", e)
        }
      }

      return NextResponse.redirect(new URL(safeNext, origin))
    }
  }

  // En cas d'erreur, redirection avec message
  return NextResponse.redirect(`${origin}/connexion?error=auth_failed`)
}
