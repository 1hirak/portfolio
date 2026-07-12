import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  const slug = searchParams.get("slug") || "/"

  if (secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  const response = NextResponse.redirect(new URL(slug, request.url))

  response.cookies.set({
    name: "__prerender_bypass",
    value: secret,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
  })

  response.cookies.set({
    name: "__next_preview_data",
    value: btoa(JSON.stringify({ preview: true })),
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
  })

  return response
}
