import type { EstadoMatricula } from "@/lib/types/database.types"
import { StatusBadge, type StatusVariant } from "@/components/dashboard/status-badge"

/** Estados de matrícula en orden de ciclo de vida (para selectores y filtros). */
export const ESTADOS_MATRICULA: EstadoMatricula[] = [
  "Pendiente",
  "En revisión",
  "Activa",
  "Rechazada",
  "Cancelada",
  "Finalizada",
  "Expirada",
]

export const VARIANT_BY_ESTADO: Record<EstadoMatricula, StatusVariant> = {
  Pendiente: "pending",
  "En revisión": "in-review",
  Activa: "success",
  Rechazada: "failed",
  Cancelada: "canceled",
  Finalizada: "finished",
  Expirada: "expired",
}

export function EstadoMatriculaBadge({ estado }: { estado: EstadoMatricula }) {
  return <StatusBadge variant={VARIANT_BY_ESTADO[estado]} label={estado} />
}
