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
      className="flex min-h-svh text-foreground"
      style={{
        fontFamily: "var(--font-hanken-grotesk)",
        background:
          "radial-gradient(circle at 12% 0%, rgba(43,102,255,0.05), transparent 30%), radial-gradient(circle at 100% 100%, rgba(159,184,240,0.04), transparent 35%), var(--background)",
        backgroundAttachment: "fixed",
      }}
    >
      <Sidebar
        rol={perfil.rol}
        badges={badges}
        nombre={perfil.nombre_completo}
        correo={perfil.email}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <Topbar
            nombre={perfil.nombre_completo}
            correo={perfil.email}
            rol={perfil.rol}
            badges={badges}
          />
          {/* Forzado oscuro a propósito (fase 1 del modo claro): el shell
              (este layout, Sidebar, Topbar) ya responde al toggle, pero las
              páginas de catálogo/widgets todavía usan colores hardcodeados
              que asumen fondo oscuro (bg-white/5, border-white/10, etc.) —
              convertirlas es la fase 2. En modo oscuro este `dark` no
              cambia nada visualmente (--background ya es el mismo oscuro
              por fuera); en modo claro queda como un panel oscuro sobre el
              canvas claro, a propósito. */}
          <main className="theme-dark-forced min-w-0 flex-1 space-y-5 rounded-2xl bg-background p-4 text-foreground sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
