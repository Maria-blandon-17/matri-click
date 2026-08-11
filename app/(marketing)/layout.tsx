import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

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
      <div className="bg-hero-glow pointer-events-none absolute inset-0 z-0" />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  )
}
