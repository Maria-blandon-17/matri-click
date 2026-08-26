"use client"

import { eliminarGrado } from "@/lib/actions/grados"
import { GradoFormDialog } from "@/components/dashboard/academico/grado-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/types/database.types"

type Grado = Database["public"]["Tables"]["grados"]["Row"]

export function GradosTable({ grados, esAdmin }: { grados: Grado[]; esAdmin: boolean }) {
  return (
    <DataTable
      data={grados}
      emptyMessage="Aún no hay grados registrados."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead>Nombre</TableHead>
          <TableHead>Nivel educativo</TableHead>
          {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
        </TableRow>
      }
      renderRow={(grado) => (
        <TableRow key={grado.id_grado} className="group border-white/5 hover:bg-white/[0.03]">
          <TableCell className="font-medium">{grado.nombre_grado}</TableCell>
          <TableCell>
            <Badge variant="secondary">{grado.nivel_educativo}</Badge>
          </TableCell>
          {esAdmin && (
            <TableCell className="flex justify-end gap-1">
              <GradoFormDialog grado={grado} />
              <DeleteButton
                itemLabel={`el grado "${grado.nombre_grado}"`}
                action={eliminarGrado.bind(null, grado.id_grado)}
              />
            </TableCell>
          )}
        </TableRow>
      )}
    />
  )
}
