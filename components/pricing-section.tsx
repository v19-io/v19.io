"use client"

import { Button } from "@/components/ui/button"
import { Check, Flame } from "lucide-react"

const webPricing = [
  {
    name: "Spark",
    subtitle: "Single Page Sites",
    price: "500",
    description: "Perfect for landing pages, portfolios, and simple promotional sites.",
    features: [
      "Single responsive page",
      "Custom modern design",
      "Contact form integration",
      "Fully mobile optimized",
      "SEO optimization",
      "Social media links",
      "Google Analytics setup",
      "2 rounds of revisions"
    ],
    note: "Price varies based on complexity"
  },
  {
    name: "Blaze",
    subtitle: "Multi-Page Static",
    price: "1,500",
    description: "Full business websites with multiple pages and sections.",
    features: [
      "Up to 8 pages included",
      "Fully custom design",
      "Blog or news section",
      "Multiple contact forms",
      "Analytics & reporting setup",
      "Social media integration",
      "Image galleries",
      "Newsletter signup",
      "3 rounds of revisions"
    ],
    popular: true,
    note: "Additional pages available"
  },
  {
    name: "Inferno",
    subtitle: "Full-Stack Apps",
    price: "5,000",
    description: "Complex applications with authentication, databases, and dashboards.",
    features: [
      "User authentication system",
      "Database design & integration",
      "Admin dashboard",
      "Custom API development",
      "Payment processing ready",
      "Role-based permissions",
      "Email notifications",
      "File uploads & storage",
      "Ongoing support options"
    ],
    note: "Custom quote for complex projects"
  }
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight text-balance">
            Transparent
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Starting</span> Prices
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Clear baseline pricing for our web design services.
            Final costs depend on your specific requirements and complexity.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {webPricing.map((tier, index) => (
            <PricingCard key={index} {...tier} />
          ))}
        </div>

        {/* Hosting Note */}
        <div className="text-center p-8 rounded-2xl bg-card/50 border border-border">
          <h3 className="text-xl font-bold text-foreground mb-3">Hosting & Maintenance</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            All websites include managed hosting. Monthly hosting starts at <span className="text-foreground font-semibold">$25/month</span> for
            static sites and scales based on traffic and requirements. Full-stack applications quoted separately.
          </p>
          <p className="text-sm text-muted-foreground">
            SSL certificates included. Domain registration not included but we can help you set it up.
          </p>
        </div>
      </div>
    </section>
  )
}

function PricingCard({ name, subtitle, price, description, features, popular, note }: {
  name: string,
  subtitle: string,
  price: string,
  description: string,
  features: string[],
  popular?: boolean,
  note?: string
}) {
  const emailSubject = encodeURIComponent(`Quote Request: ${name} Package`)
  const emailBody = encodeURIComponent(`Hi v19,\n\nI'm interested in getting a quote for a ${subtitle.toLowerCase()} project.\n\nProject details:\n\n`)

  return (
    <div className={`relative p-8 rounded-2xl border transition-all duration-300 ${popular
      ? 'bg-card border-primary shadow-xl shadow-primary/10 scale-105'
      : 'bg-card/50 border-border hover:border-primary/50'
      }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground">{name}</h3>
        <p className="text-sm text-primary font-medium">{subtitle}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">Starting at</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-foreground">${price}</span>
          <span className="text-muted-foreground">CAD</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{description}</p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {note && (
        <p className="text-xs text-muted-foreground italic mb-6">{note}</p>
      )}

      <Button
        className={`w-full ${popular
          ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25'
          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
        size="lg"
        asChild
      >
        <a href={`mailto:hello@v19.io?subject=${emailSubject}&body=${emailBody}`}>
          Get a Quote
        </a>
      </Button>
    </div>
  )
}
