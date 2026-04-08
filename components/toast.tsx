"use client"

import { useEffect, useState, useCallback } from "react"

interface Toast {
  id: string
  type: "success" | "error" | "info"
  message: string
}

const STYLES = {
  success: "bg-green-500/10 border-green-500/30 text-green-400",
  error: "bg-destructive/10 border-destructive/30 text-destructive",
  info: "bg-primary/10 border-primary/30 text-primary",
}

export function Toasts({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${STYLES[t.type]}`}
        >
          <span>{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">✕</button>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
