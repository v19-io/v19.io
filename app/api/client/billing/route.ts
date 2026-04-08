import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { stripeClient } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user

  if (!user.stripe_customer_id)
    return NextResponse.json({ paymentMethods: [], subscription: null })

  const stripe = await stripeClient()
  const [pms, subs, customer] = await Promise.all([
    stripe.paymentMethods.list({ customer: user.stripe_customer_id, type: "card" }),
    stripe.subscriptions.list({ customer: user.stripe_customer_id, status: "all", limit: 5 }),
    stripe.customers.retrieve(user.stripe_customer_id),
  ])

  const defaultPmId = !customer.deleted ? customer.invoice_settings?.default_payment_method : null

  return NextResponse.json({
    paymentMethods: pms.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      isDefault: pm.id === defaultPmId,
    })),
    subscriptions: subs.data.map((s) => ({
      id: s.id,
      status: s.status,
      currentPeriodEnd: s.current_period_end,
      cancelAtPeriodEnd: s.cancel_at_period_end,
      amount: s.items.data.reduce((a, i) => a + (i.plan?.amount ?? 0), 0),
      currency: s.items.data[0]?.plan?.currency ?? "cad",
      interval: s.items.data[0]?.plan?.interval ?? "month",
    })),
  })
}

// POST — create a Checkout session to add/update card
export async function POST(req: NextRequest) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user

  if (!user.stripe_customer_id)
    return NextResponse.json({ error: "No Stripe customer" }, { status: 400 })

  const stripe = await stripeClient()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://v19.io"

  const session = await stripe.checkout.sessions.create({
    mode: "setup",
    customer: user.stripe_customer_id,
    currency: "cad",
    success_url: `${baseUrl}/dashboard/billing?setup=success`,
    cancel_url: `${baseUrl}/dashboard/billing`,
  })

  return NextResponse.json({ url: session.url })
}
