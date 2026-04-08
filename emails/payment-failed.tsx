import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Tailwind,
} from "@react-email/components"

interface PaymentFailedEmailProps {
  name: string
  siteName: string
  amount: string
  billingUrl: string
}

export function PaymentFailedEmail({ name, siteName, amount, billingUrl }: PaymentFailedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Action required: payment failed for {siteName}</Preview>
      <Tailwind>
        <Body className="bg-zinc-950 font-sans">
          <Container className="mx-auto py-12 px-4 max-w-[480px]">
            <Heading className="text-white text-2xl font-bold tracking-tight mb-1">
              Payment failed
            </Heading>
            <Text className="text-zinc-400 text-sm mt-0 mb-8">
              Action required
            </Text>

            <Section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
              <Text className="text-zinc-300 text-sm leading-relaxed mb-2">
                Hi {name}, we weren't able to process your payment of <strong className="text-white">{amount}</strong> for <strong className="text-white">{siteName}</strong>.
              </Text>
              <Text className="text-zinc-300 text-sm leading-relaxed mb-6">
                Please update your payment method to keep your site online.
              </Text>
              <Button
                href={billingUrl}
                className="bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-lg no-underline block text-center"
              >
                Update payment method →
              </Button>
            </Section>

            <Text className="text-zinc-600 text-xs text-center">
              If you have questions, reply to this email or contact us at support@v19.io
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
