import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { stripeClient } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const banners: { type: "info" | "warning" | "error"; message: string; action?: { label: string; href: string } }[] = []

  try {
    const stripe = await stripeClient()
    const [failedInvoices, openQuotes, openInvoices] = await Promise.all([
      stripe.invoices.list({ status: "open", limit: 100 }),
      stripe.quotes.list({ status: "open", limit: 100 }),
      stripe.subscriptions.list({ status: "past_due", limit: 100 }),
    ])

    if (openQuotes.data.length > 0) {
      banners.push({
        type: "info",
        message: `${openQuotes.data.length} quote${openQuotes.data.length > 1 ? "s" : ""} awaiting client acceptance.`,
        action: { label: "View quotes", href: "/dashboard/admin/quotes" },
      })
    }

    if (failedInvoices.data.length > 0) {
      banners.push({
        type: "warning",
        message: `${failedInvoices.data.length} open invoice${failedInvoices.data.length > 1 ? "s" : ""} awaiting payment.`,
        action: { label: "View invoices", href: "/dashboard/admin/invoices" },
      })
    }

    if (openInvoices.data.length > 0) {
      banners.push({
        type: "error",
        message: `${openInvoices.data.length} subscription${openInvoices.data.length > 1 ? "s" : ""} past due — payment failed.`,
        action: { label: "View subscriptions", href: "/dashboard/admin/subscriptions" },
      })
    }
  } catch { /* non-fatal */ }

  return NextResponse.json({ banners })
}
