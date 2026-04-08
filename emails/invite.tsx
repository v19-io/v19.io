import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Tailwind,
} from "@react-email/components"

interface InviteEmailProps {
  name: string
  inviteUrl: string
}

export function InviteEmail({ name, inviteUrl }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to the v19 client portal</Preview>
      <Tailwind>
        <Body className="bg-zinc-950 font-sans">
          <Container className="mx-auto py-12 px-4 max-w-[480px]">
            <Heading className="text-white text-2xl font-bold tracking-tight mb-1">
              Welcome to v19
            </Heading>
            <Text className="text-zinc-400 text-sm mt-0 mb-8">
              Your client portal account has been set up.
            </Text>

            <Section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
              <Text className="text-zinc-300 text-sm leading-relaxed mb-6">
                Hi {name}, your account is ready. Click the button below to set your password and access your dashboard — where you can view your site, manage billing, and track invoices.
              </Text>
              <Button
                href={inviteUrl}
                className="bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-lg no-underline block text-center"
              >
                Set my password →
              </Button>
            </Section>

            <Text className="text-zinc-600 text-xs text-center">
              This link expires in 48 hours. If you weren't expecting this, you can safely ignore it.
            </Text>
            <Hr className="border-zinc-800 my-6" />
            <Text className="text-zinc-600 text-xs text-center">
              v19 · Digital Solutions
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
