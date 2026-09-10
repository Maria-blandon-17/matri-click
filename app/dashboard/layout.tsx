import { redirect } from "next/navigation"

import { getPerfilActual } from "@/lib/actions/perfil"
import { getMatriculasPendientesCount } from "@/lib/actions/matriculas"
import { getCuentasPendientesCount } from "@/lib/actions/cuentas-pendientes"
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

  const [pendientesMatriculas, pendientesCuentas] =
    perfil.rol === "admin"
      ? await Promise.all([getMatriculasPendientesCount(), getCuentasPendientesCount()])
      : [0, 0]

  const badges = {
    "/dashboard/matriculas": pendientesMatriculas,
    "/dashboard/administracion/cuentas-pendientes": pendientesCuentas,
  }

  return (
    <div
      className="dark flex min-h-svh bg-background text-foreground"
      style={{
        fontFamily: "var(--font-hanken-grotesk)",
        background:
          "radial-gradient(circle at 15% 50%, rgba(43,102,255,0.06), transparent 25%), radial-gradient(circle at 85% 30%, rgba(159,184,240,0.04), transparent 25%), #040711",
        backgroundAttachment: "fixed",
      }}
    >
      <Sidebar rol={perfil.rol} badges={badges} />
      <div className="flex flex-1 flex-col md:ml-[260px]">
        <Topbar
          nombre={perfil.nombre_completo}
          correo={perfil.email}
          rol={perfil.rol}
          pendientesMatriculas={pendientesMatriculas}
          badges={badges}
        />
        <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-5 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
