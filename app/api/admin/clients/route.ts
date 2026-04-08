import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { stripeClient } from "@/lib/stripe"
import { sendEmail } from "@/lib/email"
import { InviteEmail } from "@/emails/invite"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB

  const { results } = await db
    .prepare("SELECT id, email, name, role, stripe_customer_id, created_at FROM users ORDER BY created_at DESC")
    .all()

  return NextResponse.json({ clients: results })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { name, email } = await req.json()
  if (!name || !email) return NextResponse.json({ error: "name and email required" }, { status: 400 })

  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB

  const existing = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first()
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 })

  const stripe = await stripeClient()
  const customer = await stripe.customers.create({ name, email })

  const userId = crypto.randomUUID()
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  await db
    .prepare(
      "INSERT INTO users (id, email, name, role, stripe_customer_id, invite_token, invite_expires_at) VALUES (?, ?, ?, 'client', ?, ?, ?)"
    )
    .bind(userId, email, name, customer.id, token, expires)
    .run()

  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://v19.io"}/dashboard/invite/${token}`
  await sendEmail({
    to: email,
    toName: name,
    subject: "You've been invited to v19",
    react: InviteEmail({ name, inviteUrl }),
  })

  return NextResponse.json({ id: userId, email, name, stripeCustomerId: customer.id }, { status: 201 })
}
