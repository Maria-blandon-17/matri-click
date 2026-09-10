import { BarChart3 } from "lucide-react"

import type { OcupacionGrado } from "@/lib/actions/dashboard"
import { cn } from "@/lib/utils"

export function OcupacionGradoChart({ datos }: { datos: OcupacionGrado[] }) {
  const maxPct = datos.reduce((m, d) => Math.max(m, d.porcentaje), 0)
  const promedio =
    datos.length > 0
      ? Math.round(datos.reduce((s, d) => s + d.porcentaje, 0) / datos.length)
      : 0

  return (
    <div className="glass-card flex flex-col rounded-2xl p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <BarChart3 className="size-4 text-primary" />
          Ocupación por grado
        </h3>
        <span className="font-label-mono rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-muted-foreground">
          Prom. {promedio}%
        </span>
      </div>
      <p className="mb-6 text-[11px] text-muted-foreground">
        % de cupos ocupados por grado en el periodo seleccionado
      </p>

      {datos.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-8 text-xs text-muted-foreground">
          Aún no hay grados con grupos.
        </div>
      ) : (
        <div className="flex h-40 items-end justify-between gap-2 border-b border-white/5 px-1 pb-2">
          {datos.map((d) => {
            const esMax = d.porcentaje === maxPct && maxPct > 0
            return (
              <div
                key={d.grado}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                title={`${d.grado}: ${d.matriculados}/${d.cupo} (${d.porcentaje}%)`}
              >
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {d.porcentaje}%
                </span>
                <div
                  className={cn(
                    "w-2.5 rounded-full transition-[height]",
                    esMax ? "bg-primary shadow-[0_0_10px_rgba(43,102,255,0.4)]" : "bg-primary/30"
                  )}
                  style={{ height: `${Math.max(d.porcentaje, 2)}%` }}
                />
                <span className="w-full truncate text-center text-[10px] text-muted-foreground">
                  {d.grado}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
