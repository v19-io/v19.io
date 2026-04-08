import Stripe from "stripe"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export function getStripe(secretKey: string) {
  return new Stripe(secretKey, {
    // @ts-expect-error – Cloudflare Workers runtime, not Node
    httpClient: Stripe.createFetchHttpClient(),
  })
}

export async function stripeClient() {
  const { env } = await getCloudflareContext({ async: true })
  const key = (env as CloudflareEnv).STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured")
  return getStripe(key)
}

export const PLAN_PRICES: Record<string, string> = {
  spark: process.env.STRIPE_PRICE_SPARK ?? "",
  blaze: process.env.STRIPE_PRICE_BLAZE ?? "",
  inferno: process.env.STRIPE_PRICE_INFERNO ?? "",
}
