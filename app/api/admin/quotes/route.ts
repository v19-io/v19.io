import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { stripeClient } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const stripe = await stripeClient()
  const quotes = await stripe.quotes.list({ limit: 50 })
  return NextResponse.json({ quotes: quotes.data })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { stripeCustomerId, lines } = await req.json()
  if (!stripeCustomerId || !lines?.length)
    return NextResponse.json({ error: "stripeCustomerId and lines required" }, { status: 400 })

  const stripe = await stripeClient()

  const quote = await stripe.quotes.create({
    customer: stripeCustomerId,
    line_items: lines.map((l: { description: string; amount: number; quantity: number }) => ({
      price_data: {
        currency: "cad",
        unit_amount: Math.round(l.amount * 100),
        product_data: { name: l.description },
      },
      quantity: l.quantity,
    })),
  })

  // Finalize + get the hosted URL
  const finalized = await stripe.quotes.finalizeQuote(quote.id)

  return NextResponse.json({ id: finalized.id, hostedUrl: finalized.hosted_quote_url }, { status: 201 })
}
