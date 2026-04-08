"use client"

import { useEffect, useState } from "react"
import NotificationBanners from "./banners"
import { CardSkeleton } from "@/components/skeleton"

interface Site { id: string; name: string; url: string | null; plan: string; status: string }
interface Invoice { id: string; status: string; amountDue: number; currency: string; hostedUrl: string | null }
interface Subscription { status: string; currentPeriodEnd: number; amount: number }
interface Banner { type: "info" | "warning" | "error"; message: string; action?: { label: string; href: string } }

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  in_progress: { label: "In progress", color: "text-amber-400" },
  active: { label: "Active", color: "text-green-400" },
  paused: { label: "Paused", color: "text-muted-foreground" },
  cancelled: { label: "Cancelled", color: "text-destructive" },
}

export default function ClientOverviewPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [latestInvoice, setLatestInvoice] = useState<Invoice | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/client/overview")
      .then((r) => r.json())
      .then((d) => {
        setSites(d.sites ?? [])
        setLatestInvoice(d.latestInvoice ?? null)
        setSubscription(d.subscription ?? null)
        setBanners(d.banners ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Overview</h1>

      <NotificationBanners banners={banners} />

      {loading ? (
        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Sites */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Sites</h2>
            {sites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sites yet — your project is being set up.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {sites.map((s) => {
                  const st = STATUS_LABELS[s.status] ?? { label: s.status, color: "text-muted-foreground" }
                  return (
                    <div key={s.id} className="rounded-xl border border-border bg-card/50 px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{s.plan} plan · <span className={st.color}>{st.label}</span></p>
                      </div>
                      {s.status === "active" && s.url && (
                        <a href={s.url} target="_blank" rel="noopener" className="text-xs text-primary hover:underline">Visit site →</a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card/50 p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Latest Invoice</p>
              {latestInvoice ? (
                <>
                  <p className="text-xl font-bold text-foreground">${((latestInvoice.amountDue ?? 0) / 100).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{latestInvoice.status}</p>
                  {latestInvoice.hostedUrl && latestInvoice.status === "open" && (
                    <a href={latestInvoice.hostedUrl} target="_blank" rel="noopener" className="mt-2 inline-block text-xs text-primary hover:underline">Pay now →</a>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No invoices yet</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Subscription</p>
              {subscription ? (
                <>
                  <p className="text-xl font-bold text-foreground">${((subscription.amount ?? 0) / 100).toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Renews {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No active subscription</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
