import { getSedes, eliminarSede } from "@/lib/actions/sedes"
import { SedeFormDialog } from "@/components/dashboard/sedes/sede-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function SedesPage() {
  const sedes = await getSedes()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sedes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las sedes de la institución.
          </p>
        </div>
        <SedeFormDialog />
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Sedes registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {sedes.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              Aún no hay sedes registradas.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="w-20 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sedes.map((sede) => (
                  <TableRow key={sede.id_sede} className="group border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-medium">{sede.nombre_sede}</TableCell>
                    <TableCell>{sede.direccion ?? "—"}</TableCell>
                    <TableCell>{sede.telefono ?? "—"}</TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <SedeFormDialog sede={sede} />
                      <DeleteButton
                        itemLabel={`la sede "${sede.nombre_sede}"`}
                        action={eliminarSede.bind(null, sede.id_sede)}
                      />
                    </TableCell>
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
