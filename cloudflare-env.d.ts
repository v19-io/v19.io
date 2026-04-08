interface CloudflareEnv {
  // OpenNext / ISR
  ASSETS: Fetcher
  WORKER_SELF_REFERENCE: Fetcher
  NEXT_INC_CACHE_R2_BUCKET: R2Bucket
  IMAGES: any // Cloudflare Images service (OpenNext)

  // Database
  DB: D1Database

  // CMS content (KV — globally distributed page content only)
  CONTENT: KVNamespace
  CMS_IMAGES: R2Bucket

  // Email — Cloudflare Email Workers send_email binding
  SEND_EMAIL: { send(message: EmailMessage): Promise<void> }

  // Secrets
  ADMIN_SECRET: string
  JWT_SECRET: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
}

// Cloudflare Workers Email runtime global (available in Workers runtime)
declare class EmailMessage {
  constructor(from: string, to: string, raw: string | ReadableStream)
  readonly from: string
  readonly to: string
}

