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

// Los tonos *-400 fueron pensados para fondo oscuro (buen contraste sobre
// casi negro); en tarjeta blanca de modo claro bajan de ~2:1 de contraste,
// ilegibles. Cada variante lleva ahora un tono más oscuro por defecto
// (claro) y el *-400 original solo bajo `dark:` (ver CLAUDE.md "Modo
// claro/oscuro del dashboard" — fase 2, /dashboard/inicio).
const VARIANTS: Record<StatusVariant, { className: string; icon: LucideIcon }> = {
  pending: { className: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: TriangleAlert },
  "in-progress": { className: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: LoaderCircle },
  submitted: { className: "bg-violet-500/10 text-violet-600 dark:text-violet-400", icon: Send },
  "in-review": { className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400", icon: FileSearch },
  success: { className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: CircleCheck },
  failed: { className: "bg-red-500/10 text-red-600 dark:text-red-400", icon: CircleX },
  canceled: { className: "bg-rose-500/10 text-rose-600 dark:text-rose-400", icon: Ban },
  finished: { className: "bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300", icon: Flag },
  expired: { className: "bg-slate-500/10 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400", icon: Clock },
  neutral: { className: "bg-slate-500/10 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400", icon: Circle },
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
