"use client";

export function Footer() {
  return (
    <footer className="relative bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <a href="#" className="inline-block mb-1.5">
              <span className="text-xl font-bold tracking-tight text-foreground">
                v19
              </span>
            </a>
            <p className="text-sm text-muted-foreground">
              School software & web design.
            </p>
          </div>

          {/* Inline nav */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Kanri", href: "https://kanrimemberships.com" },
              { label: "Web Services", href: "#services" },
              { label: "Contact", href: "#contact" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} v19 Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
