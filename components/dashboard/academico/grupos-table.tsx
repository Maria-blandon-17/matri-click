"use client"

import { eliminarGrupo, type GrupoConRelaciones } from "@/lib/actions/grupos"
import { GrupoFormDialog } from "@/components/dashboard/academico/grupo-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/types/database.types"

type Grado = Database["public"]["Tables"]["grados"]["Row"]
type Sede = Database["public"]["Tables"]["sedes"]["Row"]
type Profesor = Database["public"]["Tables"]["profesores"]["Row"]

export function GruposTable({
  grupos,
  grados,
  sedes,
  profesores,
  esAdmin,
}: {
  grupos: GrupoConRelaciones[]
  grados: Grado[]
  sedes: Sede[]
  profesores: Profesor[]
  esAdmin: boolean
}) {
  return (
    <DataTable
      data={grupos}
      emptyMessage="Aún no hay grupos registrados."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead>Grupo</TableHead>
          <TableHead>Grado</TableHead>
          <TableHead>Sede</TableHead>
          <TableHead>Cupo</TableHead>
          <TableHead>Director</TableHead>
          {esAdmin && <TableHead className="w-20 text-right">Acciones</TableHead>}
        </TableRow>
      }
      renderRow={(grupo) => (
        <TableRow key={grupo.id_grupo} className="group border-white/5 hover:bg-white/[0.03]">
          <TableCell className="font-medium">{grupo.nombre_grupo}</TableCell>
          <TableCell>{grupo.grados?.nombre_grado ?? "—"}</TableCell>
          <TableCell>{grupo.sedes?.nombre_sede ?? "—"}</TableCell>
          <TableCell>{grupo.cupo_maximo}</TableCell>
          <TableCell>
            {grupo.profesores
              ? `${grupo.profesores.nombres} ${grupo.profesores.apellidos}`
              : "Sin asignar"}
          </TableCell>
          {esAdmin && (
            <TableCell className="flex justify-end gap-1">
              <GrupoFormDialog grupo={grupo} grados={grados} sedes={sedes} profesores={profesores} />
              <DeleteButton
                itemLabel={`el grupo "${grupo.nombre_grupo}"`}
                action={eliminarGrupo.bind(null, grupo.id_grupo)}
              />
            </TableCell>
          )}
        </TableRow>
      )}
    />
  )
}
