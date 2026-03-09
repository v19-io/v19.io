"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, MessageSquare } from "lucide-react"

export function CTASection() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight text-balance">
            Ready to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"> Ignite</span> Your Project?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            Whether you need powerful school management software or a stunning custom website, 
            we're here to bring your vision to life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 text-lg px-8 py-6 group"
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
              className="border-border hover:bg-secondary text-foreground text-lg px-8 py-6"
              asChild
            >
              <a href="mailto:hello@v19.io?subject=Schedule%20a%20Call">
                <MessageSquare className="mr-2 w-5 h-5" />
                Schedule a Call
              </a>
            </Button>
          </div>
        </div>

        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="p-6 rounded-xl bg-card/50 border border-border">
            <h3 className="font-semibold text-foreground mb-2">For Kanri Inquiries</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Demo requests, pricing questions, and support
            </p>
            <a 
              href="https://kanrimemberships.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              Visit kanrimemberships.com
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="p-6 rounded-xl bg-card/50 border border-border">
            <h3 className="font-semibold text-foreground mb-2">For Web Design Projects</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Quotes, consultations, and project discussions
            </p>
            <a 
              href="mailto:hello@v19.io?subject=Web%20Design%20Project"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              hello@v19.io
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
