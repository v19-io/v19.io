import { requireAdmin } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminSidebar from "./sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies()
  const token = jar.get("auth-session")?.value
  if (!token) redirect("/dashboard/login")

  const { getCurrentUser } = await import("@/lib/auth")
  const user = await getCurrentUser(token)
  if (!user || user.role !== "admin") redirect("/dashboard")

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8 pt-20 md:pt-8">{children}</main>
    </div>
  )
}
