import { ClipboardList, GraduationCap, TriangleAlert } from "lucide-react"

import type { EstudianteConAcudiente } from "@/lib/actions/estudiantes"
import type { MatriculaConRelaciones } from "@/lib/actions/matriculas"
import { EstadoMatriculaBadge } from "@/components/dashboard/estado-matricula-badge"

export function InicioPersonal({
  vinculado,
  estudiantes,
  matriculas,
}: {
  vinculado: boolean
  estudiantes: EstudianteConAcudiente[]
  matriculas: MatriculaConRelaciones[]
}) {
  if (!vinculado) {
    return (
      <div className="glass-card flex items-start gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-400" />
        <div>
          <h3 className="font-semibold text-amber-400">Cuenta pendiente de vinculación</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu cuenta aún no está vinculada a un registro académico. Contacta al administrador
            de tu institución para completar la vinculación.
          </p>
        </div>
      </div>
    )
  }

  if (estudiantes.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-sm text-muted-foreground">
        No tienes estudiantes registrados a tu cargo todavía.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {estudiantes.map((estudiante) => {
        const matricula = matriculas.find(
          (m) =>
            m.estudiantes?.nombres === estudiante.nombres &&
            m.estudiantes?.apellidos === estudiante.apellidos
        )

        return (
          <div key={estudiante.id_estudiante} className="glass-card rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {estudiante.nombres} {estudiante.apellidos}
                  </h3>
                  <p className="font-label-mono text-xs text-muted-foreground">
                    {estudiante.tipo_documento} {estudiante.documento}
                  </p>
                </div>
              </div>
              {matricula && <EstadoMatriculaBadge estado={matricula.estado_matricula} />}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-white/5 pt-5 sm:grid-cols-3">
              <div>
                <p className="font-label-mono text-[11px] text-muted-foreground uppercase">
                  Grado
                </p>
                <p className="mt-1 text-sm">{matricula?.grupos?.grados?.nombre_grado ?? "—"}</p>
              </div>
              <div>
                <p className="font-label-mono text-[11px] text-muted-foreground uppercase">
                  Grupo
                </p>
                <p className="mt-1 text-sm">{matricula?.grupos?.nombre_grupo ?? "—"}</p>
              </div>
              <div>
                <p className="font-label-mono text-[11px] text-muted-foreground uppercase">
                  Periodo
                </p>
                <p className="mt-1 text-sm">
                  {matricula?.periodos_academicos?.nombre_periodo ?? "—"}
                </p>
              </div>
            </div>

            {!matricula && (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <ClipboardList className="size-4" />
                Sin matrícula registrada todavía.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
