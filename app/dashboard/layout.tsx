import { redirect } from "next/navigation"

import { getPerfilActual } from "@/lib/actions/perfil"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const perfil = await getPerfilActual()

  if (!perfil) {
    redirect("/login")
  }

  return (
    <div
      className="dark flex min-h-svh bg-background text-foreground"
      style={{
        fontFamily: "var(--font-hanken-grotesk)",
        background:
          "radial-gradient(circle at 15% 50%, rgba(0, 102, 255, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(179, 197, 255, 0.03), transparent 25%), #121414",
        backgroundAttachment: "fixed",
      }}
    >
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[260px]">
        <Topbar nombre={perfil.nombre_completo} />
        <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-5 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
