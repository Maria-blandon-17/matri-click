import { getProfesores } from "@/lib/actions/profesores"
import { getVinculosProfesores } from "@/lib/actions/cuentas"
import { getPerfilActual } from "@/lib/actions/perfil"
import { ProfesorFormDialog } from "@/components/dashboard/administracion/profesor-form-dialog"
import { ProfesoresTable } from "@/components/dashboard/administracion/profesores-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfesoresPage() {
  const [profesores, vinculos, perfil] = await Promise.all([
    getProfesores(),
    getVinculosProfesores(),
    getPerfilActual(),
  ])

  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Profesores
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {profesores.length} registrado{profesores.length === 1 ? "" : "s"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el cuerpo docente de la institución.
          </p>
        </div>
        {esAdmin && <ProfesorFormDialog />}
      </div>

      <Card className="glass-card border-0 py-0">
        <CardHeader className="pt-6">
          <CardTitle>Profesores registrados</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <ProfesoresTable profesores={profesores} vinculos={vinculos} esAdmin={esAdmin} />
        </CardContent>
      </Card>
    </div>
  )
}
