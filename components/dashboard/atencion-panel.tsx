import Link from "next/link"
import { UserRound } from "lucide-react"

import type { MatriculaConRelaciones } from "@/lib/actions/matriculas"
import { estadoVinculoSolicitud } from "@/lib/matriculas-vinculo"
import type { CuentaPendiente } from "@/lib/actions/cuentas-pendientes"
import type { ResumenDominios } from "@/lib/actions/dashboard"
import { VinculoSolicitudBadge } from "@/components/dashboard/matriculas/vinculo-solicitud-badge"

const MAX_FILAS = 3

function nombreEstudiante(m: MatriculaConRelaciones) {
  const e = m.estudiantes
  return e ? `${e.nombres} ${e.apellidos}`.trim() : "Estudiante"
}

/**
 * Columna derecha de la fila hero de /dashboard/inicio — reemplaza al
 * calendario decorativo + banner Pro (que no eran accionables) y absorbe
 * los contadores de Comunidad/Matrículas que antes vivían en ResumenCards
 * (redundantes con esta misma columna). Lo accionable (cuentas y
 * matrículas pendientes de revisar) va primero; los contadores, de
 * referencia, al pie.
 */
export function AtencionPanel({
  esAdmin,
  matriculasPendientes,
  cuentasPendientes,
  resumen,
}: {
  esAdmin: boolean
  matriculasPendientes: MatriculaConRelaciones[]
  cuentasPendientes: CuentaPendiente[]
  resumen: ResumenDominios
}) {
  return (
    <aside className="glass-card flex flex-col gap-5 rounded-2xl p-6">
      <h2 className="text-base font-bold">{esAdmin ? "Necesita tu atención" : "Resumen"}</h2>

      {esAdmin && (
        <>
          <section className="flex flex-col gap-2">
            <p className="font-label-mono text-[10.5px] text-muted-foreground uppercase">
              Cuentas pendientes · {cuentasPendientes.length}
            </p>
            {cuentasPendientes.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin cuentas por vincular.</p>
            ) : (
              cuentasPendientes.slice(0, MAX_FILAS).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-2 border-b border-border py-2 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-semibold">
                      {c.nombreCompleto ?? c.email}
                    </p>
                    <p className="font-label-mono truncate text-[10px] text-muted-foreground uppercase">
                      {c.rol}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/administracion/cuentas-pendientes"
                    className="shrink-0 text-[11px] text-primary"
                  >
                    Revisar
                  </Link>
                </div>
              ))
            )}
          </section>

          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="font-label-mono text-[10.5px] text-muted-foreground uppercase">
              Matrículas pendientes · {matriculasPendientes.length}
            </p>
            {matriculasPendientes.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin solicitudes pendientes.</p>
            ) : (
              matriculasPendientes.slice(0, MAX_FILAS).map((m) => {
                const vinculo = estadoVinculoSolicitud(m)
                return (
                  <div
                    key={m.id_matricula}
                    className="flex items-center justify-between gap-2 border-b border-border py-2 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-semibold">{nombreEstudiante(m)}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {m.grupos?.nombre_grupo ?? "Sin grupo"}
                      </p>
                      {m.acudiente_solicitante && (
                        <p className="font-label-mono mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-400">
                          <UserRound className="size-3 shrink-0" />
                          {m.acudiente_solicitante.nombres} {m.acudiente_solicitante.apellidos}
                        </p>
                      )}
                      {/* Solo se resalta acá el caso que de verdad necesita acción (bloquea la
                          aprobación) — "sin acudiente" y "es su acudiente" se ven en la tabla
                          completa de /dashboard/matriculas, no hacía falta repetirlos en este
                          panel compacto. */}
                      {vinculo === "vinculado-otro" && (
                        <div className="mt-1">
                          <VinculoSolicitudBadge estado={vinculo} />
                        </div>
                      )}
                    </div>
                    <Link
                      href="/dashboard/matriculas"
                      className="shrink-0 text-[11px] text-primary"
                    >
                      Revisar
                    </Link>
                  </div>
                )
              })
            )}
          </section>
        </>
      )}

      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <p className="font-label-mono mb-1 text-[10.5px] text-muted-foreground uppercase">
          Comunidad
        </p>
        <div className="flex justify-between py-0.5 text-[12.5px]">
          <span className="text-muted-foreground">Estudiantes</span>
          <span className="font-bold">{resumen.comunidad.estudiantes}</span>
        </div>
        <div className="flex justify-between py-0.5 text-[12.5px]">
          <span className="text-muted-foreground">Acudientes</span>
          <span className="font-bold">{resumen.comunidad.acudientes}</span>
        </div>
        <div className="flex justify-between py-0.5 text-[12.5px]">
          <span className="text-muted-foreground">Profesores</span>
          <span className="font-bold">{resumen.comunidad.profesores}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <p className="font-label-mono mb-1 text-[10.5px] text-muted-foreground uppercase">
          Matrículas
        </p>
        <div className="flex justify-between py-0.5 text-[12.5px]">
          <span className="text-muted-foreground">Total este periodo</span>
          <span className="font-bold">{resumen.matriculas.total}</span>
        </div>
        <div className="flex justify-between py-0.5 text-[12.5px]">
          <span className="text-muted-foreground">Activas</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {resumen.matriculas.activas}
          </span>
        </div>
        <div className="flex justify-between py-0.5 text-[12.5px]">
          <span className="text-muted-foreground">Pendientes</span>
          <span className="font-bold">{resumen.matriculas.pendientes}</span>
        </div>
      </div>
    </aside>
  )
}
