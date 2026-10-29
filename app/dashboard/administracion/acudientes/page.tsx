import { getAcudientes } from "@/lib/actions/acudientes"
import { getVinculosAcudientes } from "@/lib/actions/cuentas"
import { getPerfilActual } from "@/lib/actions/perfil"
import { AcudienteFormDialog } from "@/components/dashboard/administracion/acudiente-form-dialog"
import { AcudientesTable } from "@/components/dashboard/administracion/acudientes-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AcudientesPage() {
  const [acudientes, vinculos, perfil] = await Promise.all([
    getAcudientes(),
    getVinculosAcudientes(),
    getPerfilActual(),
  ])

  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Acudientes
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {acudientes.length} registrado{acudientes.length === 1 ? "" : "s"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los padres, madres y tutores de los estudiantes.
          </p>
        </div>
        {esAdmin && <AcudienteFormDialog />}
      </div>

      <Card className="glass-card border-0 py-0">
        <CardHeader className="pt-6">
          <CardTitle>Acudientes registrados</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <AcudientesTable acudientes={acudientes} vinculos={vinculos} esAdmin={esAdmin} />
        </CardContent>
      </Card>
    </div>
  )
}
