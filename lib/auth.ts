import { SignJWT, jwtVerify } from "jose"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { cookies } from "next/headers"

export interface JwtPayload {
  userId: string
  email: string
  role: "admin" | "client"
}

const COOKIE = "auth-session"
const EXPIRY = "1h"

function getSecret(secret: string) {
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: JwtPayload, secret: string): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret(secret))
}

export async function verifyToken(token: string, secret: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(secret))
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}

export function setAuthCookie(token: string): { name: string; value: string; options: object } {
  return {
    name: COOKIE,
    value: token,
    options: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60, // 1 hour
    },
  }
}

export function clearAuthCookie() {
  return {
    name: COOKIE,
    value: "",
    options: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  }
}

/** Get the current user from the auth cookie. Returns null if not authenticated. */
export async function getCurrentUser(): Promise<JwtPayload | null> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE)?.value
    if (!token) return null
    return verifyToken(token, env.JWT_SECRET)
  } catch {
    return null
  }
}

/** Get the current user or throw a 401 Response — use in API routes. */
export async function requireAuth(): Promise<JwtPayload> {
  const user = await getCurrentUser()
  if (!user) throw Response.json({ error: "Unauthorized" }, { status: 401 })
  return user
}

/** Require admin role or throw a 403 Response. */
export async function requireAdmin(): Promise<JwtPayload> {
  const user = await requireAuth()
  if (user.role !== "admin") throw Response.json({ error: "Forbidden" }, { status: 403 })
  return user
}
