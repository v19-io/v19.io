import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { KanriSection } from "@/components/kanri-section"
import { WebServicesSection } from "@/components/web-services-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <KanriSection />
      <WebServicesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}
