import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Tailwind,
} from "@react-email/components"

interface ResetEmailProps {
  name: string
  resetUrl: string
}

export function ResetEmail({ name, resetUrl }: ResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your v19 password</Preview>
      <Tailwind>
        <Body className="bg-zinc-950 font-sans">
          <Container className="mx-auto py-12 px-4 max-w-[480px]">
            <Heading className="text-white text-2xl font-bold tracking-tight mb-1">
              Reset your password
            </Heading>
            <Text className="text-zinc-400 text-sm mt-0 mb-8">
              v19 Client Portal
            </Text>

            <Section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
              <Text className="text-zinc-300 text-sm leading-relaxed mb-6">
                Hi {name}, we received a request to reset your password. Click below to choose a new one.
              </Text>
              <Button
                href={resetUrl}
                className="bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-lg no-underline block text-center"
              >
                Reset my password →
              </Button>
            </Section>

            <Text className="text-zinc-600 text-xs text-center">
              This link expires in 1 hour. If you didn't request a reset, you can safely ignore this email.
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
