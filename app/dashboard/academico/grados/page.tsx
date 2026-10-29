import { getGrados } from "@/lib/actions/grados"
import { getPerfilActual } from "@/lib/actions/perfil"
import { GradoFormDialog } from "@/components/dashboard/academico/grado-form-dialog"
import { GradosTable } from "@/components/dashboard/academico/grados-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function GradosPage() {
  const [grados, perfil] = await Promise.all([getGrados(), getPerfilActual()])
  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Grados
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {grados.length} registrado{grados.length === 1 ? "" : "s"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los grados académicos disponibles.
          </p>
        </div>
        {esAdmin && <GradoFormDialog />}
      </div>

      <Card className="glass-card border-0 py-0">
        <CardHeader className="pt-6">
          <CardTitle>Grados registrados</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <GradosTable grados={grados} esAdmin={esAdmin} />
        </CardContent>
      </Card>
    </div>
  )
}
