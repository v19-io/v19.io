"use client"

import { useEffect, useState } from "react"

interface Site {
  id: string
  name: string
  url: string | null
  cms_site_id: string
  plan: string
  status: string
  client_name: string
  client_email: string
  created_at: string
}

interface Client { id: string; name: string; email: string }

const STATUS_COLORS: Record<string, string> = {
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  paused: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
}

const PLANS = ["spark", "blaze", "inferno"]
const STATUSES = ["in_progress", "active", "paused", "cancelled"]

export default function AdminSitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ userId: "", name: "", url: "", cmsSiteId: "", cmsPassphrase: "", plan: "spark" })

  async function load() {
    setLoading(true)
    const [sitesRes, clientsRes] = await Promise.all([fetch("/api/admin/sites"), fetch("/api/admin/clients")])
    const [s, c] = await Promise.all([sitesRes.json(), clientsRes.json()])
    setSites(s.sites ?? [])
    setClients(c.clients ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return }
      setForm({ userId: "", name: "", url: "", cmsSiteId: "", cmsPassphrase: "", plan: "spark" })
      setShowForm(false)
      load()
    } catch {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  async function updateStatus(siteId: string, status: string) {
    await fetch("/api/admin/sites", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: siteId, status }),
    })
    load()
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Sites</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {showForm ? "Cancel" : "New site"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card/50 p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Create site</h2>
          {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>}
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
            <select required value={form.userId} onChange={f("userId")} className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">Select client</option>
              {clients.filter((c) => c.id).map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
            </select>
            <input required value={form.name} onChange={f("name")} placeholder="Site name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <input value={form.url} onChange={f("url")} placeholder="https://example.com" className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <input required value={form.cmsSiteId} onChange={f("cmsSiteId")} placeholder="CMS site ID (slug)" className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <input required value={form.cmsPassphrase} onChange={f("cmsPassphrase")} placeholder="CMS passphrase" className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <select value={form.plan} onChange={f("plan")} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
              {PLANS.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
            <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {submitting ? "Creating…" : "Create site"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : sites.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sites yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">CMS ID</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {s.url ? <a href={s.url} target="_blank" rel="noopener" className="hover:text-primary transition-colors">{s.name}</a> : s.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.client_name}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{s.plan}</td>
                  <td className="px-4 py-3">
                    <select
                      value={s.status}
                      onChange={(e) => updateStatus(s.id, e.target.value)}
                      className={`rounded-md border px-2 py-1 text-xs font-medium bg-transparent ${STATUS_COLORS[s.status] ?? ""}`}
                    >
                      {STATUSES.map((st) => <option key={st} value={st}>{st.replace("_", " ")}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.cms_site_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
