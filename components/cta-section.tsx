"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, MessageSquare } from "lucide-react"

export function CTASection() {
  return (
    <section id="contact" className="relative overflow-hidden scroll-mt-20 md:scroll-mt-24">
      {/* Full-bleed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/15" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(oklch(0.60 0.24 264) 1px, transparent 1px), linear-gradient(90deg, oklch(0.60 0.24 264) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top/bottom fades to blend with surrounding sections */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
          Ready to get started?
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Whether you need Kanri for your school or a custom website built to last — we're here to help.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 text-base px-8 py-6 group"
            asChild
          >
            <a href="mailto:hello@v19.io?subject=Project%20Inquiry">
              <Mail className="mr-2 w-5 h-5" />
              Start a Conversation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border/60 hover:bg-secondary/60 text-foreground text-base px-8 py-6 backdrop-blur-sm"
            asChild
          >
            <a href="mailto:hello@v19.io?subject=Schedule%20a%20Call">
              <MessageSquare className="mr-2 w-5 h-5" />
              Schedule a Call
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <div className="p-5 rounded-xl bg-card/40 border border-border/60 backdrop-blur-sm text-left">
            <h3 className="font-semibold text-foreground text-sm mb-1">For Kanri</h3>
            <p className="text-xs text-muted-foreground mb-3">Demo requests, pricing, and support</p>
            <a
              href="https://kanrimemberships.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 text-xs font-medium inline-flex items-center gap-1"
            >
              kanrimemberships.com <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="p-5 rounded-xl bg-card/40 border border-border/60 backdrop-blur-sm text-left">
            <h3 className="font-semibold text-foreground text-sm mb-1">For Web Projects</h3>
            <p className="text-xs text-muted-foreground mb-3">Quotes, consultations, project discussions</p>
            <a
              href="mailto:hello@v19.io"
              className="text-primary hover:text-primary/80 text-xs font-medium"
            >
              hello@v19.io
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
