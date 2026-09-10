import { Hero } from "@/components/landing/hero"
import { Modules } from "@/components/landing/modules"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Planes } from "@/components/landing/planes"
import { Cta } from "@/components/landing/cta"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Modules />
      <HowItWorks />
      <Planes />
      <Cta />
    </>
  )
}
