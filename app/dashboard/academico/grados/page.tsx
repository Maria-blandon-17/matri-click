import { getGrados, eliminarGrado } from "@/lib/actions/grados"
import { GradoFormDialog } from "@/components/dashboard/academico/grado-form-dialog"
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

export default async function GradosPage() {
  const grados = await getGrados()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Grados</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los grados académicos disponibles.
          </p>
        </div>
        <GradoFormDialog />
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Grados registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {grados.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              Aún no hay grados registrados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Nivel educativo</TableHead>
                  <TableHead className="w-20 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grados.map((grado) => (
                  <TableRow key={grado.id_grado} className="group border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-medium">{grado.nombre_grado}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{grado.nivel_educativo}</Badge>
                    </TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <GradoFormDialog grado={grado} />
                      <DeleteButton
                        itemLabel={`el grado "${grado.nombre_grado}"`}
                        action={eliminarGrado.bind(null, grado.id_grado)}
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
