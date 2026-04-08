"use client"

import { useEffect, useState } from "react"

interface Client { id: string; name: string; email: string; stripe_customer_id: string | null }
interface QuoteLineItem { description: string; amount: number; quantity: number }

interface Quote {
  id: string
  status: string
  customer: string
  amount_total: number
  currency: string
  created: number
  hosted_quote_url?: string | null
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState("")
  const [lines, setLines] = useState<QuoteLineItem[]>([{ description: "", amount: 0, quantity: 1 }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function loadClients() {
    const res = await fetch("/api/admin/clients")
    const data = await res.json()
    setClients(data.clients ?? [])
  }

  async function loadQuotes() {
    setLoading(true)
    const res = await fetch("/api/admin/quotes")
    const data = await res.json()
    setQuotes(data.quotes ?? [])
    setLoading(false)
  }

  useEffect(() => {
    Promise.all([loadClients(), loadQuotes()])
  }, [])

  function updateLine(i: number, key: keyof QuoteLineItem, val: string | number) {
    setLines((prev) => prev.map((l, idx) => idx === i ? { ...l, [key]: val } : l))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const client = clients.find((c) => c.id === selectedClient)
      if (!client?.stripe_customer_id) { setError("Selected client has no Stripe customer ID"); return }
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: client.stripe_customer_id, lines }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return }
      setShowForm(false)
      setLines([{ description: "", amount: 0, quantity: 1 }])
      setSelectedClient("")
      loadQuotes()
    } catch {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    draft: "bg-muted text-muted-foreground border-border",
    open: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    accepted: "bg-green-500/10 text-green-400 border-green-500/30",
    canceled: "bg-destructive/10 text-destructive border-destructive/30",
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Quotes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {showForm ? "Cancel" : "New quote"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card/50 p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Create Stripe Quote</h2>
          {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-4">
            <select
              required value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">Select client</option>
              {clients.filter((c) => c.stripe_customer_id).map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
            </select>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Line items</p>
              {lines.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    required value={l.description} onChange={(e) => updateLine(i, "description", e.target.value)}
                    placeholder="Description"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    required type="number" min="0" step="0.01" value={l.amount} onChange={(e) => updateLine(i, "amount", parseFloat(e.target.value))}
                    placeholder="Amount"
                    className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    required type="number" min="1" value={l.quantity} onChange={(e) => updateLine(i, "quantity", parseInt(e.target.value))}
                    placeholder="Qty"
                    className="w-16 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  {lines.length > 1 && (
                    <button type="button" onClick={() => setLines((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive transition-colors text-sm px-2">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setLines((p) => [...p, { description: "", amount: 0, quantity: 1 }])} className="text-xs text-primary hover:underline">+ Add line</button>
            </div>

            <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {submitting ? "Creating…" : "Create quote"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : quotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No quotes yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Quote</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{q.id}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{String(q.customer)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[q.status] ?? ""}`}>{q.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">${((q.amount_total ?? 0) / 100).toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(q.created * 1000).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {q.hosted_quote_url && (
                      <a href={q.hosted_quote_url} target="_blank" rel="noopener" className="text-xs text-primary hover:underline">View</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
