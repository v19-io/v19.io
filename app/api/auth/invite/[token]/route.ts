import { hash } from "bcryptjs"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { signToken, setAuthCookie } from "@/lib/auth"
import { cookies } from "next/headers"

interface UserRow {
  id: string
  email: string
  role: "admin" | "client"
  name: string | null
  invite_token: string | null
  invite_expires_at: string | null
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const { env } = await getCloudflareContext({ async: true })

  const user = await env.DB.prepare(
    "SELECT id, email, role, name, invite_token, invite_expires_at FROM users WHERE invite_token = ? LIMIT 1"
  ).bind(token).first<UserRow>()

  if (!user || !user.invite_expires_at) {
    return Response.json({ error: "Invalid or expired invite link" }, { status: 404 })
  }
  if (new Date(user.invite_expires_at) < new Date()) {
    return Response.json({ error: "Invite link has expired" }, { status: 410 })
  }

  return Response.json({ ok: true, email: user.email, name: user.name })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  let body: unknown
  try { body = await request.json() } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { password } = body as Record<string, unknown>
  if (typeof password !== "string" || password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const { env } = await getCloudflareContext({ async: true })

  const user = await env.DB.prepare(
    "SELECT id, email, role, name, invite_token, invite_expires_at FROM users WHERE invite_token = ? LIMIT 1"
  ).bind(token).first<UserRow>()

  if (!user || !user.invite_expires_at) {
    return Response.json({ error: "Invalid or expired invite link" }, { status: 404 })
  }
  if (new Date(user.invite_expires_at) < new Date()) {
    return Response.json({ error: "Invite link has expired" }, { status: 410 })
  }

  const passwordHash = await hash(password, 12)
  await env.DB.prepare(
    "UPDATE users SET password_hash = ?, invite_token = NULL, invite_expires_at = NULL WHERE id = ?"
  ).bind(passwordHash, user.id).run()

  const jwtToken = await signToken(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_SECRET
  )
  const cookie = setAuthCookie(jwtToken)
  const cookieStore = await cookies()
  cookieStore.set(cookie.name, cookie.value, cookie.options as Parameters<typeof cookieStore.set>[2])

  return Response.json({ ok: true })
}
