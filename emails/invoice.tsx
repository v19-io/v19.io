import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Tailwind,
} from "@react-email/components"

interface InvoiceEmailProps {
  name: string
  invoiceNumber: string
  amount: string
  dueDate: string
  invoiceUrl: string
}

export function InvoiceEmail({ name, invoiceNumber, amount, dueDate, invoiceUrl }: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Invoice {invoiceNumber} — {amount} due {dueDate}</Preview>
      <Tailwind>
        <Body className="bg-zinc-950 font-sans">
          <Container className="mx-auto py-12 px-4 max-w-[480px]">
            <Heading className="text-white text-2xl font-bold tracking-tight mb-1">
              Invoice ready
            </Heading>
            <Text className="text-zinc-400 text-sm mt-0 mb-8">
              v19 Client Portal
            </Text>

            <Section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
              <Text className="text-zinc-300 text-sm leading-relaxed mb-1">
                Hi {name}, your invoice is ready to view and pay.
              </Text>
              <Text className="text-zinc-500 text-xs mb-6">
                Invoice {invoiceNumber} · {amount} · Due {dueDate}
              </Text>
              <Button
                href={invoiceUrl}
                className="bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-lg no-underline block text-center"
              >
                View &amp; pay invoice →
              </Button>
            </Section>

            <Text className="text-zinc-600 text-xs text-center">
              You can also view all your invoices in your{" "}
              <a href="https://v19.io/dashboard/invoices" className="text-indigo-400 no-underline">
                client dashboard
              </a>.
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
