import { getPeriodos } from "@/lib/actions/periodos"
import { getPerfilActual } from "@/lib/actions/perfil"
import { PeriodoFormDialog } from "@/components/dashboard/academico/periodo-form-dialog"
import { PeriodosTable } from "@/components/dashboard/academico/periodos-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PeriodosPage() {
  const [periodos, perfil] = await Promise.all([getPeriodos(), getPerfilActual()])
  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Periodos académicos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los periodos y su estado.
          </p>
        </div>
        {esAdmin && <PeriodoFormDialog />}
      </div>

      <Card className="glass-card border-0 py-0">
        <CardHeader className="pt-6">
          <CardTitle>Periodos registrados</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <PeriodosTable periodos={periodos} esAdmin={esAdmin} />
        </CardContent>
      </Card>
    </div>
  )
}
