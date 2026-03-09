"use client"

import { Code2, Layers, Database, Palette, Globe, Server } from "lucide-react"

const services = [
  {
    icon: Palette,
    title: "Single Page Sites",
    description: "Perfect landing pages, portfolios, and promotional sites. Clean, fast, and conversion-focused.",
    tags: ["Landing Pages", "Portfolios", "Event Sites"]
  },
  {
    icon: Layers,
    title: "Multi-Page Static Sites",
    description: "Full business websites with multiple pages, perfect for established companies needing a solid web presence.",
    tags: ["Business Sites", "Service Pages", "About/Contact"]
  },
  {
    icon: Database,
    title: "Full-Stack Applications",
    description: "Complex applications with authentication, databases, dashboards, and custom functionality.",
    tags: ["User Auth", "Dashboards", "Custom Logic"]
  }
]

const techStack = [
  { icon: Code2, name: "React/Next.js" },
  { icon: Globe, name: "Custom Domains" },
  { icon: Server, name: "Managed Hosting" }
]

export function WebServicesSection() {
  return (
    <section id="services" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight text-balance">
            Websites Forged to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary"> Perform</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            From simple landing pages to complex web applications — we build digital experiences 
            that look stunning and work flawlessly.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Tech Stack Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-card/50 border border-border">
          <span className="text-sm font-medium text-muted-foreground">Built with modern tech:</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {techStack.map((tech, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border">
                <tech.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ icon: Icon, title, description, tags }: {
  icon: React.ComponentType<{ className?: string }>,
  title: string,
  description: string,
  tags: string[]
}) {
  return (
    <div className="group relative p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
          <Icon className="w-7 h-7 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
