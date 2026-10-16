import { CircleAlert, CircleCheck, CircleHelp } from "lucide-react"

import type { EstadoVinculoSolicitud } from "@/lib/matriculas-vinculo"

const CONFIG: Record<
  EstadoVinculoSolicitud,
  { label: string; className: string; icon: typeof CircleAlert }
> = {
  "vinculado-otro": {
    label: "Vinculado a otro acudiente",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    icon: CircleAlert,
  },
  "sin-acudiente": {
    label: "Sin acudiente asignado",
    className: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    icon: CircleHelp,
  },
  "vinculado-mismo": {
    label: "Es su acudiente registrado",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CircleCheck,
  },
}

/**
 * Señal visual (ver ROADMAP.md 2026-10-15) de si el estudiante de una
 * solicitud de matrícula ya está vinculado formalmente a un acudiente, y si
 * es o no el mismo que la solicitó. `vinculado-otro` es el caso que bloquea
 * la aprobación en `actualizarEstadoMatricula` — este badge es lo que le
 * deja ver al admin el motivo *antes* de intentar aprobar.
 */
export function VinculoSolicitudBadge({ estado }: { estado: EstadoVinculoSolicitud }) {
  const { label, className, icon: Icon } = CONFIG[estado]
  return (
    <span
      className={`font-label-mono mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${className}`}
    >
      <Icon className="size-3 shrink-0" />
      {label}
    </span>
  )
}
