"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Globe } from "lucide-react";
import { MeshBackground } from "@/components/mesh-background";

const trustBadges = [
  "Canadian company",
  "Setup assistance included",
  "Cancel anytime",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-14 md:pt-0">
      <MeshBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: copy + CTAs */}
          <div>
            {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary font-medium mb-6 uppercase tracking-wider"> */}
            {/*   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> */}
            {/*   School management · Web design */}
            {/* </div> */}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Software for schools.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                Websites for everyone.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Kanri streamlines membership, billing, and scheduling for martial
              arts schools. We also build custom websites for any business ready
              to grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 text-base px-7 group"
                asChild
              >
                <a href="#kanri">
                  Explore Kanri
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary text-foreground text-base px-7"
                asChild
              >
                <a href="#contact">Get in touch</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-5">
              {trustBadges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right: product cards — desktop only, path selectors */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Kanri card */}
            <a
              href="#kanri"
              className="group block rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/8 to-transparent p-6 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Kanri</p>
                    <p className="text-xs text-primary">
                      School Management Software
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 mb-4">
                {[
                  "Membership & billing",
                  "Class scheduling",
                  "Student kiosk",
                  "Communications",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-primary/20 flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">
                  From C$99
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
            </a>

            {/* Web Design card — offset right */}
            <a
              href="#services"
              className="group block ml-8 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-accent/8 to-transparent p-6 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Web Design</p>
                    <p className="text-xs text-accent">
                      Custom Websites & Apps
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 mb-4">
                {[
                  "Landing pages",
                  "Multi-page sites",
                  "Full-stack apps",
                  "Ongoing maintenance",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-accent/20 flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">$500</span>
                <span className="text-sm text-muted-foreground">
                  starting price
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
