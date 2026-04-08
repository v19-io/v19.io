import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { stripeClient, PLAN_PRICES } from "@/lib/stripe"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const stripe = await stripeClient()
  const subs = await stripe.subscriptions.list({ limit: 100, status: "all", expand: ["data.customer"] })
  return NextResponse.json({ subscriptions: subs.data })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { siteId } = await req.json()
  if (!siteId) return NextResponse.json({ error: "siteId required" }, { status: 400 })

  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB

  const site = await db
    .prepare("SELECT s.*, u.stripe_customer_id, u.email as client_email FROM sites s JOIN users u ON s.user_id = u.id WHERE s.id = ?")
    .bind(siteId)
    .first<{ id: string; plan: string; stripe_customer_id: string; client_email: string }>()

  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 })
  if (!site.stripe_customer_id) return NextResponse.json({ error: "Client has no Stripe customer" }, { status: 400 })

  const priceId = PLAN_PRICES[site.plan]
  if (!priceId) return NextResponse.json({ error: `No Stripe price configured for plan: ${site.plan}` }, { status: 400 })

  const stripe = await stripeClient()

  // Create subscription in incomplete state — card setup required
  const subscription = await stripe.subscriptions.create({
    customer: site.stripe_customer_id,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  })

  // Create a Checkout session in setup mode so client can add card
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://v19.io"
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "setup",
    customer: site.stripe_customer_id,
    currency: "cad",
    success_url: `${baseUrl}/dashboard?setup=success`,
    cancel_url: `${baseUrl}/dashboard?setup=cancelled`,
    metadata: { subscription_id: subscription.id, site_id: siteId },
  })

  // Store subscription ID on site
  await db
    .prepare("UPDATE sites SET stripe_subscription_id = ?, stripe_price_id = ? WHERE id = ?")
    .bind(subscription.id, priceId, siteId)
    .run()

  return NextResponse.json({
    subscriptionId: subscription.id,
    checkoutUrl: checkoutSession.url,
  }, { status: 201 })
}
