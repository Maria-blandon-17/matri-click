import { getEstudiantes } from "@/lib/actions/estudiantes"
import { getAcudientes } from "@/lib/actions/acudientes"
import { getVinculosEstudiantes } from "@/lib/actions/cuentas"
import { getPerfilActual } from "@/lib/actions/perfil"
import { EstudianteFormDialog } from "@/components/dashboard/estudiantes/estudiante-form-dialog"
import { EstudiantesTable } from "@/components/dashboard/estudiantes/estudiantes-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EstudiantesPage() {
  const [estudiantes, acudientes, vinculos, perfil] = await Promise.all([
    getEstudiantes(),
    getAcudientes(),
    getVinculosEstudiantes(),
    getPerfilActual(),
  ])

  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estudiantes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el registro de estudiantes.
          </p>
        </div>
        {esAdmin && <EstudianteFormDialog acudientes={acudientes} />}
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
