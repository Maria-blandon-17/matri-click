import Link from "next/link"
import { ClipboardList, GraduationCap, Plus, TriangleAlert } from "lucide-react"

import type { EstudianteConAcudiente } from "@/lib/actions/estudiantes"
import type { MatriculaConRelaciones } from "@/lib/actions/matriculas"
import type { RolUsuario } from "@/lib/types/database.types"
import { EstadoMatriculaBadge } from "@/components/dashboard/estado-matricula-badge"

type Registro = {
  estudiante: {
    id_estudiante: string
    nombres: string
    apellidos: string
    tipo_documento: string
    documento: string
  }
  matricula: MatriculaConRelaciones | null
}

/**
 * Une dos fuentes: `estudiantes` (los vinculados a la cuenta, vía `id_acudiente` — se muestran
 * aunque todavía no tengan matrícula) y `matriculas` (ahora incluye, desde la migración 0012/13,
 * las que el propio acudiente solicitó para CUALQUIER estudiante, esté vinculado o no). Un
 * estudiante que el acudiente registró por su cuenta pero que no está formalmente vinculado
 * aparece igual, con los datos que trae su matrícula. `matriculas` ya llega ordenada por fecha
 * descendente (`getMatriculas()`), así que la primera que se encuentra por estudiante es la más
 * reciente.
 */
function construirRegistros(
  estudiantes: EstudianteConAcudiente[],
  matriculas: MatriculaConRelaciones[]
): Registro[] {
  const porEstudiante = new Map<string, Registro>()

  for (const e of estudiantes) {
    porEstudiante.set(e.id_estudiante, { estudiante: e, matricula: null })
  }

  for (const m of matriculas) {
    if (!m.estudiantes) continue
    const actual = porEstudiante.get(m.id_estudiante)
    if (actual) {
      if (!actual.matricula) actual.matricula = m
    } else {
      porEstudiante.set(m.id_estudiante, {
        estudiante: {
          id_estudiante: m.id_estudiante,
          nombres: m.estudiantes.nombres,
          apellidos: m.estudiantes.apellidos,
          tipo_documento: m.estudiantes.tipo_documento,
          documento: m.estudiantes.documento,
        },
        matricula: m,
      })
    }
  }

  return [...porEstudiante.values()].sort((a, b) =>
    a.estudiante.apellidos.localeCompare(b.estudiante.apellidos, "es")
  )
}

export function InicioPersonal({
  vinculado,
  rol,
  estudiantes,
  matriculas,
}: {
  vinculado: boolean
  rol: RolUsuario
  estudiantes: EstudianteConAcudiente[]
  matriculas: MatriculaConRelaciones[]
}) {
  if (!vinculado) {
    return (
      <div className="glass-card flex items-start gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <h3 className="font-semibold text-amber-600 dark:text-amber-400">
            Cuenta pendiente de vinculación
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu cuenta aún no está vinculada a un registro académico. Contacta al administrador
            de tu institución para completar la vinculación.
          </p>
        </div>
      </div>
    )
  }

  const puedeSolicitar = rol === "acudiente"
  const registros = construirRegistros(estudiantes, matriculas)

  const botonSolicitar = puedeSolicitar && (
    <Link
      href="/dashboard/matriculas/nueva"
      className="font-label-mono inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary"
    >
      <Plus className="size-3.5" />
      Solicitar matrícula
    </Link>
  )

  if (registros.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {puedeSolicitar && <div className="flex justify-end">{botonSolicitar}</div>}
        <div className="glass-card rounded-2xl p-6 text-sm text-muted-foreground">
          No tienes estudiantes a tu cargo todavía.{" "}
          {puedeSolicitar && "Solicita una matrícula para empezar."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {puedeSolicitar && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {registros.length} {registros.length === 1 ? "estudiante" : "estudiantes"} a tu cargo
            o que has registrado.
          </p>
          {botonSolicitar}
        </div>
      )}

      {registros.map(({ estudiante, matricula }) => (
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

          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
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

          {matricula?.motivo_estado && (
            <p className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {matricula.estado_matricula === "Rechazada" ? "Motivo del rechazo: " : "Motivo: "}
              </span>
              {matricula.motivo_estado}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
