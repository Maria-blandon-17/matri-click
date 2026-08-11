import { Hero } from "@/components/landing/hero"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { Modules } from "@/components/landing/modules"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Planes } from "@/components/landing/planes"
import { Cta } from "@/components/landing/cta"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <DashboardPreview />
      <Modules />
      <HowItWorks />
      <Planes />
      <Cta />
    </>
  )
}
