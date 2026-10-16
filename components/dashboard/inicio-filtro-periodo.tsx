"use client"

import { useMemo, useState, useTransition } from "react"
import { CalendarRange, Loader2 } from "lucide-react"

import { getInicioDashboardData, type InicioDashboardData } from "@/lib/actions/dashboard"
import type { MatriculaConRelaciones } from "@/lib/actions/matriculas"
import type { CuentaPendiente } from "@/lib/actions/cuentas-pendientes"
import type { GrupoConRelaciones } from "@/lib/actions/grupos"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { MatriculasTable } from "@/components/dashboard/matriculas-table"
import { OcupacionResumenCard } from "@/components/dashboard/ocupacion-resumen-card"
import { AtencionPanel } from "@/components/dashboard/atencion-panel"
import { GruposLista } from "@/components/dashboard/grupos-lista"
import type { Database } from "@/lib/types/database.types"

type Periodo = Database["public"]["Tables"]["periodos_academicos"]["Row"]

function diasParaCierre(periodo: Periodo | undefined): number | null {
  if (!periodo) return null
  const dias = Math.ceil((new Date(periodo.fecha_fin).getTime() - Date.now()) / 86_400_000)
  return dias >= 0 ? dias : null
}

export function InicioFiltroPeriodo({
  header,
  periodos,
  initialData,
  periodoActivoLabel,
  grupos,
  esAdmin,
  matriculasPendientes,
  cuentasPendientes,
}: {
  header: React.ReactNode
  periodos: Periodo[]
  initialData: InicioDashboardData
  periodoActivoLabel: string
  grupos: GrupoConRelaciones[]
  esAdmin: boolean
  matriculasPendientes: MatriculaConRelaciones[]
  cuentasPendientes: CuentaPendiente[]
}) {
  const [data, setData] = useState(initialData)
  const [periodoId, setPeriodoId] = useState("all")
  const [isPending, startTransition] = useTransition()

  const periodoSeleccionado =
    periodoId === "all"
      ? periodos.find((p) => p.nombre_periodo === periodoActivoLabel)
      : periodos.find((p) => p.id_periodo === periodoId)

  const periodoLabel =
    periodoId === "all" ? periodoActivoLabel : (periodoSeleccionado?.nombre_periodo ?? "Periodo")

  const cierre = useMemo(() => diasParaCierre(periodoSeleccionado), [periodoSeleccionado])

  const items = Object.fromEntries([
    ["all", "Todos los periodos"],
    ...periodos.map((p) => [p.id_periodo, p.nombre_periodo]),
  ])

  function onPeriodoChange(value: string) {
    setPeriodoId(value)
    startTransition(async () => {
      const next = await getInicioDashboardData(value === "all" ? undefined : value)
      setData(next)
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        {header}
        <div className="flex flex-wrap items-center gap-2">
          {cierre !== null && (
            <span className="font-label-mono rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-600 dark:text-amber-400">
              {periodoLabel} cierra en {cierre} {cierre === 1 ? "día" : "días"}
            </span>
          )}
          <CalendarRange className="size-4 text-muted-foreground" />
          <Combobox value={periodoId} onValueChange={onPeriodoChange} items={items}>
            <ComboboxTrigger className="h-9 w-52 border-border bg-card/60">
              <ComboboxValue />
            </ComboboxTrigger>
            <ComboboxContent searchPlaceholder="Buscar periodo..." />
          </Combobox>
          {isPending && <Loader2 className="size-4 animate-spin text-primary" />}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <OcupacionResumenCard
          ocupacion={data.ocupacion}
          ocupacionPorGrado={data.ocupacionPorGrado}
          grupos={data.resumen.academico.grupos}
          grados={data.resumen.academico.grados}
          periodoLabel={periodoLabel}
        />
        <AtencionPanel
          esAdmin={esAdmin}
          matriculasPendientes={matriculasPendientes}
          cuentasPendientes={cuentasPendientes}
          resumen={data.resumen}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.5fr]">
        <GruposLista grupos={grupos} />

        <section className="glass-card flex flex-col rounded-2xl">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h3 className="text-base font-bold">Últimas matrículas</h3>
            <a
              href="/dashboard/matriculas"
              className="font-label-mono text-[11px] text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground"
            >
              Ver todas
            </a>
          </div>
          <div
            key={data.matriculas.map((m) => m.id_matricula).join("-") || "empty"}
            className="animate-in fade-in p-2 duration-300 sm:p-4"
          >
            <MatriculasTable matriculas={data.matriculas} />
          </div>
        </section>
      </div>
    </div>
  )
}
