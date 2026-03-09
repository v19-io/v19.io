"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Rocket, Cpu } from "lucide-react"
import { EmberParticles } from "@/components/ember-particles"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-ember-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-ember-pulse" style={{ animationDelay: "1.5s" }} />
      
      {/* Ember Particles */}
      <EmberParticles />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,100,50,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,100,50,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance leading-tight">
          Ignite Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary pb-2">
            Digital Empire
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed text-pretty">
          From powerful school management software to blazing-fast custom websites. 
          We forge digital tools that transform businesses.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 text-lg px-8 py-6 group"
            asChild
          >
            <a href="#kanri">
              Explore Kanri
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-border hover:bg-secondary text-foreground text-lg px-8 py-6"
            asChild
          >
            <a href="#services">Web Design Services</a>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <TrustBadge icon={Shield} label="Enterprise Security" />
          <TrustBadge icon={Rocket} label="Lightning Fast" />
          <TrustBadge icon={Cpu} label="Modern Tech Stack" />
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

function TrustBadge({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>, label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  )
}
