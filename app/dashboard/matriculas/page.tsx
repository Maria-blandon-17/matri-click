import Link from "next/link"
import { Plus } from "lucide-react"

import { getMatriculas, eliminarMatricula } from "@/lib/actions/matriculas"
import { getPeriodos } from "@/lib/actions/periodos"
import { EstadoMatriculaSelect } from "@/components/dashboard/matriculas/estado-matricula-select"
import { MatriculasFilters } from "@/components/dashboard/matriculas/matriculas-filters"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { Button } from "@/components/ui/button"
import type { EstadoMatricula } from "@/lib/types/database.types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export default async function MatriculasPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string; estado?: string }>
}) {
  const params = await searchParams
  const [matriculas, periodos] = await Promise.all([
    getMatriculas({
      idPeriodo: params.periodo,
      estado: params.estado as EstadoMatricula | undefined,
    }),
    getPeriodos(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Registro de matrículas</h1>
          <p className="text-sm text-muted-foreground">
            Gestione y audite el estado de los estudiantes matriculados.
          </p>
        </div>
        <Button
          className="neon-button"
          nativeButton={false}
          render={
            <Link href="/dashboard/matriculas/nueva">
              <Plus className="size-4" />
              Nueva matrícula
            </Link>
          }
        />
      </div>

      <div className="glass-card flex flex-col overflow-hidden rounded-xl">
        <MatriculasFilters periodos={periodos} />

        {matriculas.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            No hay matrículas que coincidan con estos filtros.
          </div>
        ) : (
          <Table>
            <TableHeader>
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
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {matriculas.map((matricula) => (
                <TableRow
                  key={matricula.id_matricula}
                  className="group border-white/5 hover:bg-white/[0.03]"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 text-[11px] font-medium">
                        {iniciales(
                          `${matricula.estudiantes?.nombres ?? ""} ${matricula.estudiantes?.apellidos ?? ""}`
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {matricula.estudiantes?.nombres} {matricula.estudiantes?.apellidos}
                        </p>
                        <p className="font-label-mono text-[10px] text-muted-foreground">
                          {matricula.codigo_matricula}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {matricula.grupos?.nombre_grupo}
                    {matricula.grupos?.grados
                      ? ` — ${matricula.grupos.grados.nombre_grado}`
                      : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {matricula.periodos_academicos?.nombre_periodo}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {new Date(matricula.fecha_matricula).toLocaleDateString("es-CO")}
                  </TableCell>
                  <TableCell>
                    <EstadoMatriculaSelect
                      id={matricula.id_matricula}
                      estado={matricula.estado_matricula}
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteButton
                      itemLabel={`la matrícula "${matricula.codigo_matricula}"`}
                      action={eliminarMatricula.bind(null, matricula.id_matricula)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
