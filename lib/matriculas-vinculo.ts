import type { MatriculaConRelaciones } from "@/lib/actions/matriculas"

/**
 * Compara `estudiantes.id_acudiente` (el vínculo formal) contra
 * `id_acudiente_solicitante` (quién pidió esta matrícula) — ver ROADMAP.md
 * (2026-10-15) para la decisión de producto completa. `null` cuando la
 * matrícula no la solicitó un acudiente (la creó el admin directo), caso en
 * el que esta validación no aplica.
 *
 * Vive fuera de `lib/actions/matriculas.ts` a propósito: ese archivo lleva
 * `"use server"`, y Next.js exige que TODO lo que exporta un módulo así sea
 * una función async (se vuelve un endpoint de Server Action) — una función
 * síncrona como esta rompe el build si se exporta desde ahí.
 */
export type EstadoVinculoSolicitud = "sin-acudiente" | "vinculado-mismo" | "vinculado-otro"

export function estadoVinculoSolicitud(
  matricula: Pick<MatriculaConRelaciones, "estudiantes" | "id_acudiente_solicitante">
): EstadoVinculoSolicitud | null {
  if (!matricula.id_acudiente_solicitante) return null
  const idActual = matricula.estudiantes?.id_acudiente ?? null
  if (!idActual) return "sin-acudiente"
  return idActual === matricula.id_acudiente_solicitante ? "vinculado-mismo" : "vinculado-otro"
}
