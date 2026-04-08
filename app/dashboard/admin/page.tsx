import { getCloudflareContext } from "@opennextjs/cloudflare"
import { stripeClient } from "@/lib/stripe"
import NotificationBanners from "@/app/dashboard/banners"

async function getAdminBanners() {
  try {
    const stripe = await stripeClient()
    const [openQuotes, openInvoices, pastDue] = await Promise.all([
      stripe.quotes.list({ status: "open", limit: 100 }),
      stripe.invoices.list({ status: "open", limit: 100 }),
      stripe.subscriptions.list({ status: "past_due", limit: 100 }),
    ])
    const banners: { type: "info" | "warning" | "error"; message: string; action?: { label: string; href: string } }[] = []
    if (openQuotes.data.length > 0)
      banners.push({ type: "info", message: `${openQuotes.data.length} quote${openQuotes.data.length > 1 ? "s" : ""} awaiting client acceptance.`, action: { label: "View quotes", href: "/dashboard/admin/quotes" } })
    if (openInvoices.data.length > 0)
      banners.push({ type: "warning", message: `${openInvoices.data.length} open invoice${openInvoices.data.length > 1 ? "s" : ""} awaiting payment.`, action: { label: "View invoices", href: "/dashboard/admin/invoices" } })
    if (pastDue.data.length > 0)
      banners.push({ type: "error", message: `${pastDue.data.length} subscription${pastDue.data.length > 1 ? "s" : ""} past due — payment failed.`, action: { label: "View subscriptions", href: "/dashboard/admin/subscriptions" } })
    return banners
  } catch { return [] }
}

async function getStats() {
  try {
    const stripe = await stripeClient()
    const [subs, invoices] = await Promise.all([
      stripe.subscriptions.list({ status: "active", limit: 100 }),
      stripe.invoices.list({ status: "open", limit: 100 }),
    ])

    const mrr = subs.data.reduce((sum, s) => {
      const amount = s.items.data.reduce((a, i) => a + (i.plan?.amount ?? 0), 0)
      return sum + amount / 100
    }, 0)

    const upcoming = subs.data
      .sort((a, b) => (a.current_period_end ?? 0) - (b.current_period_end ?? 0))
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        customerId: s.customer,
        renewsAt: new Date((s.current_period_end ?? 0) * 1000).toLocaleDateString(),
        amount: (s.items.data.reduce((a, i) => a + (i.plan?.amount ?? 0), 0) / 100).toFixed(2),
      }))

    return { mrr: mrr.toFixed(2), activeSubs: subs.data.length, openInvoices: invoices.data.length, upcoming }
  } catch {
    return { mrr: "–", activeSubs: 0, openInvoices: 0, upcoming: [] }
  }
}

async function getClientCount() {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const db = (env as CloudflareEnv).DB
    const row = await db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'client'").first<{ c: number }>()
    return row?.c ?? 0
  } catch {
    return 0
  }
}

export default async function AdminOverviewPage() {
  const [stats, clientCount, banners] = await Promise.all([getStats(), getClientCount(), getAdminBanners()])

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Overview</h1>

      <NotificationBanners banners={banners} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "MRR", value: stats.mrr === "–" ? "–" : `$${stats.mrr}` },
          { label: "Active Subscriptions", value: stats.activeSubs },
          { label: "Open Invoices", value: stats.openInvoices },
          { label: "Clients", value: clientCount },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card/50 p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-base font-semibold text-foreground mb-3">Upcoming Renewals</h2>
      {stats.upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming renewals</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Renews</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.upcoming.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{String(r.customerId)}</td>
                  <td className="px-4 py-3 text-foreground">{r.renewsAt}</td>
                  <td className="px-4 py-3 text-right text-foreground">${r.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
