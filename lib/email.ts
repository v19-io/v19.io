import { render } from "@react-email/render"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { createMimeMessage } from "mimetext"

interface SendOptions {
  to: string
  toName?: string
  subject: string
  react: React.ReactElement
}

export async function sendEmail({ to, toName, subject, react }: SendOptions) {
  const { env } = await getCloudflareContext({ async: true })
  const html = await render(react)
  const text = await render(react, { plainText: true })

  const msg = createMimeMessage()
  msg.setSender({ name: "v19", addr: "no-reply@v19.io" })
  msg.setRecipient(toName ? { name: toName, addr: to } : to)
  msg.setSubject(subject)
  msg.addMessage({ contentType: "text/plain", data: text })
  msg.addMessage({ contentType: "text/html", data: html })

  const message = new EmailMessage("no-reply@v19.io", to, msg.asRaw())
  await (env as CloudflareEnv).SEND_EMAIL.send(message)
}

