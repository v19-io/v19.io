"use client"

import { useEffect, useState } from "react"

interface Site { id: string; name: string; plan: string; client_name: string; stripe_subscription_id: string | null }
interface Subscription {
  id: string
  status: string
  customer: { id: string; name: string | null; email: string | null } | string
  current_period_end: number
  items: { data: { plan: { amount: number; interval: string } }[] }
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  past_due: "bg-destructive/10 text-destructive border-destructive/30",
  canceled: "bg-muted text-muted-foreground border-border",
  incomplete: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  trialing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSite, setSelectedSite] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [checkoutUrl, setCheckoutUrl] = useState("")

  async function load() {
    setLoading(true)
    const [subsRes, sitesRes] = await Promise.all([fetch("/api/admin/subscriptions"), fetch("/api/admin/sites")])
    const [s, si] = await Promise.all([subsRes.json(), sitesRes.json()])
    setSubscriptions(s.subscriptions ?? [])
    setSites((si.sites ?? []).filter((s: Site) => !s.stripe_subscription_id))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setCreating(true)
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: selectedSite }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return }
      setCheckoutUrl(data.checkoutUrl)
      load()
    } catch {
      setError("Something went wrong")
    } finally {
      setCreating(false)
    }
  }

  const customerName = (c: Subscription["customer"]) =>
    typeof c === "string" ? c : (c.name ?? c.email ?? c.id)

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-8">Subscriptions</h1>

      <div className="mb-6 rounded-xl border border-border bg-card/50 p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Create subscription for site</h2>
        {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>}
        {checkoutUrl ? (
          <div className="space-y-3">
            <p className="text-sm text-foreground">Subscription created! Share this card setup link with the client:</p>
            <a href={checkoutUrl} target="_blank" rel="noopener" className="block text-sm text-primary hover:underline break-all">{checkoutUrl}</a>
            <button onClick={() => { setCheckoutUrl(""); setSelectedSite("") }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Create another</button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="flex gap-3">
            <select
              required value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">Select site (no subscription yet)</option>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.client_name} ({s.plan})</option>)}
            </select>
            <button type="submit" disabled={creating} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {creating ? "Creating…" : "Create & get card link"}
            </button>
          </form>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : subscriptions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No subscriptions yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Renews</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => {
                const amount = s.items.data.reduce((a, i) => a + (i.plan?.amount ?? 0), 0)
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-foreground">{customerName(s.customer)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status] ?? ""}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">${(amount / 100).toFixed(2)}/mo</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(s.current_period_end * 1000).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
