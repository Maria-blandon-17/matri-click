import {
  TriangleAlert,
  LoaderCircle,
  Send,
  FileSearch,
  CircleCheck,
  CircleX,
  Ban,
  Flag,
  Clock,
  Circle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type StatusVariant =
  | "pending"
  | "in-progress"
  | "submitted"
  | "in-review"
  | "success"
  | "failed"
  | "canceled"
  | "finished"
  | "expired"
  | "neutral"

const VARIANTS: Record<StatusVariant, { className: string; icon: LucideIcon }> = {
  pending: { className: "bg-amber-500/10 text-amber-400", icon: TriangleAlert },
  "in-progress": { className: "bg-blue-500/10 text-blue-400", icon: LoaderCircle },
  submitted: { className: "bg-violet-500/10 text-violet-400", icon: Send },
  "in-review": { className: "bg-yellow-500/10 text-yellow-400", icon: FileSearch },
  success: { className: "bg-emerald-500/10 text-emerald-400", icon: CircleCheck },
  failed: { className: "bg-red-500/10 text-red-400", icon: CircleX },
  canceled: { className: "bg-rose-500/10 text-rose-400", icon: Ban },
  finished: { className: "bg-slate-500/15 text-slate-300", icon: Flag },
  expired: { className: "bg-slate-500/15 text-slate-400", icon: Clock },
  neutral: { className: "bg-slate-500/15 text-slate-400", icon: Circle },
}

/**
 * Badge de estado compartido (matrículas, estudiantes, periodos, cuentas).
 * Estilo: pill con ícono + fondo suave + texto del color del tono.
 */
export function StatusBadge({
  variant,
  label,
  className,
}: {
  variant: StatusVariant
  label: string
  className?: string
}) {
  const { className: variantClass, icon: Icon } = VARIANTS[variant]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
        variantClass,
        className
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      {label}
    </span>
  )
}
