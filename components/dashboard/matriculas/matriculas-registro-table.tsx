"use client"

import { Clock } from "lucide-react"

import { eliminarMatricula, type MatriculaConRelaciones } from "@/lib/actions/matriculas"
import { EstadoMatriculaSelect } from "@/components/dashboard/matriculas/estado-matricula-select"
import { EstadoMatriculaBadge } from "@/components/dashboard/estado-matricula-badge"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function MatriculasRegistroTable({
  matriculas,
  esAdmin,
}: {
  matriculas: MatriculaConRelaciones[]
  esAdmin: boolean
}) {
  return (
    <DataTable
      data={matriculas}
      emptyMessage="No hay matrículas que coincidan con estos filtros."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead className="font-label-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Estudiante
          </TableHead>
          <TableHead className="font-label-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Grupo académico
          </TableHead>
          <TableHead className="font-label-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Periodo
          </TableHead>
          <TableHead className="font-label-mono hidden text-[11px] tracking-wider text-muted-foreground uppercase md:table-cell">
            Fecha de ingreso
          </TableHead>
          <TableHead className="font-label-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Estado
          </TableHead>
          {esAdmin && <TableHead className="w-10" />}
        </TableRow>
      }
      renderRow={(matricula) => {
        const pendiente = matricula.estado_matricula === "Pendiente"
        const acudiente = matricula.estudiantes?.acudientes
        return (
          <TableRow
            key={matricula.id_matricula}
            className={cn(
              "group border-white/5 hover:bg-white/[0.03]",
              pendiente && "border-l-2 border-l-amber-400 bg-amber-400/[0.04] hover:bg-amber-400/[0.07]"
            )}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 text-[11px] font-medium">
                  {iniciales(
                    `${matricula.estudiantes?.nombres ?? ""} ${matricula.estudiantes?.apellidos ?? ""}`
                  )}
                </div>
                <div>
                  <p className="flex items-center gap-1.5 font-medium">
                    {pendiente && <Clock className="size-3.5 shrink-0 text-amber-400" />}
                    {matricula.estudiantes?.nombres} {matricula.estudiantes?.apellidos}
                  </p>
                  <p className="font-label-mono text-[10px] text-muted-foreground">
                    {matricula.codigo_matricula}
                    {pendiente && acudiente && ` · Solicitada por ${acudiente.nombres} ${acudiente.apellidos}`}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {matricula.grupos?.nombre_grupo}
              {matricula.grupos?.grados ? ` — ${matricula.grupos.grados.nombre_grado}` : ""}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {matricula.periodos_academicos?.nombre_periodo}
            </TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">
              {new Date(matricula.fecha_matricula).toLocaleDateString("es-CO")}
            </TableCell>
            <TableCell>
              {esAdmin ? (
                <EstadoMatriculaSelect id={matricula.id_matricula} estado={matricula.estado_matricula} />
              ) : (
                <EstadoMatriculaBadge estado={matricula.estado_matricula} />
              )}
            </TableCell>
            {esAdmin && (
              <TableCell>
                <DeleteButton
                  itemLabel={`la matrícula "${matricula.codigo_matricula}"`}
                  action={eliminarMatricula.bind(null, matricula.id_matricula)}
                />
              </TableCell>
            )}
          </TableRow>
        )
      }}
    />
  )
}
