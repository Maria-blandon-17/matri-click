import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { HeroBackground } from "@/components/landing/hero-background"

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
      {/* Preload del fondo del hero para el LCP (Next hoista el <link> al <head>). */}
      <link rel="preload" as="image" href="/assets/fondo.webp" />
      <HeroBackground />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  )
}
