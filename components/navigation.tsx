"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              v<span className="text-primary">19</span><span className="text-muted-foreground">.io</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#kanri" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Kanri
            </a>
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Web Services
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Pricing
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Contact
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
              <a href="/dashboard">Log In</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a href="#kanri" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2">
                Kanri
              </a>
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2">
                Web Services
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2">
                Pricing
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2">
                Contact
              </a>
              <Button variant="ghost" className="justify-center items-center text-center w-full" asChild>
                <a href="/dashboard">Log In</a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
