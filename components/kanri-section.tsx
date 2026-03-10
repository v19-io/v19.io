"use client"

import { Button } from "@/components/ui/button"
import {
  Users,
  CreditCard,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Smartphone,
  BarChart3,
  Monitor
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Membership Management",
    description: "Complete member profiles with notes, interaction history, and contact management."
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description: "Automated recurring billing with integrated payment processing."
  },
  {
    icon: Calendar,
    title: "Class Scheduling",
    description: "Flexible class schedules with automated attendance tracking."
  },
  {
    icon: ClipboardCheck,
    title: "Self-Service Kiosk",
    description: "Let students check in themselves with our integrated kiosk system."
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Track member advancement and belt promotions over time."
  },
  {
    icon: MessageSquare,
    title: "Communications Hub",
    description: "Send emails and SMS with custom templates and mass communications."
  }
]

const advancedFeatures = [
  { icon: Smartphone, label: "Mobile App Access" },
  { icon: BarChart3, label: "Advanced Analytics" },
  { icon: Monitor, label: "Multi-School Support" }
]

export function KanriSection() {
  return (
    <section id="kanri" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight text-balance">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Kanri</span>
            {" "}— Forge Your School's Future
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Streamline operations, engage students, and grow your martial arts school with our comprehensive management solution.
            Built by practitioners, for practitioners.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>

        {/* And So Much More */}
        <p className="text-center text-lg text-muted-foreground mb-16">
          <span className="text-primary font-semibold">...and so much more!</span>{" "}
          Waivers, family accounts, trial management, rank testing, retail POS, and custom reports.
        </p>

        {/* Advanced Features Teaser */}
        <div className="bg-card/50 border border-border rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Ready for more?</h3>
              <p className="text-muted-foreground">
                Kanri scales with you — from single-location schools to multi-school empires.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {advancedFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border">
                  <feat.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{feat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 group"
              asChild
            >
              <a href="https://kanrimemberships.com" target="_blank" rel="noopener noreferrer">
                Explore Kanri
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-border text-foreground" asChild>
              <a href="https://kanrimemberships.com" target="_blank" rel="noopener noreferrer">
                Book a Demo
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, description, index }: {
  icon: React.ComponentType<{ className?: string }>,
  title: string,
  description: string,
  index: number
}) {
  return (
    <div
      className="group relative p-6 rounded-xl bg-card/30 border border-border hover:border-primary/50 transition-all duration-300 hover:bg-card/50"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: string, label: string }) {
  return (
    <div className="p-6 rounded-xl bg-card/30 border border-border text-center">
      <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
