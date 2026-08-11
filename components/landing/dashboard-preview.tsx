import { Users, ClipboardCheck, ClipboardList, School, Filter, ExternalLink } from "lucide-react"

import { KpiCard } from "@/components/dashboard/kpi-card"
import { AiInsightCard } from "@/components/dashboard/ai-insight-card"
import { OcupacionGauge } from "@/components/dashboard/ocupacion-gauge"
import { MatriculasTable } from "@/components/dashboard/matriculas-table"
import type { UltimaMatricula } from "@/lib/actions/dashboard"

// Datos de ejemplo — misma forma que los tipos reales de lib/actions/dashboard.ts. Esta
// sección reutiliza los componentes reales del dashboard (KpiCard, AiInsightCard,
// OcupacionGauge, MatriculasTable) para que la "vista previa" sea un espejo fiel de
// /dashboard/inicio, no un mockup aparte que se pueda desincronizar del producto real.
const kpis = { estudiantes: 248, matriculasActivas: 231, totalMatriculas: 340, grupos: 12 }

const ocupacion = { cupoTotal: 240, matriculados: 198, disponibles: 42, porcentaje: 82 }

const matriculas: UltimaMatricula[] = [
  {
    id_matricula: "preview-1",
    codigo_matricula: "MAT-2024-0198",
    estudiante: "Ana Reyes",
    grupo: "5-A",
    grado: "Quinto",
    periodo: "2024",
    fecha_matricula: "2024-03-31",
    estado_matricula: "Activa",
  },
  {
    id_matricula: "preview-2",
    codigo_matricula: "MAT-2024-0197",
    estudiante: "Carlos Mora",
    grupo: "6-B",
    grado: "Sexto",
    periodo: "2024",
    fecha_matricula: "2024-03-29",
    estado_matricula: "Activa",
  },
  {
    id_matricula: "preview-3",
    codigo_matricula: "MAT-2024-0196",
    estudiante: "Valentina Gómez",
    grupo: "10-1",
    grado: "Décimo",
    periodo: "2024",
    fecha_matricula: "2024-03-27",
    estado_matricula: "Finalizada",
  },
]

export function DashboardPreview() {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="font-label-mono mb-3 text-xs tracking-widest text-muted-foreground uppercase">
          Así se ve por dentro
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Vista previa del panel</h2>
        <div className="mx-auto mt-4 mb-6 h-0.5 w-16 rounded-full bg-primary shadow-[0_0_10px_rgba(0,102,255,0.6)]" />
        <p className="text-sm text-muted-foreground">
          Así luce el día a día de tu institución en MatriClick.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Estudiantes" value={kpis.estudiantes} icon={Users} />
          <KpiCard label="Matrículas activas" value={kpis.matriculasActivas} icon={ClipboardCheck} />
          <KpiCard label="Total matrículas" value={kpis.totalMatriculas} icon={ClipboardList} />
          <KpiCard label="Grupos" value={kpis.grupos} icon={School} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AiInsightCard porcentaje={ocupacion.porcentaje} />
          <OcupacionGauge ocupacion={ocupacion} periodo="2024" />
        </div>

        <div className="glass-card mb-24 flex flex-col rounded-2xl">
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
      </div>
    </section>
  )
}
