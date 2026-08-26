import { getSedes } from "@/lib/actions/sedes"
import { getPerfilActual } from "@/lib/actions/perfil"
import { SedeFormDialog } from "@/components/dashboard/sedes/sede-form-dialog"
import { SedesTable } from "@/components/dashboard/sedes/sedes-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SedesPage() {
  const [sedes, perfil] = await Promise.all([getSedes(), getPerfilActual()])
  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sedes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las sedes de la institución.
          </p>
        </div>
        {esAdmin && <SedeFormDialog />}
      </div>

      <Card className="glass-card border-0 py-0">
        <CardHeader className="pt-6">
          <CardTitle>Sedes registradas</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <SedesTable sedes={sedes} esAdmin={esAdmin} />
        </CardContent>
      </Card>
    </div>
  )
}
