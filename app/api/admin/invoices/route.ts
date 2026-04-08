import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { stripeClient } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") ?? undefined

  const stripe = await stripeClient()
  const invoices = await stripe.invoices.list({
    limit: 100,
    ...(status && status !== "all" ? { status: status as "draft" | "open" | "paid" | "void" | "uncollectible" } : {}),
    expand: ["data.customer"],
  })

  return NextResponse.json({ invoices: invoices.data })
}
