"use client"

interface Banner {
  type: "info" | "warning" | "error"
  message: string
  action?: { label: string; href: string }
}

const STYLES = {
  info: "bg-primary/10 border-primary/30 text-primary",
  warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  error: "bg-destructive/10 border-destructive/30 text-destructive",
}

export default function NotificationBanners({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null

  return (
    <div className="flex flex-col gap-2 mb-6">
      {banners.map((b, i) => (
        <div
          key={i}
          className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium ${STYLES[b.type]}`}
        >
          <span>{b.message}</span>
          {b.action && (
            <a
              href={b.action.href}
              target={b.action.href.startsWith("http") ? "_blank" : undefined}
              rel={b.action.href.startsWith("http") ? "noopener" : undefined}
              className="ml-4 shrink-0 underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {b.action.label}
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
