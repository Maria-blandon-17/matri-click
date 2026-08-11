import { getInicioDashboardData } from "@/lib/actions/dashboard"
import { getPeriodos } from "@/lib/actions/periodos"
import { getPerfilActual } from "@/lib/actions/perfil"
import { getEstudiantes } from "@/lib/actions/estudiantes"
import { getMatriculas } from "@/lib/actions/matriculas"
import { InicioPersonal } from "@/components/dashboard/inicio-personal"
import { InicioFiltroPeriodo } from "@/components/dashboard/inicio-filtro-periodo"

export default async function InicioPage() {
  const perfil = await getPerfilActual()

  if (perfil?.rol === "acudiente" || perfil?.rol === "estudiante") {
    const vinculado =
      perfil.rol === "acudiente" ? perfil.id_acudiente !== null : perfil.id_estudiante !== null

    const [estudiantes, matriculas] = await Promise.all([
      vinculado ? getEstudiantes() : Promise.resolve([]),
      vinculado ? getMatriculas() : Promise.resolve([]),
    ])

    return <InicioPersonal vinculado={vinculado} estudiantes={estudiantes} matriculas={matriculas} />
  }

  const [initialData, periodos] = await Promise.all([getInicioDashboardData(), getPeriodos()])

  const periodoActivoLabel =
    periodos.find((p) => p.estado === "Activo")?.nombre_periodo ?? "Todos los periodos"

  return (
    <InicioFiltroPeriodo
      periodos={periodos}
      initialData={initialData}
      periodoActivoLabel={periodoActivoLabel}
    />
  )
}
