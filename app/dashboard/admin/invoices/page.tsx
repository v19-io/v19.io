"use client"

import { useEffect, useState } from "react"

interface Invoice {
  id: string
  customer: string
  status: string
  amount_due: number
  currency: string
  created: number
  hosted_invoice_url: string | null
  customer_name: string | null
  customer_email: string | null
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-500/10 text-green-400 border-green-500/30",
  open: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  draft: "bg-muted text-muted-foreground border-border",
  void: "bg-muted text-muted-foreground border-border",
  uncollectible: "bg-destructive/10 text-destructive border-destructive/30",
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetch("/api/admin/invoices")
      .then((r) => r.json())
      .then((d) => { setInvoices(d.invoices ?? []); setLoading(false) })
  }, [])

  const filtered = filter === "all" ? invoices : invoices.filter((i) => i.status === filter)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
        <div className="flex gap-1">
          {["all", "open", "paid", "draft", "void"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === s ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No invoices found.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{inv.customer_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{inv.customer_email ?? String(inv.customer)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[inv.status] ?? ""}`}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">${((inv.amount_due ?? 0) / 100).toFixed(2)} {inv.currency.toUpperCase()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(inv.created * 1000).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {inv.hosted_invoice_url && (
                      <a href={inv.hosted_invoice_url} target="_blank" rel="noopener" className="text-xs text-primary hover:underline">View</a>
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
