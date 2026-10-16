import { getInicioDashboardData } from "@/lib/actions/dashboard"
import { getPeriodos } from "@/lib/actions/periodos"
import { getPerfilActual } from "@/lib/actions/perfil"
import { getEstudiantes, getEstudiantesDeAcudiente } from "@/lib/actions/estudiantes"
import { getMatriculas } from "@/lib/actions/matriculas"
import { getGrupos } from "@/lib/actions/grupos"
import { getCuentasPendientes } from "@/lib/actions/cuentas-pendientes"
import { InicioPersonal } from "@/components/dashboard/inicio-personal"
import { InicioFiltroPeriodo } from "@/components/dashboard/inicio-filtro-periodo"
import { DashboardHeader, DashboardGreeting } from "@/components/dashboard/dashboard-header"

export default async function InicioPage() {
  const perfil = await getPerfilActual()
  const rol = perfil?.rol ?? "estudiante"

  const greeting = <DashboardGreeting nombre={perfil?.nombre_completo} correo={perfil?.email} />

  if (rol === "acudiente" || rol === "estudiante") {
    const vinculado =
      rol === "acudiente" ? perfil?.id_acudiente != null : perfil?.id_estudiante != null

    const [estudiantes, matriculas] = await Promise.all([
      vinculado
        ? rol === "acudiente"
          ? getEstudiantesDeAcudiente(perfil!.id_acudiente!)
          : getEstudiantes()
        : Promise.resolve([]),
      vinculado ? getMatriculas() : Promise.resolve([]),
    ])

    return (
      <div className="flex flex-col gap-5">
        <DashboardHeader
          nombre={perfil?.nombre_completo}
          correo={perfil?.email}
          rol={rol}
          greeting={greeting}
        />
        <InicioPersonal
          vinculado={vinculado}
          rol={rol}
          estudiantes={estudiantes}
          matriculas={matriculas}
        />
      </div>
    )
  }

  const esAdmin = rol === "admin"

  const [initialData, periodos, grupos, matriculasPendientes, cuentasPendientes] =
    await Promise.all([
      getInicioDashboardData(),
      getPeriodos(),
      getGrupos(),
      esAdmin ? getMatriculas({ estado: "Pendiente" }) : Promise.resolve([]),
      esAdmin ? getCuentasPendientes() : Promise.resolve([]),
    ])

  const periodoActivoLabel =
    periodos.find((p) => p.estado === "Activo")?.nombre_periodo ?? "Todos los periodos"

  const badges = {
    "/dashboard/matriculas": matriculasPendientes.length,
    "/dashboard/administracion/cuentas-pendientes": cuentasPendientes.length,
  }

  return (
    <InicioFiltroPeriodo
      header={
        <DashboardHeader
          nombre={perfil?.nombre_completo}
          correo={perfil?.email}
          rol={rol}
          badges={badges}
          greeting={greeting}
        />
      }
      periodos={periodos}
      initialData={initialData}
      periodoActivoLabel={periodoActivoLabel}
      grupos={grupos}
      esAdmin={esAdmin}
      matriculasPendientes={matriculasPendientes}
      cuentasPendientes={cuentasPendientes}
    />
  )
}
