"use client"

import { eliminarAcudiente } from "@/lib/actions/acudientes"
import { vincularAcudiente, type VinculosPorRol } from "@/lib/actions/cuentas"
import { AcudienteFormDialog } from "@/components/dashboard/administracion/acudiente-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { CuentaVinculoCell } from "@/components/dashboard/cuenta-vinculo-cell"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/types/database.types"

type Acudiente = Database["public"]["Tables"]["acudientes"]["Row"]

export function AcudientesTable({
  acudientes,
  vinculos,
  esAdmin,
}: {
  acudientes: Acudiente[]
  vinculos: VinculosPorRol
  esAdmin: boolean
}) {
  return (
    <DataTable
      data={acudientes}
      emptyMessage="Aún no hay acudientes registrados."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead>Nombre</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Parentesco</TableHead>
          <TableHead>Correo</TableHead>
          {esAdmin && <TableHead>Cuenta</TableHead>}
          {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
        </TableRow>
      }
      renderRow={(acudiente) => (
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
      )}
    />
  )
}
