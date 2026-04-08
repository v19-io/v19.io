"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#kanri", label: "Kanri" },
  { href: "#services", label: "Web Services" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop: floating centered pill */}
      <div className="fixed top-5 inset-x-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-full border border-border/60 bg-background/85 backdrop-blur-xl shadow-lg shadow-black/20">
          <a href="#" className="px-3 py-1.5 flex items-center">
            <span className="text-sm font-bold tracking-tight text-foreground">
              v19
            </span>
          </a>
          <div className="w-px h-4 bg-border/80 mx-1" />
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium px-3 py-1.5 rounded-full hover:bg-secondary/60"
            >
              {label}
            </a>
          ))}
          {/* <div className="w-px h-4 bg-border/80 mx-1" /> */}
          {/* <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-full h-8 text-sm px-3"> */}
          {/*   Log In */}
          {/* </Button> */}
          {/* <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-8 text-sm px-4" asChild> */}
          {/*   <a href="#contact">Get Started</a> */}
          {/* </Button> */}
        </nav>
      </div>

      {/* Mobile: standard fixed bar */}
      <header className="fixed top-0 inset-x-0 z-50 md:hidden bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="px-4 flex items-center justify-between h-14">
          <a href="#" className="flex items-center">
            <span className="text-lg font-bold tracking-tight text-foreground">
              v19
            </span>
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {isOpen && (
          <div className="px-4 py-3 border-t border-border bg-background/95">
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-3 px-2 rounded-lg hover:bg-secondary"
                >
                  {label}
                </a>
              ))}
              <div className="flex gap-2 mt-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-muted-foreground"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  asChild
                >
                  <a href="#contact" onClick={() => setIsOpen(false)}>
                    Get Started
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
