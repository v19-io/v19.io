import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { stripeClient } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user

  if (!user.stripe_customer_id)
    return NextResponse.json({ invoices: [] })

  const stripe = await stripeClient()
  const invoices = await stripe.invoices.list({
    customer: user.stripe_customer_id,
    limit: 50,
    expand: [],
  })

  return NextResponse.json({
    invoices: invoices.data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      status: inv.status,
      amountDue: inv.amount_due,
      amountPaid: inv.amount_paid,
      currency: inv.currency,
      created: inv.created,
      dueDate: inv.due_date,
      hostedUrl: inv.hosted_invoice_url,
      pdfUrl: inv.invoice_pdf,
    })),
  })
}
