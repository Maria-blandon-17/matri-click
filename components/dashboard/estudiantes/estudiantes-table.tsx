"use client"

import { eliminarEstudiante, type EstudianteConAcudiente } from "@/lib/actions/estudiantes"
import { vincularEstudiante, type VinculosPorRol } from "@/lib/actions/cuentas"
import { EstudianteFormDialog } from "@/components/dashboard/estudiantes/estudiante-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { CuentaVinculoCell } from "@/components/dashboard/cuenta-vinculo-cell"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/types/database.types"

type Acudiente = Database["public"]["Tables"]["acudientes"]["Row"]

const ESTADO_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  Activo: "default",
  Graduado: "secondary",
  Retirado: "outline",
}

export function EstudiantesTable({
  estudiantes,
  acudientes,
  vinculos,
  esAdmin,
}: {
  estudiantes: EstudianteConAcudiente[]
  acudientes: Acudiente[]
  vinculos: VinculosPorRol
  esAdmin: boolean
}) {
  return (
    <DataTable
      data={estudiantes}
      emptyMessage="Aún no hay estudiantes registrados."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead>Nombre</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Acudiente</TableHead>
          <TableHead>Estado</TableHead>
          {esAdmin && <TableHead>Cuenta</TableHead>}
          {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
        </TableRow>
      }
      renderRow={(estudiante) => (
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
          {esAdmin && (
            <TableCell>
              <CuentaVinculoCell
                registroId={estudiante.id_estudiante}
                vinculado={vinculos.vinculados[estudiante.id_estudiante]}
                pendientes={vinculos.pendientes}
                vincularAction={vincularEstudiante}
              />
            </TableCell>
          )}
          {esAdmin && (
            <TableCell className="flex justify-end gap-1">
              <EstudianteFormDialog estudiante={estudiante} acudientes={acudientes} />
              <DeleteButton
                itemLabel={`a ${estudiante.nombres} ${estudiante.apellidos}`}
                action={eliminarEstudiante.bind(null, estudiante.id_estudiante)}
              />
            </TableCell>
          )}
        </TableRow>
      )}
    />
  )
}
