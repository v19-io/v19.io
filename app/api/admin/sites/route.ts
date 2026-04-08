import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB

  const { results } = await db
    .prepare(
      `SELECT s.*, u.name as client_name, u.email as client_email
       FROM sites s JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    )
    .all()

  return NextResponse.json({ sites: results })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { userId, name, url, cmsSiteId, cmsPassphrase, plan } = await req.json()
  if (!userId || !name || !cmsSiteId || !cmsPassphrase)
    return NextResponse.json({ error: "userId, name, cmsSiteId, cmsPassphrase required" }, { status: 400 })

  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB

  const user = await db.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first()
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const id = crypto.randomUUID()
  await db
    .prepare(
      "INSERT INTO sites (id, user_id, name, url, cms_site_id, cms_passphrase, plan) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(id, userId, name, url ?? null, cmsSiteId, cmsPassphrase, plan ?? "spark")
    .run()

  return NextResponse.json({ id, userId, name, cmsSiteId, plan: plan ?? "spark" }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { id, name, url, plan, status, cmsPassphrase } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB

  await db
    .prepare(
      `UPDATE sites SET
        name = COALESCE(?, name),
        url = COALESCE(?, url),
        plan = COALESCE(?, plan),
        status = COALESCE(?, status),
        cms_passphrase = COALESCE(?, cms_passphrase)
       WHERE id = ?`
    )
    .bind(name ?? null, url ?? null, plan ?? null, status ?? null, cmsPassphrase ?? null, id)
    .run()

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { env } = await getCloudflareContext({ async: true })
  const db = (env as CloudflareEnv).DB

  await db.prepare("DELETE FROM sites WHERE id = ?").bind(id).run()
  return NextResponse.json({ ok: true })
}
