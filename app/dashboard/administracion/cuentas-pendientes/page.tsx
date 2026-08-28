import { getCuentasPendientes } from "@/lib/actions/cuentas-pendientes"
import { CuentasPendientesTable } from "@/components/dashboard/administracion/cuentas-pendientes-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CuentasPendientesPage() {
  const cuentas = await getCuentasPendientes()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cuentas pendientes</h1>
        <p className="text-sm text-muted-foreground">
          Personas que crearon su cuenta pero todavía no tienen un registro académico
          vinculado. Acepta para crear su ficha y darles acceso, o rechaza/descarta si no
          corresponde.
        </p>
      </div>

      <Card className="glass-card border-0 py-0">
        <CardHeader className="pt-6">
          <CardTitle>Sin vincular</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <CuentasPendientesTable cuentas={cuentas} />
        </CardContent>
      </Card>
    </div>
  )
}
