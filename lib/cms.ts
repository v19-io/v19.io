import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function getCmsEnv() {
  const { env } = await getCloudflareContext({ async: true })
  return env
}

export interface CmsSiteRow {
  id: string
  user_id: string
  name: string
  cms_site_id: string
  cms_passphrase: string
  plan: string
  status: string
}

// Site metadata from D1 (source of truth)
export async function getSiteBySlug(env: CloudflareEnv, cmsSiteId: string): Promise<CmsSiteRow | null> {
  const row = await env.DB.prepare("SELECT * FROM sites WHERE cms_site_id = ?")
    .bind(cmsSiteId)
    .first<CmsSiteRow>()
  return row ?? null
}

export async function isSiteAuthed(req: Request, env: CloudflareEnv, cmsSiteId: string): Promise<boolean> {
  const site = await getSiteBySlug(env, cmsSiteId)
  if (!site) return false
  return req.headers.get("Authorization") === `Bearer ${site.cms_passphrase}`
}

export function isAdmin(req: Request, env: CloudflareEnv): boolean {
  return req.headers.get("Authorization") === `Bearer ${env.ADMIN_SECRET}`
}

export function clientIp(req: Request): string {
  return req.headers.get("CF-Connecting-IP") ?? req.headers.get("X-Forwarded-For") ?? "unknown"
}

const RATE_LIMIT = { max: 5, windowSecs: 900 }

export async function checkRateLimit(env: CloudflareEnv, key: string): Promise<boolean> {
  const raw = await env.CONTENT.get(key)
  const count = raw ? parseInt(raw, 10) : 0
  if (count >= RATE_LIMIT.max) return false
  await env.CONTENT.put(key, String(count + 1), { expirationTtl: RATE_LIMIT.windowSecs })
  return true
}

export function cmsJson(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
