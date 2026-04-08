import { getCmsEnv, isSiteAuthed, cmsJson } from "@/lib/cms"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

// GET /api/cms/images/[siteId]/[filename] — serve image from R2
// POST /api/cms/images/[siteId] — upload image to R2
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params
  if (!key || key.length < 2) return new Response("Not found", { status: 404 })

  const r2Key = key.join("/")
  const env = await getCmsEnv()
  const object = await env.CMS_IMAGES.get(r2Key)
  if (!object) return new Response("Not found", { status: 404 })

  const headers = new Headers(CORS)
  if (object.httpMetadata?.contentType) {
    headers.set("Content-Type", object.httpMetadata.contentType)
  }
  headers.set("Cache-Control", "public, max-age=31536000, immutable")
  return new Response(object.body, { headers })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params
  // POST requires exactly one segment (the siteId)
  if (!key || key.length !== 1) return cmsJson({ error: "Invalid path" }, 400)
  const siteId = key[0]

  const env = await getCmsEnv()
  if (!(await isSiteAuthed(request, env, siteId))) return cmsJson({ error: "Unauthorized" }, 401)

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return cmsJson({ error: "Expected multipart/form-data" }, 400)
  }

  const file = formData.get("file") as File | null
  if (!file) return cmsJson({ error: "No file field" }, 400)
  if (file.size > 10 * 1024 * 1024) return cmsJson({ error: "File exceeds 10 MB limit" }, 413)

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const allowed = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"]
  if (!allowed.includes(ext)) return cmsJson({ error: "File type not allowed" }, 400)

  const r2Key = `${siteId}/${crypto.randomUUID()}.${ext}`
  await env.CMS_IMAGES.put(r2Key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  })

  const origin = new URL(request.url).origin
  return cmsJson({ url: `${origin}/api/cms/images/${r2Key}`, key: r2Key })
}
