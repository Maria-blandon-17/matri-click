import Link from "next/link"

import { AnimatedNumber } from "@/components/dashboard/animated-number"
import type { OcupacionCupos, OcupacionGrado } from "@/lib/actions/dashboard"

/**
 * Fusiona lo que antes eran tres tarjetas (AiInsightCard, OcupacionGauge,
 * OcupacionGradoChart) en una sola — las tres mostraban el mismo porcentaje
 * de ocupación con distinto empaque, lo cual era puro relleno repetido.
 * El gauge es la fuente visual del número; el ranking por grado reemplaza
 * el bar chart (que con la mayoría de grados en 0% se veía casi vacío).
 */
export function OcupacionResumenCard({
  ocupacion,
  ocupacionPorGrado,
  grupos,
  grados,
  periodoLabel,
}: {
  ocupacion: OcupacionCupos
  ocupacionPorGrado: OcupacionGrado[]
  grupos: number
  grados: number
  periodoLabel: string
}) {
  const circumference = 2 * Math.PI * 40
  const offset = circumference * (1 - ocupacion.porcentaje / 100)
  const ranking = [...ocupacionPorGrado].sort((a, b) => b.porcentaje - a.porcentaje)

  return (
    <section className="glass-card flex flex-col gap-6 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">Ocupación de cupos</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {grupos} {grupos === 1 ? "grupo activo" : "grupos activos"} · {grados}{" "}
            {grados === 1 ? "grado" : "grados"} · {periodoLabel}
          </p>
        </div>
        <Link
          href="/dashboard/academico/grupos"
          className="font-label-mono shrink-0 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Ver académico →
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-8">
        <div className="relative size-[168px] shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[34px] leading-none font-extrabold">
              <AnimatedNumber value={ocupacion.porcentaje} />%
            </span>
            <span className="font-label-mono mt-1 text-[10px] text-muted-foreground uppercase">
              Ocupado
            </span>
          </div>
        </div>

        <div className="flex min-w-[220px] flex-1 flex-col gap-3">
          <p className="text-sm leading-relaxed">
            Tus grupos tienen un <strong className="text-primary">{ocupacion.porcentaje}%</strong>{" "}
            de ocupación total este periodo — hay espacio para{" "}
            <strong><AnimatedNumber value={ocupacion.disponibles} /> cupos</strong> más antes de
            llenar {grupos === 1 ? "el grupo activo" : "los grupos activos"}.
          </p>
          <div className="flex gap-6">
            <div>
              <span className="text-lg font-bold"><AnimatedNumber value={ocupacion.matriculados} /></span>{" "}
              <span className="text-xs text-muted-foreground">matriculados</span>
            </div>
            <div>
              <span className="text-lg font-bold"><AnimatedNumber value={ocupacion.disponibles} /></span>{" "}
              <span className="text-xs text-muted-foreground">disponibles</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-border pt-5">
        <p className="font-label-mono text-[10.5px] text-muted-foreground uppercase">
          Ocupación por grado
        </p>
        {ranking.length === 0 ? (
          <p className="py-2 text-xs text-muted-foreground">Aún no hay grados con grupos.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {ranking.map((g) => (
              <div key={g.grado} className="grid grid-cols-[70px_1fr_34px] items-center gap-3">
                <span className="truncate text-[12.5px] text-muted-foreground">{g.grado}</span>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(g.porcentaje, 2)}%` }}
                  />
                </div>
                <span className="font-label-mono text-right text-[11.5px]">{g.porcentaje}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
