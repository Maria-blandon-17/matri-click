export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="dark min-h-svh bg-background text-foreground"
      style={{ fontFamily: "var(--font-hanken-grotesk)" }}
    >
      {children}
    </div>
  )
}
