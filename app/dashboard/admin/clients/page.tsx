"use client"

import { useEffect, useState } from "react"
import { TableSkeleton } from "@/components/skeleton"
import { useToast, Toasts } from "@/components/toast"

interface Client {
  id: string
  email: string
  name: string
  role: string
  stripe_customer_id: string | null
  created_at: string
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const { toasts, toast, dismiss } = useToast()

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/clients")
    const data = await res.json()
    setClients(data.clients ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return }
      setName(""); setEmail(""); setShowForm(false)
      toast("Client created and invite sent!", "success")
      load()
    } catch {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <Toasts toasts={toasts} dismiss={dismiss} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Clients</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {showForm ? "Cancel" : "New client"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card/50 p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Create client & send invite</h2>
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>
          )}
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit" disabled={submitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Creating…" : "Create & invite"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : clients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No clients yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Stripe</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.stripe_customer_id ?? "–"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
