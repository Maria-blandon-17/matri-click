"use client"

import { eliminarPeriodo } from "@/lib/actions/periodos"
import { PeriodoFormDialog } from "@/components/dashboard/academico/periodo-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/types/database.types"

type Periodo = Database["public"]["Tables"]["periodos_academicos"]["Row"]

const ESTADO_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  Activo: "default",
  Planeado: "secondary",
  Finalizado: "outline",
}

export function PeriodosTable({ periodos, esAdmin }: { periodos: Periodo[]; esAdmin: boolean }) {
  return (
    <DataTable
      data={periodos}
      emptyMessage="Aún no hay periodos registrados."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead>Nombre</TableHead>
          <TableHead>Fecha inicio</TableHead>
          <TableHead>Fecha fin</TableHead>
          <TableHead>Estado</TableHead>
          {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
        </TableRow>
      }
      renderRow={(periodo) => (
        <TableRow key={periodo.id_periodo} className="group border-white/5 hover:bg-white/[0.03]">
          <TableCell className="font-medium">{periodo.nombre_periodo}</TableCell>
          <TableCell>{new Date(periodo.fecha_inicio).toLocaleDateString("es-CO")}</TableCell>
          <TableCell>{new Date(periodo.fecha_fin).toLocaleDateString("es-CO")}</TableCell>
          <TableCell>
            <Badge variant={ESTADO_VARIANT[periodo.estado]}>{periodo.estado}</Badge>
          </TableCell>
          {esAdmin && (
            <TableCell className="flex justify-end gap-1">
              <PeriodoFormDialog periodo={periodo} />
              <DeleteButton
                itemLabel={`el periodo "${periodo.nombre_periodo}"`}
                action={eliminarPeriodo.bind(null, periodo.id_periodo)}
              />
            </TableCell>
          )}
        </TableRow>
      )}
    />
  )
}
