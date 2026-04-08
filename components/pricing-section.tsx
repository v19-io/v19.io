"use client"

import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Server, RefreshCw, ArrowUpCircle } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    subtitle: "Single Page Sites",
    price: "500",
    monthly: "20",
    description: "Landing pages, portfolios, and promotional sites — shipped fast and built to convert.",
    featured: false,
    accent: "primary" as const,
    features: [
      "Fully custom design",
      "Client CMS editor",
      "SEO & analytics",
      "Contact form",
      "Mobile optimized",
      "CDN & SSL",
    ],
    note: "Starting price — complexity may affect final cost.",
  },
  {
    name: "Growth",
    subtitle: "Multi-Page Sites",
    price: "1,500",
    monthly: "40",
    description: "Full business websites with multiple pages, a blog, and everything you need for a serious web presence.",
    featured: true,
    accent: "primary" as const,
    features: [
      "Everything in Starter",
      "Up to 8 pages",
      "Blog or news section",
      "Image galleries",
      "Newsletter integration",
      "Search functionality",
      "Password-protected pages",
    ],
    note: "Additional pages available — just ask.",
  },
  {
    name: "Custom",
    subtitle: "Full-Stack Applications",
    price: "5,000",
    monthly: "120",
    description: "Complex apps with user accounts, databases, dashboards, and payment processing — built and maintained long-term.",
    featured: false,
    accent: "accent" as const,
    features: [
      "Everything in Growth",
      "User auth & accounts",
      "Database & admin dashboard",
      "Stripe payment processing",
      "Custom API development",
      "Role-based permissions",
    ],
    note: "Custom quote for especially complex projects.",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-20 md:scroll-mt-24">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-4 uppercase tracking-wider">
            Pricing
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight max-w-xl">
              Transparent starting prices
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed lg:text-right">
              Final costs depend on your requirements. All plans include hosting, SSL, CDN, and ongoing maintenance.
            </p>
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {tiers.map((tier) => (
            <TierCard key={tier.name} {...tier} />
          ))}
        </div>

        {/* Bottom strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Server, label: "Everything included", desc: "Hosting, SSL, CDN, backups, and small updates in one monthly fee." },
            { icon: RefreshCw, label: "Small updates covered", desc: "Copy edits, image swaps, layout tweaks — no extra charge." },
            { icon: ArrowUpCircle, label: "Scale up anytime", desc: "Upgrade your plan as you grow. Your work carries forward." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-5 rounded-xl bg-card/50 border border-border">
              <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Domain registration not included — we'll help you set it up and point it to your site.
        </p>
      </div>
    </section>
  )
}

function TierCard({
  name, subtitle, price, monthly, description, features, note, featured, accent,
}: {
  name: string
  subtitle: string
  price: string
  monthly: string
  description: string
  features: string[]
  note?: string
  featured?: boolean
  accent: "primary" | "accent"
}) {
  const emailSubject = encodeURIComponent(`Quote Request: ${name} Package`)
  const emailBody = encodeURIComponent(`Hi,\n\nI'm interested in getting a quote for the ${name} plan (${subtitle}).\n\nProject details:\n\n`)
  const color = accent === "accent" ? "accent" : "primary"

  return (
    <div className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
      featured
        ? "border-primary/40 bg-gradient-to-b from-primary/10 via-card to-card shadow-xl shadow-primary/10 ring-1 ring-primary/20"
        : "border-border bg-card hover:border-border/80"
    }`}>

      {featured && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      )}

      {/* Top accent line for non-featured */}
      {!featured && (
        <div className={`h-0.5 w-full bg-gradient-to-r from-${color}/40 via-${color}/20 to-transparent`} />
      )}

      <div className="p-8 flex flex-col flex-1">

        {/* Badge */}
        {featured && (
          <div className="mb-4">
            <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              Most popular
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground">{name}</h3>
          <p className={`text-xs font-medium mt-0.5 text-${color}`}>{subtitle}</p>
        </div>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-start gap-1">
            <span className="text-sm text-muted-foreground mt-2">C$</span>
            <span className="text-5xl font-bold text-foreground tracking-tight leading-none">{price}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            + <span className="text-foreground font-medium">C${monthly}/mo</span> hosting & maintenance
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>

        {/* Features */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
              <Check className={`w-4 h-4 text-${color} shrink-0 mt-0.5`} />
              {f}
            </li>
          ))}
        </ul>

        {note && (
          <p className="text-xs text-muted-foreground italic mb-5">{note}</p>
        )}

        <Button
          className={`w-full group mt-auto ${
            featured
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              : accent === "accent"
                ? "bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          }`}
          size="lg"
          asChild
        >
          <a href={`mailto:hello@v19.io?subject=${emailSubject}&body=${emailBody}`}>
            Get a Quote
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </Button>
      </div>
    </div>
  )
}

const webPricing = [
  {
    name: "Starter",
    subtitle: "Single Page Sites",
    price: "500",
    monthly: "20",
    description: "Perfect for landing pages, portfolios, and simple promotional sites.",
    featured: false,
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
    name: "Growth",
    subtitle: "Multi-Page Sites",
    price: "1,500",
    monthly: "40",
    description: "Full business websites with multiple pages, a blog, and richer functionality.",
    featured: true,
    features: [
      "Client CMS editor — edit pages, posts, and media",
      "Everything in Starter",
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
    name: "Custom",
    subtitle: "Full-Stack Applications",
    price: "5,000",
    monthly: "120",
    description: "Complex web apps with authentication, databases, dashboards, and custom logic.",
    featured: false,
    features: [
      "Client CMS editor — full control over content and data",
      "Everything in Growth",
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
