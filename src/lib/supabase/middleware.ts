import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 1. GESTION DU SOUS-DOMAINE DÉMO
  // ex : demo.mondomaine.com/a8f3k2 -> réécriture vers /demo/a8f3k2
  const host = request.headers.get("host") || ""
  const isDemoSubdomain = host.startsWith("demo.")

  if (isDemoSubdomain) {
    const slug = request.nextUrl.pathname.replace(/^\//, "")
    if (slug && !slug.startsWith("api") && !slug.startsWith("_next") && !slug.startsWith("demo")) {
      const demoUrl = request.nextUrl.clone()
      demoUrl.pathname = `/demo/${slug}`
      return NextResponse.rewrite(demoUrl)
    }
  }

  // Si Supabase n'est pas configuré (placeholder), on laisse passer pour le dev local
  if (!url || !anonKey || url.includes("placeholder")) {
    return response
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // Récupération sécurisée de l'utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Liste des routes protégées de l'espace freelance
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/trouver") ||
    pathname.startsWith("/prospecter") ||
    pathname.startsWith("/prospects") ||
    pathname.startsWith("/demos") ||
    pathname.startsWith("/abonnement") ||
    pathname.startsWith("/compte")

  // Liste des routes d'authentification
  const isAuthRoute =
    pathname === "/connexion" ||
    pathname === "/inscription" ||
    pathname === "/mot-de-passe-oublie"

  // Si non connecté et sur une route protégée -> redirection connexion
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/connexion"
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si déjà connecté et sur une route d'auth -> redirection tableau de bord
  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
