import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { LANDING_WAVE_LAYERS, WaveCanvas } from "@/components/landing/wave-canvas"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="dark relative flex min-h-svh flex-col overflow-x-hidden bg-background text-foreground"
      style={{ fontFamily: "var(--font-hanken-grotesk)" }}
    >
      {/* Un solo canvas de cintas + grilla de puntos detrás de TODA la
          página (Navbar → Footer) — ver LANDING_WAVE_LAYERS en
          wave-canvas.tsx para por qué es uno solo y no uno por sección. */}
      <WaveCanvas layers={LANDING_WAVE_LAYERS} showDots />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  )
}
