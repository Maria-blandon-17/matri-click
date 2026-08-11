import { getAcudientes, eliminarAcudiente } from "@/lib/actions/acudientes"
import { getVinculosAcudientes, vincularAcudiente } from "@/lib/actions/cuentas"
import { getPerfilActual } from "@/lib/actions/perfil"
import { AcudienteFormDialog } from "@/components/dashboard/administracion/acudiente-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { CuentaVinculoCell } from "@/components/dashboard/cuenta-vinculo-cell"
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
          <h1 className="text-2xl font-semibold tracking-tight">Acudientes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los padres, madres y tutores de los estudiantes.
          </p>
        </div>
        {esAdmin && <AcudienteFormDialog />}
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Acudientes registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {acudientes.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              Aún no hay acudientes registrados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead>Correo</TableHead>
                  {esAdmin && <TableHead>Cuenta</TableHead>}
                  {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {acudientes.map((acudiente) => (
                  <TableRow key={acudiente.id_acudiente} className="group border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-medium">
                      {acudiente.nombres} {acudiente.apellidos}
                    </TableCell>
                    <TableCell>
                      {acudiente.tipo_documento} {acudiente.documento}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{acudiente.parentesco}</Badge>
                    </TableCell>
                    <TableCell>{acudiente.correo_electronico ?? "—"}</TableCell>
                    {esAdmin && (
                      <TableCell>
                        <CuentaVinculoCell
                          registroId={acudiente.id_acudiente}
                          vinculado={vinculos.vinculados[acudiente.id_acudiente]}
                          pendientes={vinculos.pendientes}
                          vincularAction={vincularAcudiente}
                        />
                      </TableCell>
                    )}
                    {esAdmin && (
                      <TableCell className="flex justify-end gap-1">
                        <AcudienteFormDialog acudiente={acudiente} />
                        <DeleteButton
                          itemLabel={`a ${acudiente.nombres} ${acudiente.apellidos}`}
                          action={eliminarAcudiente.bind(null, acudiente.id_acudiente)}
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
