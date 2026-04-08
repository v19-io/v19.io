import { getCmsEnv, checkRateLimit, getSiteBySlug, clientIp, cmsJson } from "@/lib/cms"

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params
  if (!siteId) return cmsJson({ error: "siteId required" }, 400)

  const env = await getCmsEnv()
  const ip = clientIp(request)
  const rlKey = `ratelimit:${siteId}:${ip}`

  if (!(await checkRateLimit(env, rlKey))) {
    return cmsJson({ error: "Too many attempts. Try again in 15 minutes." }, 429)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return cmsJson({ error: "Invalid JSON" }, 400)
  }

  if (typeof body !== "object" || body === null) return cmsJson({ error: "Invalid JSON" }, 400)
  const passphrase = (body as Record<string, unknown>).passphrase
  if (typeof passphrase !== "string" || !passphrase) {
    return cmsJson({ error: "passphrase is required" }, 400)
  }

  // Passphrase validated against D1 site record
  const site = await getSiteBySlug(env, siteId)
  if (!site || passphrase !== site.cms_passphrase) {
    return cmsJson({ error: "Invalid passphrase" }, 401)
  }

  return cmsJson({ ok: true })
}
