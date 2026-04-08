"use client"

import { useEffect, useState } from "react"

import { TableSkeleton } from "@/components/skeleton"

interface Invoice {
  id: string
  number: string | null
  status: string
  amountDue: number
  amountPaid: number
  currency: string
  created: number
  dueDate: number | null
  hostedUrl: string | null
  pdfUrl: string | null
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-500/10 text-green-400 border-green-500/30",
  open: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  draft: "bg-muted text-muted-foreground border-border",
  void: "bg-muted text-muted-foreground border-border",
  uncollectible: "bg-destructive/10 text-destructive border-destructive/30",
}

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/client/invoices")
      .then((r) => r.json())
      .then((d) => { setInvoices(d.invoices ?? []); setLoading(false) })
  }, [])

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-8">Invoices</h1>

      {loading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No invoices yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Invoice</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{inv.number ?? inv.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(inv.created * 1000).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[inv.status ?? ""] ?? ""}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    ${((inv.amountDue ?? 0) / 100).toFixed(2)} {inv.currency?.toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 justify-end">
                      {inv.status === "open" && inv.hostedUrl && (
                        <a href={inv.hostedUrl} target="_blank" rel="noopener" className="text-xs text-primary hover:underline font-medium">Pay</a>
                      )}
                      {inv.pdfUrl && (
                        <a href={inv.pdfUrl} target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground transition-colors">PDF</a>
                      )}
                    </div>
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
