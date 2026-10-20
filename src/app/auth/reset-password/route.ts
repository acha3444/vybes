import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    return NextResponse.redirect(`${origin}/auth/callback?code=${encodeURIComponent(code)}&next=/reinitialiser-mot-de-passe`)
  }

  return NextResponse.redirect(`${origin}/reinitialiser-mot-de-passe`)
}
