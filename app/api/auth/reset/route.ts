import { hash } from "bcryptjs"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { sendEmail } from "@/lib/email"
import { ResetEmail } from "@/emails/reset"

interface UserRow {
  id: string
  email: string
  name: string | null
  password_hash: string | null
}

// POST /api/auth/reset/request — send reset email
// POST /api/auth/reset/confirm — set new password with token
export async function POST(request: Request) {
  const url = new URL(request.url)
  const action = url.searchParams.get("action")

  let body: unknown
  try { body = await request.json() } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { env } = await getCloudflareContext({ async: true })

  // ── Request reset ──────────────────────────────────────────────────────────
  if (action === "request") {
    const { email } = body as Record<string, unknown>
    if (typeof email !== "string") return Response.json({ error: "Email required" }, { status: 400 })

    const user = await env.DB.prepare(
      "SELECT id, email, name, password_hash FROM users WHERE email = ? LIMIT 1"
    ).bind(email.toLowerCase().trim()).first<UserRow>()

    // Always return ok to prevent email enumeration
    if (!user || !user.password_hash) return Response.json({ ok: true })

    const resetToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

    await env.DB.prepare(
      "UPDATE users SET reset_token = ?, reset_expires_at = ? WHERE id = ?"
    ).bind(resetToken, expiresAt, user.id).run()

    const origin = url.origin
    await sendEmail({
      to: user.email,
      toName: user.name ?? undefined,
      subject: "Reset your v19 password",
      react: ResetEmail({
        name: user.name ?? "there",
        resetUrl: `${origin}/dashboard/reset/${resetToken}`,
      }),
    })

    return Response.json({ ok: true })
  }

  // ── Confirm reset ──────────────────────────────────────────────────────────
  if (action === "confirm") {
    const { token, password } = body as Record<string, unknown>
    if (typeof token !== "string" || typeof password !== "string") {
      return Response.json({ error: "token and password are required" }, { status: 400 })
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const user = await env.DB.prepare(
      "SELECT id, reset_token, reset_expires_at FROM users WHERE reset_token = ? LIMIT 1"
    ).bind(token).first<{ id: string; reset_token: string; reset_expires_at: string }>()

    if (!user || !user.reset_expires_at) {
      return Response.json({ error: "Invalid or expired reset link" }, { status: 404 })
    }
    if (new Date(user.reset_expires_at) < new Date()) {
      return Response.json({ error: "Reset link has expired" }, { status: 410 })
    }

    const passwordHash = await hash(password, 12)
    await env.DB.prepare(
      "UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?"
    ).bind(passwordHash, user.id).run()

    return Response.json({ ok: true })
  }

  return Response.json({ error: "Unknown action" }, { status: 400 })
}
