"use client"

import { eliminarProfesor } from "@/lib/actions/profesores"
import { vincularProfesor, type VinculosPorRol } from "@/lib/actions/cuentas"
import { ProfesorFormDialog } from "@/components/dashboard/administracion/profesor-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { CuentaVinculoCell } from "@/components/dashboard/cuenta-vinculo-cell"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/types/database.types"

type Profesor = Database["public"]["Tables"]["profesores"]["Row"]

export function ProfesoresTable({
  profesores,
  vinculos,
  esAdmin,
}: {
  profesores: Profesor[]
  vinculos: VinculosPorRol
  esAdmin: boolean
}) {
  return (
    <DataTable
      data={profesores}
      emptyMessage="Aún no hay profesores registrados."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead>Nombre</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Estado</TableHead>
          {esAdmin && <TableHead>Cuenta</TableHead>}
          {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
        </TableRow>
      }
      renderRow={(profesor) => (
        <TableRow key={profesor.id_profesor} className="group border-white/5 hover:bg-white/[0.03]">
          <TableCell className="font-medium">
            {profesor.nombres} {profesor.apellidos}
          </TableCell>
          <TableCell>{profesor.documento}</TableCell>
          <TableCell>{profesor.correo_electronico ?? "—"}</TableCell>
          <TableCell>
            <Badge variant={profesor.estado_profesor === "Activo" ? "default" : "outline"}>
              {profesor.estado_profesor}
            </Badge>
          </TableCell>
          {esAdmin && (
            <TableCell>
              <CuentaVinculoCell
                registroId={profesor.id_profesor}
                vinculado={vinculos.vinculados[profesor.id_profesor]}
                pendientes={vinculos.pendientes}
                vincularAction={vincularProfesor}
              />
            </TableCell>
          )}
          {esAdmin && (
            <TableCell className="flex justify-end gap-1">
              <ProfesorFormDialog profesor={profesor} />
              <DeleteButton
                itemLabel={`a ${profesor.nombres} ${profesor.apellidos}`}
                action={eliminarProfesor.bind(null, profesor.id_profesor)}
              />
            </TableCell>
          )}
        </TableRow>
      )}
    />
  )
}
