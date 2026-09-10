import Link from "next/link"
import { ClipboardList, UserPlus, ArrowRight } from "lucide-react"

import type { MatriculaConRelaciones } from "@/lib/actions/matriculas"
import type { CuentaPendiente } from "@/lib/actions/cuentas-pendientes"
import { EstadoMatriculaBadge } from "@/components/dashboard/estado-matricula-badge"
import { StatusBadge } from "@/components/dashboard/status-badge"

const MAX_FILAS = 4

function nombreEstudiante(m: MatriculaConRelaciones) {
  const e = m.estudiantes
  return e ? `${e.nombres} ${e.apellidos}`.trim() : "Estudiante"
}

export function PendientesPanel({
  matriculas,
  cuentas,
}: {
  matriculas: MatriculaConRelaciones[]
  cuentas: CuentaPendiente[]
}) {
  return (
    <div className="glass-card flex flex-col divide-y divide-white/5 rounded-2xl">
      {/* Matrículas pendientes */}
      <section className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="size-4 text-primary" />
            Matrículas pendientes
            {matriculas.length > 0 && (
              <span className="font-label-mono rounded-full bg-amber-400/15 px-1.5 text-[10px] font-bold text-amber-400">
                {matriculas.length}
              </span>
            )}
          </h3>
          <Link
            href="/dashboard/matriculas"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Ver todas las matrículas"
          >
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {matriculas.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sin solicitudes pendientes.</p>
        ) : (
          <ul className="space-y-2.5">
            {matriculas.slice(0, MAX_FILAS).map((m) => (
              <li key={m.id_matricula} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{nombreEstudiante(m)}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {m.grupos?.nombre_grupo ?? "Sin grupo"}
                  </p>
                </div>
                <EstadoMatriculaBadge estado={m.estado_matricula} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Cuentas pendientes */}
      <section className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <UserPlus className="size-4 text-primary" />
            Cuentas pendientes
            {cuentas.length > 0 && (
              <span className="font-label-mono rounded-full bg-amber-400/15 px-1.5 text-[10px] font-bold text-amber-400">
                {cuentas.length}
              </span>
            )}
          </h3>
          <Link
            href="/dashboard/administracion/cuentas-pendientes"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Ver todas las cuentas pendientes"
          >
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {cuentas.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sin cuentas por vincular.</p>
        ) : (
          <ul className="space-y-2.5">
            {cuentas.slice(0, MAX_FILAS).map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{c.nombreCompleto ?? c.email}</p>
                  <p className="font-label-mono truncate text-[10px] text-muted-foreground uppercase">
                    {c.rol}
                  </p>
                </div>
                <StatusBadge variant="pending" label="Pendiente" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
