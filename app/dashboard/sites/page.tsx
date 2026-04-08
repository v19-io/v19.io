"use client"

import { useEffect, useState } from "react"

interface Site {
  id: string
  name: string
  url: string | null
  cms_site_id: string
  plan: string
  status: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  in_progress: { label: "In progress", color: "text-amber-400" },
  active: { label: "Active", color: "text-green-400" },
  paused: { label: "Paused", color: "text-muted-foreground" },
  cancelled: { label: "Cancelled", color: "text-destructive" },
}

export default function ClientSitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/client/overview")
      .then((r) => r.json())
      .then((d) => { setSites(d.sites ?? []); setLoading(false) })
  }, [])

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-8">My Sites</h1>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : sites.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sites yet — your project is being set up.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sites.map((s) => {
            const st = STATUS_LABELS[s.status] ?? { label: s.status, color: "text-muted-foreground" }
            const editorUrl = `/edit/login?site=${s.cms_site_id}`
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card/50 px-5 py-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {s.plan} plan · <span className={st.color}>{st.label}</span>
                    </p>
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {s.url.replace(/^https?:\/\//, "")} ↗
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <a
                    href={editorUrl}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Open Editor
                  </a>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      Visit site
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
