import { Users, ClipboardCheck, ClipboardList, School, Filter, ExternalLink } from "lucide-react"

import { getDashboardKpis, getUltimasMatriculas, getOcupacionCupos } from "@/lib/actions/dashboard"
import { getPeriodos } from "@/lib/actions/periodos"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { AiInsightCard } from "@/components/dashboard/ai-insight-card"
import { OcupacionGauge } from "@/components/dashboard/ocupacion-gauge"
import { MatriculasTable } from "@/components/dashboard/matriculas-table"

export default async function InicioPage() {
  const [kpis, matriculas, ocupacion, periodos] = await Promise.all([
    getDashboardKpis(),
    getUltimasMatriculas(),
    getOcupacionCupos(),
    getPeriodos(),
  ])

  const periodoActivo = periodos.find((p) => p.estado === "Activo")?.nombre_periodo ?? "Sin periodo activo"

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-card/60 px-3 py-1.5 text-muted-foreground">
          <span className="text-sm">Periodo {periodoActivo}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Estudiantes" value={kpis.estudiantes} icon={Users} />
        <KpiCard label="Matrículas activas" value={kpis.matriculasActivas} icon={ClipboardCheck} />
        <KpiCard label="Total matrículas" value={kpis.totalMatriculas} icon={ClipboardList} />
        <KpiCard label="Grupos" value={kpis.grupos} icon={School} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AiInsightCard porcentaje={ocupacion.porcentaje} />
        <OcupacionGauge ocupacion={ocupacion} periodo={periodoActivo} />
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
        <div className="p-2 sm:p-4">
          <MatriculasTable matriculas={matriculas} />
        </div>
      </div>
    </>
  )
}
