import type { EstadoMatricula } from "@/lib/types/database.types"
import { cn } from "@/lib/utils"

const styles: Record<EstadoMatricula, string> = {
  Activa: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
  Finalizada: "bg-white/5 border-white/10 text-muted-foreground",
  Cancelada: "bg-destructive/10 border-destructive/20 text-destructive",
}

const dotStyles: Record<EstadoMatricula, string> = {
  Activa: "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]",
  Finalizada: "bg-muted-foreground",
  Cancelada: "bg-destructive shadow-[0_0_5px_rgba(255,180,171,0.8)]",
}

export function EstadoMatriculaBadge({ estado }: { estado: EstadoMatricula }) {
  return (
    <span
      className={cn(
        "font-label-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]",
        styles[estado]
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotStyles[estado])} />
      {estado}
    </span>
  )
}
