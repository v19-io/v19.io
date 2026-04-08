import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const PUBLIC_PATHS = ["/dashboard/login", "/dashboard/invite", "/dashboard/reset"]
const ALLOWED_ORIGINS = ["https://v19.io", "http://localhost:3000", "http://localhost:8787"]
const MUTATING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"])

function csrfCheck(request: NextRequest): NextResponse | null {
  if (!MUTATING_METHODS.has(request.method)) return null
  // Skip Stripe webhook — it uses its own signature verification
  if (request.nextUrl.pathname === "/api/stripe/webhook") return null

  const origin = request.headers.get("origin")
  if (!origin) return null // same-origin requests in some browsers omit origin on GET/HEAD

  if (!ALLOWED_ORIGINS.some((o) => origin === o || origin.startsWith("http://localhost"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // CSRF check on all mutating API requests
  if (pathname.startsWith("/api/")) {
    const csrf = csrfCheck(request)
    if (csrf) return csrf
  }

  if (!pathname.startsWith("/dashboard")) return NextResponse.next()

  // Allow login and invite pages through unauthenticated
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next()

  const token = request.cookies.get("auth-session")?.value
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "")

  let payload: { userId?: string; role?: string } | null = null
  if (token) {
    try {
      const result = await jwtVerify(token, secret)
      payload = result.payload as { userId?: string; role?: string }
    } catch {
      // Invalid/expired token — fall through to redirect
    }
  }

  if (!payload?.userId) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // Role-gate the admin section
  if (pathname.startsWith("/dashboard/admin") && payload.role !== "admin") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
