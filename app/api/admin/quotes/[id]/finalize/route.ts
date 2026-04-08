import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { stripeClient } from "@/lib/stripe"
import { sendEmail } from "@/lib/email"
import { InvoiceEmail } from "@/emails/invoice"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { id: quoteId } = await params
  const stripe = await stripeClient()

  const quote = await stripe.quotes.retrieve(quoteId)
  if (quote.status !== "accepted")
    return NextResponse.json({ error: "Quote must be accepted before finalizing to invoice" }, { status: 400 })

  const invoice = await stripe.quotes.convertToInvoice(quoteId)
  await stripe.invoices.finalizeInvoice(invoice.id)
  await stripe.invoices.sendInvoice(invoice.id)

  // Look up client by Stripe customer ID and notify via email
  try {
    const { env } = await getCloudflareContext({ async: true })
    const db = (env as CloudflareEnv).DB
    const customerId = typeof quote.customer === "string" ? quote.customer : quote.customer?.id
    const user = await db.prepare("SELECT name, email FROM users WHERE stripe_customer_id = ?").bind(customerId).first<{ name: string; email: string }>()
    if (user) {
      const amount = `$${((invoice.amount_due ?? 0) / 100).toFixed(2)}`
      const invoiceUrl = invoice.hosted_invoice_url ?? ""
      await sendEmail({
        to: user.email,
        toName: user.name,
        subject: "Your v19 invoice is ready",
        react: InvoiceEmail({ name: user.name, invoiceNumber: invoice.number ?? invoice.id, invoiceUrl, amount, dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString() : "Upon receipt" }),
      })
    }
  } catch { /* non-fatal */ }

  return NextResponse.json({ invoiceId: invoice.id, hostedUrl: invoice.hosted_invoice_url })
}
