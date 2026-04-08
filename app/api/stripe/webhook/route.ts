import { NextRequest, NextResponse } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getStripe } from "@/lib/stripe"
import { sendEmail } from "@/lib/email"
import { PaymentFailedEmail } from "@/emails/payment-failed"
import { InvoiceEmail } from "@/emails/invoice"
import type Stripe from "stripe"

// Verify Stripe webhook signature using the Web Crypto API (edge-compatible)
async function verifyWebhookSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  const parts = sigHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split("=")
    acc[k] = v
    return acc
  }, {})

  const timestamp = parts["t"]
  const signature = parts["v1"]
  if (!timestamp || !signature) return false

  // Reject timestamps older than 5 minutes
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) return false

  const signedPayload = `${timestamp}.${payload}`
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload))
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return expected === signature
}

export async function POST(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB
  const webhookSecret = (env as CloudflareEnv).STRIPE_WEBHOOK_SECRET
  const stripeKey = (env as CloudflareEnv).STRIPE_SECRET_KEY

  const sig = req.headers.get("stripe-signature")
  if (!sig || !webhookSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const payload = await req.text()
  const valid = await verifyWebhookSignature(payload, sig, webhookSecret)
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 })

  let event: Stripe.Event
  try {
    event = JSON.parse(payload) as Stripe.Event
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const stripe = getStripe(stripeKey)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://v19.io"

  try {
    switch (event.type) {
      // ── Quote accepted ──────────────────────────────────────────────────────
      case "quote.accepted": {
        const quote = event.data.object as Stripe.Quote
        const customerId = typeof quote.customer === "string" ? quote.customer : quote.customer?.id
        if (!customerId) break

        await db
          .prepare("UPDATE sites SET stripe_quote_id = ? WHERE user_id = (SELECT id FROM users WHERE stripe_customer_id = ?) AND stripe_quote_id IS NULL")
          .bind(quote.id, customerId)
          .run()
        break
      }

      // ── Subscription updated (activated, paused, cancelled, etc.) ──────────
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id
        if (!customerId) break

        const newStatus = sub.status === "active"
          ? "active"
          : sub.status === "canceled"
          ? "cancelled"
          : sub.status === "paused"
          ? "paused"
          : null

        if (newStatus) {
          await db
            .prepare("UPDATE sites SET status = ? WHERE stripe_subscription_id = ?")
            .bind(newStatus, sub.id)
            .run()
        }
        break
      }

      // ── Invoice paid ────────────────────────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const subId = typeof invoice.subscription === "string"
          ? invoice.subscription
          : (invoice.subscription as Stripe.Subscription | null)?.id

        if (subId) {
          // Activate the site if it's still in_progress (first payment)
          await db
            .prepare("UPDATE sites SET status = 'active' WHERE stripe_subscription_id = ? AND status = 'in_progress'")
            .bind(subId)
            .run()
        }
        break
      }

      // ── Payment failed ──────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === "string"
          ? invoice.customer
          : (invoice.customer as Stripe.Customer | null)?.id
        if (!customerId) break

        const user = await db
          .prepare("SELECT name, email FROM users WHERE stripe_customer_id = ?")
          .bind(customerId)
          .first<{ name: string; email: string }>()
        if (!user) break

        // Get site name for the email
        const site = await db
          .prepare("SELECT name, stripe_subscription_id FROM sites WHERE user_id = (SELECT id FROM users WHERE stripe_customer_id = ?) LIMIT 1")
          .bind(customerId)
          .first<{ name: string; stripe_subscription_id: string | null }>()

        const amount = `$${((invoice.amount_due ?? 0) / 100).toFixed(2)}`
        await sendEmail({
          to: user.email,
          toName: user.name,
          subject: "Action required: your payment failed",
          react: PaymentFailedEmail({
            name: user.name,
            siteName: site?.name ?? "your site",
            amount,
            billingUrl: `${baseUrl}/dashboard/billing`,
          }),
        })
        break
      }

      // ── Checkout completed (card setup) ────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== "setup") break

        const subscriptionId = session.metadata?.subscription_id
        if (!subscriptionId) break

        // Attach the new payment method as default and confirm the subscription
        const setupIntent = typeof session.setup_intent === "string"
          ? await stripe.setupIntents.retrieve(session.setup_intent)
          : session.setup_intent as Stripe.SetupIntent | null

        const paymentMethod = typeof setupIntent?.payment_method === "string"
          ? setupIntent.payment_method
          : setupIntent?.payment_method?.id

        if (!paymentMethod || !session.customer) break

        const customerId = typeof session.customer === "string" ? session.customer : session.customer.id
        await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethod } })
        await stripe.subscriptions.update(subscriptionId, { default_payment_method: paymentMethod })
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err)
    // Return 200 so Stripe doesn't retry on logic errors
  }

  return NextResponse.json({ received: true })
}
