import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { stripeClient } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user

  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB

  const sites = await db
    .prepare("SELECT id, name, url, cms_site_id, plan, status, stripe_subscription_id FROM sites WHERE user_id = ? ORDER BY created_at DESC")
    .bind(user.id)
    .all()

  let latestInvoice = null
  let subscription = null

  if (user.stripe_customer_id) {
    try {
      const stripe = await stripeClient()
      const [invoices, subs] = await Promise.all([
        stripe.invoices.list({ customer: user.stripe_customer_id, limit: 1 }),
        stripe.subscriptions.list({ customer: user.stripe_customer_id, status: "active", limit: 1 }),
      ])
      if (invoices.data[0]) {
        const inv = invoices.data[0]
        latestInvoice = {
          id: inv.id,
          status: inv.status,
          amount: inv.amount_due,
          currency: inv.currency,
          created: inv.created,
          hostedUrl: inv.hosted_invoice_url,
        }
      }
      if (subs.data[0]) {
        const sub = subs.data[0]
        subscription = {
          id: sub.id,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
          amount: sub.items.data.reduce((a, i) => a + (i.plan?.amount ?? 0), 0),
        }
      }
    } catch { /* non-fatal if Stripe unavailable */ }
  }

  // Check for any actionable banner state
  const banners: { type: string; message: string; action?: { label: string; href: string } }[] = []

  if (user.stripe_customer_id) {
    try {
      const stripe = await stripeClient()

      // Open invoices → payment needed
      const openInvoices = await stripe.invoices.list({ customer: user.stripe_customer_id, status: "open", limit: 1 })
      if (openInvoices.data[0]) {
        banners.push({
          type: "warning",
          message: "You have an invoice ready — payment is needed.",
          action: { label: "Pay now", href: openInvoices.data[0].hosted_invoice_url ?? "/dashboard/invoices" },
        })
      }

      // Past-due subscriptions → payment failed
      const pastDue = await stripe.subscriptions.list({ customer: user.stripe_customer_id, status: "past_due", limit: 1 })
      if (pastDue.data[0]) {
        banners.push({
          type: "error",
          message: "Your payment failed — please update your billing details.",
          action: { label: "Update billing", href: "/dashboard/billing" },
        })
      }

      // Quotes awaiting acceptance
      const quotes = await stripe.quotes.list({ customer: user.stripe_customer_id, status: "open", limit: 1 })
      if (quotes.data[0]) {
        banners.push({
          type: "info",
          message: "You have a quote to review.",
          action: { label: "Review quote", href: quotes.data[0].hosted_quote_url ?? "/dashboard" },
        })
      }
    } catch { /* non-fatal */ }
  }

  // Project in progress state
  const inProgressSite = (sites.results as { status: string }[]).find((s) => s.status === "in_progress")
  if (inProgressSite) {
    banners.push({ type: "info", message: "Your project is underway 🚧 — we'll notify you when it's ready." })
  }

  return NextResponse.json({ sites: sites.results, latestInvoice, subscription, banners })
}
