export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="dark relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4 text-foreground"
      style={{
        fontFamily: "var(--font-hanken-grotesk)",
        background: "radial-gradient(circle at 50% 50%, #131b2b 0%, #040711 100%)",
      }}
    >
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] size-[600px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] size-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <main className="relative z-10 w-full max-w-[440px]">{children}</main>
    </div>
  )
}
