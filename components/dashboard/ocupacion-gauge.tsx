import { MoreHorizontal } from "lucide-react"

import { AnimatedNumber } from "@/components/dashboard/animated-number"
import type { OcupacionCupos } from "@/lib/actions/dashboard"

export function OcupacionGauge({
  ocupacion,
  periodo,
}: {
  ocupacion: OcupacionCupos
  periodo: string
}) {
  const circumference = 2 * Math.PI * 40
  const offset = circumference * (1 - ocupacion.porcentaje / 100)

  return (
    <div className="glass-card flex flex-col rounded-2xl p-6 lg:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ocupación de cupos</h3>
          <p className="font-label-mono text-[11px] text-muted-foreground">{periodo}</p>
        </div>
        <button className="flex size-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10">
          <MoreHorizontal className="size-4.5" />
        </button>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center gap-8 md:flex-row">
        <div className="relative w-48 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="12"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#0066FF"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
              style={{ filter: "drop-shadow(0 0 8px rgba(0,102,255,0.4))" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-label-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              Ocupado
            </span>
            <span className="text-[36px] leading-none font-bold">
              <AnimatedNumber value={ocupacion.porcentaje} />%
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto">
          <div className="flex items-center justify-between gap-6 rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-primary shadow-[0_0_8px_rgba(0,102,255,0.5)]" />
              <span className="text-sm text-muted-foreground">Matriculados</span>
            </div>
            <span className="font-bold">
              <AnimatedNumber value={ocupacion.matriculados} />
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-white/20" />
              <span className="text-sm text-muted-foreground">Disponibles</span>
            </div>
            <span className="font-bold">
              <AnimatedNumber value={ocupacion.disponibles} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
