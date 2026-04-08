import { cookies } from "next/headers"
import { clearAuthCookie } from "@/lib/auth"

export async function POST() {
  const cookie = clearAuthCookie()
  const cookieStore = await cookies()
  cookieStore.set(cookie.name, cookie.value, cookie.options as Parameters<typeof cookieStore.set>[2])
  return Response.json({ ok: true })
}
