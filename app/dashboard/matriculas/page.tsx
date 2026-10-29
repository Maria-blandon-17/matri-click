import Link from "next/link"
import { Plus } from "lucide-react"

import { getMatriculas } from "@/lib/actions/matriculas"
import { getPeriodos } from "@/lib/actions/periodos"
import { getPerfilActual } from "@/lib/actions/perfil"
import { MatriculasFilters } from "@/components/dashboard/matriculas/matriculas-filters"
import { MatriculasRegistroTable } from "@/components/dashboard/matriculas/matriculas-registro-table"
import { Button } from "@/components/ui/button"
import type { EstadoMatricula } from "@/lib/types/database.types"

export default async function MatriculasPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string; estado?: string }>
}) {
  const params = await searchParams
  const [matriculas, periodos, perfil] = await Promise.all([
    getMatriculas({
      idPeriodo: params.periodo,
      estado: params.estado as EstadoMatricula | undefined,
    }),
    getPeriodos(),
    getPerfilActual(),
  ])

  const esAdmin = perfil?.rol === "admin"
  const esAcudiente = perfil?.rol === "acudiente"
  const hayFiltro = Boolean(params.periodo || params.estado)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Registro de matrículas
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {matriculas.length} {hayFiltro ? "resultado" : "registrada"}
              {matriculas.length === 1 ? "" : "s"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            {esAcudiente
              ? "Consulta el estado de las matrículas de tu(s) estudiante(s)."
              : "Gestione y audite el estado de los estudiantes matriculados."}
          </p>
        </div>
        {(esAdmin || esAcudiente) && (
          <Button
            className="neon-button"
            nativeButton={false}
            render={
              <Link href="/dashboard/matriculas/nueva">
                <Plus className="size-4" />
                {esAdmin ? "Nueva matrícula" : "Solicitar matrícula"}
              </Link>
            }
          />
        )}
      </div>

      <div className="glass-card flex flex-col overflow-hidden rounded-xl">
        <MatriculasFilters periodos={periodos} />
        <MatriculasRegistroTable matriculas={matriculas} esAdmin={esAdmin} />
      </div>
    </div>
  )
}
