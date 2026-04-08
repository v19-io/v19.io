"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const NAV = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/sites", label: "My Sites" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/billing", label: "Billing" },
]

export default function ClientSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navContent = (
    <>
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col gap-0.5 pt-4 border-t border-border">
        {isAdmin && (
          <Link
            href="/dashboard/admin"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Admin →
          </Link>
        )}
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <span className="text-base font-bold tracking-tight text-foreground">v19</span>
        <button onClick={() => setOpen(!open)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle menu">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-56 h-full border-r border-border bg-background flex flex-col py-6 px-4 gap-1">
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border flex-col py-8 px-4 gap-1">
        <div className="px-2 mb-6">
          <span className="text-lg font-bold tracking-tight text-foreground">v19</span>
          <p className="text-xs text-muted-foreground">Client portal</p>
        </div>
        {navContent}
      </aside>
    </>
  )
}
