import type { Metadata } from "next"
import { cookies } from "next/headers"
import { getCurrentUser } from "@/lib/auth"
import ClientSidebar from "./sidebar"

export const metadata: Metadata = {
  title: "Dashboard | v19",
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies()
  const token = jar.get("auth-session")?.value
  const user = token ? await getCurrentUser(token) : null

  // Public auth pages (login, invite, reset) — no sidebar
  if (!user) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar isAdmin={user.role === "admin"} />
      <main className="flex-1 overflow-y-auto p-8 pt-20 md:pt-8">{children}</main>
    </div>
  )
}

