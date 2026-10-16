import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { LANDING_WAVE_LAYERS, WaveCanvas } from "@/components/landing/wave-canvas"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="relative flex min-h-svh flex-col overflow-x-hidden bg-background text-foreground"
      style={{ fontFamily: "var(--font-hanken-grotesk)" }}
    >
      {/* Un solo canvas de cintas + grilla de puntos detrás de TODA la
          página (Navbar → Footer) — ver LANDING_WAVE_LAYERS en
          wave-canvas.tsx para por qué es uno solo y no uno por sección. */}
      <WaveCanvas layers={LANDING_WAVE_LAYERS} showDots />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
      {/* Flotante en vez de metido en el Navbar: así no compite por espacio con
          el menú en móvil (donde el Navbar ya va apretado) y queda disponible
          en toda la landing sin depender del scroll del header. */}
      <ThemeToggle className="fixed right-4 bottom-4 z-50 size-11 rounded-full bg-card/90 shadow-lg backdrop-blur-xl sm:right-6 sm:bottom-6" />
    </div>
  )
}
