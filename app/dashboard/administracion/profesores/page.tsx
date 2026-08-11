import { getProfesores, eliminarProfesor } from "@/lib/actions/profesores"
import { ProfesorFormDialog } from "@/components/dashboard/administracion/profesor-form-dialog"
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

export default async function ProfesoresPage() {
  const profesores = await getProfesores()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profesores</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el cuerpo docente de la institución.
          </p>
        </div>
        <ProfesorFormDialog />
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Profesores registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {profesores.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              Aún no hay profesores registrados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-20 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profesores.map((profesor) => (
                  <TableRow key={profesor.id_profesor} className="group border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-medium">
                      {profesor.nombres} {profesor.apellidos}
                    </TableCell>
                    <TableCell>{profesor.documento}</TableCell>
                    <TableCell>{profesor.correo_electronico ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          profesor.estado_profesor === "Activo" ? "default" : "outline"
                        }
                      >
                        {profesor.estado_profesor}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <ProfesorFormDialog profesor={profesor} />
                      <DeleteButton
                        itemLabel={`a ${profesor.nombres} ${profesor.apellidos}`}
                        action={eliminarProfesor.bind(null, profesor.id_profesor)}
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
