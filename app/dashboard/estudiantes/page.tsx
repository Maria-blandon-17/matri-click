import { getEstudiantes, eliminarEstudiante } from "@/lib/actions/estudiantes"
import { getAcudientes } from "@/lib/actions/acudientes"
import { EstudianteFormDialog } from "@/components/dashboard/estudiantes/estudiante-form-dialog"
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
  Graduado: "secondary",
  Retirado: "outline",
}

export default async function EstudiantesPage() {
  const [estudiantes, acudientes] = await Promise.all([
    getEstudiantes(),
    getAcudientes(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estudiantes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el registro de estudiantes.
          </p>
        </div>
        <EstudianteFormDialog acudientes={acudientes} />
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Estudiantes registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {estudiantes.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              Aún no hay estudiantes registrados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Acudiente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-20 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudiantes.map((estudiante) => (
                  <TableRow key={estudiante.id_estudiante} className="group border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-medium">
                      {estudiante.nombres} {estudiante.apellidos}
                    </TableCell>
                    <TableCell>
                      {estudiante.tipo_documento} {estudiante.documento}
                    </TableCell>
                    <TableCell>
                      {estudiante.acudientes
                        ? `${estudiante.acudientes.nombres} ${estudiante.acudientes.apellidos}`
                        : "Sin asignar"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ESTADO_VARIANT[estudiante.estado_estudiante]}>
                        {estudiante.estado_estudiante}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <EstudianteFormDialog
                        estudiante={estudiante}
                        acudientes={acudientes}
                      />
                      <DeleteButton
                        itemLabel={`a ${estudiante.nombres} ${estudiante.apellidos}`}
                        action={eliminarEstudiante.bind(null, estudiante.id_estudiante)}
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
