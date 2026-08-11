import { Hero } from "@/components/landing/hero"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { Features } from "@/components/landing/features"
import { Modules } from "@/components/landing/modules"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Cta } from "@/components/landing/cta"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <DashboardPreview />
      <Features />
      <Modules />
      <HowItWorks />
      <Cta />
    </>
  )
}
