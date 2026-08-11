import { ArrowUp, ArrowLeftRight, Tag, Filter, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const actividad = [
  { iniciales: "AR", nombre: "Ana Reyes", grupo: "5-A", fecha: "31 Mar, 3:20 PM", estado: "Activo" },
  { iniciales: "CM", nombre: "Carlos Mora", grupo: "6-B", fecha: "29 Mar, 5:11 PM", estado: "Pendiente" },
  { iniciales: "TC", nombre: "Tommy C.", grupo: "5-A", fecha: "27 Mar, 2:31 AM", estado: "Activo" },
]

const ESTADO_STYLES: Record<string, string> = {
  Activo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pendiente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

export function DashboardPreview() {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Gauge widget */}
        <div className="glass-card group relative flex flex-col rounded-2xl p-6">
          <div className="mb-6 flex items-start justify-between">
            <h3 className="text-lg font-medium">Matrículas activas</h3>
            <button className="rounded-lg border border-white/5 bg-card/50 p-1.5 opacity-0 transition-colors group-hover:opacity-100 hover:bg-card">
              <ExternalLink className="size-4 text-muted-foreground" />
            </button>
          </div>
          <div className="mb-6 flex items-end gap-3">
            <span className="text-4xl font-bold">417</span>
            <span className="font-label-mono mb-2 flex items-center text-xs text-emerald-400">
              <ArrowUp className="size-3.5" /> 8% mes pasado
            </span>
          </div>
          <div className="relative mt-4 flex min-h-[140px] flex-1 items-center justify-center">
            <svg className="w-full max-w-[200px] overflow-visible" viewBox="0 0 100 50">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#0066FF"
                strokeLinecap="round"
                strokeWidth="12"
                strokeDasharray="251.2"
                strokeDashoffset="105.5"
                style={{ filter: "drop-shadow(0 0 8px rgba(0,102,255,0.4))" }}
              />
            </svg>
            <div className="absolute bottom-2 w-full text-center">
              <span className="font-label-mono block text-[10px] text-muted-foreground uppercase">
                Completado
              </span>
              <span className="mt-1 block text-lg font-medium">58%</span>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary" />
              <span className="font-label-mono text-[10px] text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-white/20" />
              <span className="font-label-mono text-[10px] text-muted-foreground">Meta</span>
            </div>
          </div>
        </div>

        {/* Trend widget */}
        <div className="glass-card group relative flex flex-col rounded-2xl p-6">
          <div className="mb-6 flex items-start justify-between">
            <h3 className="text-lg font-medium">Tendencia de matrículas</h3>
            <button className="rounded-lg border border-white/5 bg-card/50 p-1.5 opacity-0 transition-colors group-hover:opacity-100 hover:bg-card">
              <ExternalLink className="size-4 text-muted-foreground" />
            </button>
          </div>
          <div className="mb-6 flex items-end gap-3">
            <span className="text-4xl font-bold">32</span>
            <span className="font-label-mono mb-2 flex items-center text-xs text-emerald-400">
              <ArrowUp className="size-3.5" /> 12% semanal
            </span>
          </div>
          <div className="mb-4 flex gap-2">
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-card/50 px-3 py-1.5">
              <ArrowLeftRight className="size-3.5 text-muted-foreground" />
              <span className="font-label-mono text-[11px] text-muted-foreground">Nuevas</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-card/50 px-3 py-1.5">
              <Tag className="size-3.5 text-muted-foreground" />
              <span className="font-label-mono text-[11px] text-muted-foreground">Renovaciones</span>
            </div>
          </div>
          <div className="relative mt-auto h-[120px] w-full">
            <svg className="h-full w-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0, 102, 255, 0.3)" />
                  <stop offset="100%" stopColor="rgba(0, 102, 255, 0)" />
                </linearGradient>
              </defs>
              <path
                d="M0 40 Q 20 50, 40 45 T 80 55 T 120 30 T 160 25 T 200 15 L 200 60 L 0 60 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M0 40 Q 20 50, 40 45 T 80 55 T 120 30 T 160 25 T 200 15"
                fill="none"
                stroke="#0066FF"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,102,255,0.4))" }}
              />
              <circle cx="200" cy="15" r="3" fill="#0066FF" />
            </svg>
            <div className="font-label-mono mt-2 flex justify-between px-2 text-[9px] text-muted-foreground">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mié</span>
              <span>Jue</span>
              <span>Vie</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity table */}
      <div className="glass-card mb-24 rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-medium">Actividad reciente</h3>
          <div className="flex gap-2">
            <button className="rounded-lg border border-white/5 bg-card/50 p-2 transition-colors hover:bg-card">
              <Filter className="size-4 text-muted-foreground" />
            </button>
            <button className="rounded-lg border border-white/5 bg-card/50 p-2 transition-colors hover:bg-card">
              <ExternalLink className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 border-b border-white/5 pb-4">
          <span className="font-label-mono text-xs text-muted-foreground">Estudiante</span>
          <span className="font-label-mono text-xs text-muted-foreground">Grupo</span>
          <span className="font-label-mono text-right text-xs text-muted-foreground">Fecha</span>
          <span className="font-label-mono text-right text-xs text-muted-foreground">Estado</span>
        </div>
        <div className="space-y-1">
          {actividad.map((item) => (
            <div
              key={item.nombre}
              className="-mx-2 grid grid-cols-4 items-center gap-4 rounded-lg p-2 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-card font-label-mono text-[10px]">
                  {item.iniciales}
                </div>
                <span className="text-sm font-medium">{item.nombre}</span>
              </div>
              <span className="font-label-mono text-xs text-muted-foreground">{item.grupo}</span>
              <span className="font-label-mono text-right text-xs text-muted-foreground">
                {item.fecha}
              </span>
              <div className="text-right">
                <Badge
                  variant="outline"
                  className={`font-label-mono text-[10px] ${ESTADO_STYLES[item.estado]}`}
                >
                  {item.estado}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
