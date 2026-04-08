import { compare } from "bcryptjs"
import { NextRequest } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { signToken, setAuthCookie } from "@/lib/auth"
import { cookies } from "next/headers"

interface UserRow {
  id: string
  email: string
  password_hash: string | null
  role: "admin" | "client"
  name: string | null
}

const RATE_LIMIT = { max: 10, windowSecs: 60 } // 10 attempts per minute per IP

async function checkLoginRateLimit(env: CloudflareEnv, ip: string): Promise<boolean> {
  const key = `ratelimit:login:${ip}`
  const raw = await env.CONTENT.get(key)
  const count = raw ? parseInt(raw, 10) : 0
  if (count >= RATE_LIMIT.max) return false
  await env.CONTENT.put(key, String(count + 1), { expirationTtl: RATE_LIMIT.windowSecs })
  return true
}

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true })

  // Rate limit by IP
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown"
  const allowed = await checkLoginRateLimit(env as CloudflareEnv, ip)
  if (!allowed) {
    return Response.json({ error: "Too many login attempts. Please wait a minute and try again." }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { email, password } = body as Record<string, unknown>
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 })
  }

  const user = await (env as CloudflareEnv).DB.prepare(
    "SELECT id, email, password_hash, role, name FROM users WHERE email = ? LIMIT 1"
  )
    .bind(email.toLowerCase().trim())
    .first<UserRow>()

  // Always run compare to prevent timing attacks
  const hash = user?.password_hash ?? "$2b$12$invalidhashtopreventtimingattack000000000000000000000000"
  const valid = await compare(password, hash)

  if (!user || !valid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 })
  }

  if (!user.password_hash) {
    return Response.json({ error: "Account setup not complete. Check your invite email." }, { status: 403 })
  }

  const token = await signToken(
    { userId: user.id, email: user.email, role: user.role },
    (env as CloudflareEnv).JWT_SECRET
  )

  const cookie = setAuthCookie(token)
  const cookieStore = await cookies()
  cookieStore.set(cookie.name, cookie.value, cookie.options as Parameters<typeof cookieStore.set>[2])

  return Response.json({ ok: true, user: { id: user.id, email: user.email, role: user.role, name: user.name } })
}
