"use client"

import { Button } from "@/components/ui/button"
import { Check, PenLine, Server, RefreshCw, ArrowUpCircle } from "lucide-react"

const webPricing = [
  {
    name: "Spark",
    subtitle: "Single Page Sites",
    price: "500",
    monthly: "25",
    description: "Perfect for landing pages, portfolios, and simple promotional sites.",
    features: [
      "Client CMS editor — edit your content anytime",
      "Single responsive page",
      "Fully custom design",
      "Mobile & performance optimized",
      "Contact form integration",
      "Custom domain setup",
      "SEO optimization",
      "PostHog analytics",
      "Open Graph social previews",
      "Cookie consent & GDPR compliance",
      "CDN & caching setup",
      "Social media links",
      "Reasonable revisions included",
    ],
    note: "Starting price — final cost depends on complexity.",
  },
  {
    name: "Blaze",
    subtitle: "Multi-Page Sites",
    price: "1,500",
    monthly: "50",
    description: "Full business websites with multiple pages, a blog, and richer functionality.",
    features: [
      "Client CMS editor — edit pages, posts, and media",
      "Everything in Spark",
      "Up to 8 pages",
      "Blog or news section",
      "Image galleries",
      "Multiple contact forms",
      "Newsletter & email integration",
      "Search functionality",
      "Password-protected pages",
      "Reasonable revisions included",
    ],
    note: "Additional pages available — just ask.",
  },
  {
    name: "Inferno",
    subtitle: "Full-Stack Applications",
    price: "5,000",
    monthly: "150",
    description: "Complex web apps with authentication, databases, dashboards, and custom logic.",
    features: [
      "Client CMS editor — full control over content and data",
      "Everything in Blaze",
      "User authentication & accounts",
      "Database design & integration",
      "Admin dashboard",
      "Custom API development",
      "Stripe payment processing",
      "Role-based permissions",
      "Transactional email system",
      "File uploads & storage",
      "Ongoing support options",
      "Reasonable revisions included",
    ],
    note: "Custom quote for especially complex projects.",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight text-balance">
            Transparent
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Starting</span> Prices
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Clear baseline pricing for every stage of your web presence.
            Final costs depend on your specific requirements and complexity.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {webPricing.map((tier, index) => (
            <PricingCard key={index} {...tier} />
          ))}
        </div>

        {/* Hosting & Upgrades Callout */}
        <div className="rounded-2xl bg-card/50 border border-border overflow-hidden">
          <div className="p-8 border-b border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">Hosting, Maintenance & Upgrades</h3>
            <p className="text-muted-foreground max-w-3xl">
              Every site we build is production-ready from day one. The monthly fee covers everything — hosting, SSL, CDN, backups, and small content updates — so you never have to think about infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="p-6 flex gap-4">
              <Server className="w-5 h-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">Everything Included</p>
                <p className="text-sm text-muted-foreground">
                  One monthly price covers hosting, SSL, CDN, uptime monitoring, daily backups, and small updates. <span className="text-foreground font-semibold">$25/mo</span> for Spark, <span className="text-foreground font-semibold">$50/mo</span> for Blaze, <span className="text-foreground font-semibold">$150/mo</span> for Inferno.
                </p>
              </div>
            </div>
            <div className="p-6 flex gap-4">
              <RefreshCw className="w-5 h-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">Small Updates Included</p>
                <p className="text-sm text-muted-foreground">
                  Content updates, copy edits, image swaps, layout tweaks, new sections, dependency upgrades, and general adjustments — all covered. Major redesigns or new features are scoped and quoted separately.
                </p>
              </div>
            </div>
            <div className="p-6 flex gap-4">
              <ArrowUpCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">Plan Upgrades</p>
                <p className="text-sm text-muted-foreground">
                  Start with Spark and scale to Blaze or Inferno as your business grows. We carry your existing work forward — nothing is thrown away.
                </p>
              </div>
            </div>
          </div>
          <div className="px-8 py-4 bg-muted/30 text-sm text-muted-foreground">
            Domain registration not included, but we'll help you set it up and point it to your site.
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingCard({ name, subtitle, price, monthly, description, features, note }: {
  name: string
  subtitle: string
  price: string
  monthly: string
  description: string
  features: string[]
  note?: string
}) {
  const emailSubject = encodeURIComponent(`Quote Request: ${name} Package`)
  const emailBody = encodeURIComponent(`Hi v19,\n\nI'm interested in getting a quote for the ${name} plan (${subtitle}).\n\nProject details:\n\n`)

  return (
    <div className="relative flex flex-col p-8 rounded-2xl border border-border bg-card/50 hover:border-primary/50 transition-all duration-300">
      {/* Plan header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground">{name}</h3>
        <p className="text-sm text-primary font-medium">{subtitle}</p>
      </div>

      {/* Pricing */}
      <div className="mb-6">
        <span className="text-sm text-muted-foreground">Starting at</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-4xl font-bold text-foreground">${price}</span>
          <span className="text-muted-foreground">CAD</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          + <span className="text-foreground font-medium">${monthly}/mo</span> hosting & maintenance
        </p>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{description}</p>

      {/* Feature list */}
      <ul className="space-y-3 mb-6 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            {i === 0
              ? <PenLine className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              : <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            }
            <span className={`text-sm ${i === 0 ? 'text-foreground font-medium' : 'text-foreground'}`}>{feature}</span>
          </li>
        ))}
      </ul>

      {note && (
        <p className="text-xs text-muted-foreground italic mb-6">{note}</p>
      )}

      <Button
        className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground mt-auto"
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
