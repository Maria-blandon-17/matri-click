import { getPeriodos, eliminarPeriodo } from "@/lib/actions/periodos"
import { getPerfilActual } from "@/lib/actions/perfil"
import { PeriodoFormDialog } from "@/components/dashboard/academico/periodo-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ESTADO_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  Activo: "default",
  Planeado: "secondary",
  Finalizado: "outline",
}

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

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Periodos registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {periodos.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              Aún no hay periodos registrados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha inicio</TableHead>
                  <TableHead>Fecha fin</TableHead>
                  <TableHead>Estado</TableHead>
                  {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodos.map((periodo) => (
                  <TableRow key={periodo.id_periodo} className="group border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-medium">
                      {periodo.nombre_periodo}
                    </TableCell>
                    <TableCell>
                      {new Date(periodo.fecha_inicio).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell>
                      {new Date(periodo.fecha_fin).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ESTADO_VARIANT[periodo.estado]}>
                        {periodo.estado}
                      </Badge>
                    </TableCell>
                    {esAdmin && (
                      <TableCell className="flex justify-end gap-1">
                        <PeriodoFormDialog periodo={periodo} />
                        <DeleteButton
                          itemLabel={`el periodo "${periodo.nombre_periodo}"`}
                          action={eliminarPeriodo.bind(null, periodo.id_periodo)}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
