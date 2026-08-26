"use client"

import { eliminarSede } from "@/lib/actions/sedes"
import { SedeFormDialog } from "@/components/dashboard/sedes/sede-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/types/database.types"

type Sede = Database["public"]["Tables"]["sedes"]["Row"]

export function SedesTable({ sedes, esAdmin }: { sedes: Sede[]; esAdmin: boolean }) {
  return (
    <DataTable
      data={sedes}
      emptyMessage="Aún no hay sedes registradas."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead>Nombre</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead>Teléfono</TableHead>
          {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
        </TableRow>
      }
      renderRow={(sede) => (
        <TableRow key={sede.id_sede} className="group border-white/5 hover:bg-white/[0.03]">
          <TableCell className="font-medium">{sede.nombre_sede}</TableCell>
          <TableCell>{sede.direccion ?? "—"}</TableCell>
          <TableCell>{sede.telefono ?? "—"}</TableCell>
          {esAdmin && (
            <TableCell className="flex justify-end gap-1">
              <SedeFormDialog sede={sede} />
              <DeleteButton
                itemLabel={`la sede "${sede.nombre_sede}"`}
                action={eliminarSede.bind(null, sede.id_sede)}
              />
            </TableCell>
          )}
        </TableRow>
      )}
    />
  )
}
