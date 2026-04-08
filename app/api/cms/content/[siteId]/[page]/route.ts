import { getCmsEnv, isSiteAuthed, cmsJson } from "@/lib/cms"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string; page: string }> }
) {
  const { siteId, page } = await params
  if (!siteId || !page) return cmsJson({ error: "siteId and page are required" }, 400)

  const env = await getCmsEnv()
  // Page content is stored in KV for global distribution
  const stored = await env.CONTENT.get(`content:${siteId}:${page}`)
  if (!stored) return cmsJson({ error: "Not found" }, 404)

  return new Response(stored, {
    headers: { ...CORS, "Content-Type": "application/json" },
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string; page: string }> }
) {
  const { siteId, page } = await params
  if (!siteId || !page) return cmsJson({ error: "siteId and page are required" }, 400)

  const env = await getCmsEnv()
  // Auth check via D1 site record
  if (!(await isSiteAuthed(request, env, siteId))) return cmsJson({ error: "Unauthorized" }, 401)

  let body: string
  try {
    body = await request.text()
    const parsed = JSON.parse(body)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return cmsJson({ error: "Content must be a JSON object" }, 400)
    }
  } catch {
    return cmsJson({ error: "Invalid JSON" }, 400)
  }

  await env.CONTENT.put(`content:${siteId}:${page}`, body)
  return cmsJson({ ok: true })
}
