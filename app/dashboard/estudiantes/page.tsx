import { Search } from "lucide-react"

import { getEstudiantes } from "@/lib/actions/estudiantes"
import { getAcudientes } from "@/lib/actions/acudientes"
import { getVinculosEstudiantes } from "@/lib/actions/cuentas"
import { getPerfilActual } from "@/lib/actions/perfil"
import { EstudianteFormDialog } from "@/components/dashboard/estudiantes/estudiante-form-dialog"
import { EstudiantesTable } from "@/components/dashboard/estudiantes/estudiantes-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EstudiantesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const consulta = (q ?? "").trim().toLowerCase()

  const [estudiantesTodos, acudientes, vinculos, perfil] = await Promise.all([
    getEstudiantes(),
    getAcudientes(),
    getVinculosEstudiantes(),
    getPerfilActual(),
  ])

  const estudiantes = consulta
    ? estudiantesTodos.filter((e) =>
        `${e.nombres} ${e.apellidos} ${e.documento}`.toLowerCase().includes(consulta)
      )
    : estudiantesTodos

  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estudiantes</h1>
          <p className="text-sm text-muted-foreground">
            {consulta
              ? `${estudiantes.length} resultado${estudiantes.length === 1 ? "" : "s"} para "${q}".`
              : "Gestiona el registro de estudiantes."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form action="/dashboard/estudiantes" method="get" role="search" className="relative">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar por nombre o documento"
              aria-label="Buscar estudiante"
              className="h-9 w-56 rounded-full border border-white/10 bg-card/60 pr-4 pl-9 text-xs placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none sm:w-72"
            />
          </form>
          {esAdmin && <EstudianteFormDialog acudientes={acudientes} />}
        </div>
      </div>

      <Card className="glass-card border-0 py-0">
        <CardHeader className="pt-6">
          <CardTitle>Estudiantes registrados</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <EstudiantesTable
            estudiantes={estudiantes}
            acudientes={acudientes}
            vinculos={vinculos}
            esAdmin={esAdmin}
          />
        </CardContent>
      </Card>
    </div>
  )
}
