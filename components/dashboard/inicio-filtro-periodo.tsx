"use client"

import { useState, useTransition } from "react"
import { CalendarRange, Loader2, Filter, ExternalLink } from "lucide-react"

import { getInicioDashboardData, type InicioDashboardData } from "@/lib/actions/dashboard"
import type { MatriculaConRelaciones } from "@/lib/actions/matriculas"
import type { CuentaPendiente } from "@/lib/actions/cuentas-pendientes"
import type { GrupoConRelaciones } from "@/lib/actions/grupos"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { AiInsightCard } from "@/components/dashboard/ai-insight-card"
import { OcupacionGauge } from "@/components/dashboard/ocupacion-gauge"
import { MatriculasTable } from "@/components/dashboard/matriculas-table"
import { ResumenCards } from "@/components/dashboard/resumen-cards"
import { OcupacionGradoChart } from "@/components/dashboard/ocupacion-grado-chart"
import { GruposLista } from "@/components/dashboard/grupos-lista"
import { MiniCalendario } from "@/components/dashboard/mini-calendario"
import { PendientesPanel } from "@/components/dashboard/pendientes-panel"
import { ProBanner } from "@/components/dashboard/pro-banner"
import type { Database } from "@/lib/types/database.types"

type Periodo = Database["public"]["Tables"]["periodos_academicos"]["Row"]

export function InicioFiltroPeriodo({
  header,
  periodos,
  initialData,
  periodoActivoLabel,
  grupos,
  matriculasPendientes,
  cuentasPendientes,
}: {
  header: React.ReactNode
  periodos: Periodo[]
  initialData: InicioDashboardData
  periodoActivoLabel: string
  grupos: GrupoConRelaciones[]
  matriculasPendientes: MatriculaConRelaciones[]
  cuentasPendientes: CuentaPendiente[]
}) {
  const [data, setData] = useState(initialData)
  const [periodoId, setPeriodoId] = useState("all")
  const [isPending, startTransition] = useTransition()

  const periodoLabel =
    periodoId === "all"
      ? periodoActivoLabel
      : (periodos.find((p) => p.id_periodo === periodoId)?.nombre_periodo ?? "Periodo")

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

  const mostrarPendientes =
    matriculasPendientes.length > 0 || cuentasPendientes.length > 0

  return (
    <div className="flex flex-col gap-5">
      {header}

      <div className="flex flex-wrap items-center gap-2">
        <CalendarRange className="size-4 text-muted-foreground" />
        <span className="font-label-mono text-xs text-muted-foreground uppercase">Periodo</span>
        <Combobox value={periodoId} onValueChange={onPeriodoChange} items={items}>
          <ComboboxTrigger className="h-9 w-52 border-white/10 bg-card/60">
            <ComboboxValue />
          </ComboboxTrigger>
          <ComboboxContent searchPlaceholder="Buscar periodo..." />
        </Combobox>
        {isPending && <Loader2 className="size-4 animate-spin text-primary" />}
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Columna central */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <ResumenCards resumen={data.resumen} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <OcupacionGradoChart datos={data.ocupacionPorGrado} />
          <GruposLista grupos={grupos} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AiInsightCard porcentaje={data.ocupacion.porcentaje} />
          <OcupacionGauge ocupacion={data.ocupacion} periodo={periodoLabel} />
        </div>

        <div className="glass-card flex flex-col rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/5 bg-card/40 p-6">
            <h3 className="text-lg font-semibold">Últimas matrículas</h3>
            <div className="flex gap-2">
              <button className="flex size-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10">
                <Filter className="size-4.5" />
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10">
                <ExternalLink className="size-4.5" />
              </button>
            </div>
          </div>
          <div
            key={data.matriculas.map((m) => m.id_matricula).join("-") || "empty"}
            className="animate-in fade-in p-2 duration-300 sm:p-4"
          >
            <MatriculasTable matriculas={data.matriculas} />
          </div>
        </div>
      </div>

        {/* Columna derecha */}
        <aside className="flex shrink-0 flex-col gap-5 xl:w-[300px]">
          <ProBanner />
          <MiniCalendario />
          {mostrarPendientes && (
            <PendientesPanel matriculas={matriculasPendientes} cuentas={cuentasPendientes} />
          )}
        </aside>
      </div>
    </div>
  )
}
