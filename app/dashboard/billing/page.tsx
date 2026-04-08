"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { CardSkeleton } from "@/components/skeleton"

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

interface Subscription {
  id: string
  status: string
  currentPeriodEnd: number
  cancelAtPeriodEnd: boolean
  amount: number
  currency: string
  interval: string
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  past_due: "bg-destructive/10 text-destructive border-destructive/30",
  canceled: "bg-muted text-muted-foreground border-border",
  paused: "bg-muted text-muted-foreground border-border",
  incomplete: "bg-amber-500/10 text-amber-400 border-amber-500/30",
}

const BRAND_ICONS: Record<string, string> = {
  visa: "Visa",
  mastercard: "MC",
  amex: "Amex",
  discover: "Disc",
}

export default function ClientBillingPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingCard, setUpdatingCard] = useState(false)
  const searchParams = useSearchParams()
  const setupSuccess = searchParams.get("setup") === "success"

  useEffect(() => {
    fetch("/api/client/billing")
      .then((r) => r.json())
      .then((d) => {
        setPaymentMethods(d.paymentMethods ?? [])
        setSubscriptions(d.subscriptions ?? [])
        setLoading(false)
      })
  }, [])

  async function handleUpdateCard() {
    setUpdatingCard(true)
    try {
      const res = await fetch("/api/client/billing", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setUpdatingCard(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-8">Billing</h1>

      {setupSuccess && (
        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Your card has been saved successfully.
        </div>
      )}

      {loading ? (
        <div className="space-y-8">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Payment methods */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Payment Methods</h2>
              <button
                onClick={handleUpdateCard}
                disabled={updatingCard}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {updatingCard ? "Redirecting…" : paymentMethods.length ? "Update card" : "Add card"}
              </button>
            </div>

            {paymentMethods.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payment methods on file.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="rounded-xl border border-border bg-card/50 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
                        {BRAND_ICONS[pm.brand] ?? pm.brand}
                      </span>
                      <span className="text-sm text-foreground">•••• {pm.last4}</span>
                      <span className="text-xs text-muted-foreground">Expires {pm.expMonth}/{pm.expYear}</span>
                    </div>
                    {pm.isDefault && (
                      <span className="text-xs text-primary font-medium">Default</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Subscriptions */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Subscriptions</h2>
            {subscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active subscriptions.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {subscriptions.map((s) => (
                  <div key={s.id} className="rounded-xl border border-border bg-card/50 px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">
                        ${((s.amount ?? 0) / 100).toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/{s.interval}</span>
                      </p>
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status] ?? ""}`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {s.cancelAtPeriodEnd
                        ? `Cancels on ${new Date(s.currentPeriodEnd * 1000).toLocaleDateString()}`
                        : `Renews ${new Date(s.currentPeriodEnd * 1000).toLocaleDateString()}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
