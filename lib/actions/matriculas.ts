"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { matriculaSchema, estadoMatriculaSchema } from "@/lib/validations/matriculas"
import type { CrudFormState, DeleteResult } from "@/lib/actions/types"
import { mensajeErrorEliminar } from "@/lib/actions/types"
import type { EstadoMatricula, TipoDocEstudiante } from "@/lib/types/database.types"

export type MatriculaConRelaciones = {
  id_matricula: string
  codigo_matricula: string
  id_estudiante: string
  fecha_matricula: string
  estado_matricula: EstadoMatricula
  observaciones: string | null
  // Motivo opcional que deja el admin al rechazar/cancelar — migración 0014.
  motivo_estado: string | null
  estudiantes: {
    nombres: string
    apellidos: string
    tipo_documento: TipoDocEstudiante
    documento: string
    id_acudiente: string | null
    acudientes: { nombres: string; apellidos: string } | null
  } | null
  // Quién solicitó la matrícula (acudiente, migración 0012/0013) — no necesariamente el
  // acudiente vinculado al estudiante: desde que un acudiente puede solicitar matrícula para
  // cualquier estudiante, no solo el suyo, esa suposición dejó de ser válida.
  id_acudiente_solicitante: string | null
  acudiente_solicitante: { nombres: string; apellidos: string } | null
  periodos_academicos: { nombre_periodo: string } | null
  grupos: { nombre_grupo: string; grados: { nombre_grado: string } | null } | null
}

export type MatriculasFiltros = {
  idPeriodo?: string
  estado?: EstadoMatricula
}

export async function getMatriculas(
  filtros: MatriculasFiltros = {}
): Promise<MatriculaConRelaciones[]> {
  const supabase = await createClient()
  let query = supabase
    .from("matriculas")
    .select(
      `id_matricula, codigo_matricula, id_estudiante, fecha_matricula, estado_matricula, observaciones,
       motivo_estado, id_acudiente_solicitante,
       estudiantes ( nombres, apellidos, tipo_documento, documento, id_acudiente, acudientes ( nombres, apellidos ) ),
       acudiente_solicitante:acudientes!id_acudiente_solicitante ( nombres, apellidos ),
       periodos_academicos ( nombre_periodo ),
       grupos ( nombre_grupo, grados ( nombre_grado ) )`
    )
    .order("fecha_matricula", { ascending: false })

  if (filtros.idPeriodo) query = query.eq("id_periodo", filtros.idPeriodo)
  if (filtros.estado) query = query.eq("estado_matricula", filtros.estado)

  const { data, error } = await query
  // Un error acá (ej. falta la migración 0013, que agrega la columna que usa el embed de
  // `acudiente_solicitante`) antes se tragaba en silencio y devolvía `[]` — se veía como "no hay
  // matrículas" en vez del error real que era. Lo mismo pasaba en /dashboard/matriculas y en
  // "Necesita tu atención" de Inicio, aunque los conteos (que no usan este embed) sí mostraran
  // el número correcto — por eso la inconsistencia.
  if (error) console.error("getMatriculas:", error.message)
  return (data ?? []) as unknown as MatriculaConRelaciones[]
}

async function generarCodigoMatricula(nombrePeriodo: string) {
  const supabase = await createClient()
  const { count } = await supabase
    .from("matriculas")
    .select("*", { count: "exact", head: true })
  const secuencial = String((count ?? 0) + 1).padStart(4, "0")
  return `MAT-${nombrePeriodo}-${secuencial}`
}

export async function crearMatricula(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = matriculaSchema.safeParse({
    idEstudiante: formData.get("idEstudiante"),
    idPeriodo: formData.get("idPeriodo"),
    idGrupo: formData.get("idGrupo"),
    observaciones: formData.get("observaciones"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { idEstudiante, idPeriodo, idGrupo, observaciones } = validated.data
  const supabase = await createClient()

  const [{ data: grupo }, { count: matriculadosActuales }, { data: periodo }] =
    await Promise.all([
      supabase.from("grupos").select("cupo_maximo").eq("id_grupo", idGrupo).single(),
      supabase
        .from("matriculas")
        .select("*", { count: "exact", head: true })
        .eq("id_grupo", idGrupo)
        .eq("estado_matricula", "Activa"),
      supabase
        .from("periodos_academicos")
        .select("nombre_periodo")
        .eq("id_periodo", idPeriodo)
        .single(),
    ])

  if (!grupo || !periodo) {
    return { message: "Grupo o periodo no encontrado." }
  }

  if ((matriculadosActuales ?? 0) >= grupo.cupo_maximo) {
    return { message: "El grupo seleccionado ya alcanzó su cupo máximo." }
  }

  const codigoMatricula = await generarCodigoMatricula(periodo.nombre_periodo)

  const { error } = await supabase.from("matriculas").insert({
    codigo_matricula: codigoMatricula,
    id_estudiante: idEstudiante,
    id_periodo: idPeriodo,
    id_grupo: idGrupo,
    observaciones: observaciones || null,
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/matriculas")
  revalidatePath("/dashboard/inicio")
  redirect("/dashboard/matriculas")
}

export async function crearSolicitudMatricula(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = matriculaSchema.safeParse({
    idEstudiante: formData.get("idEstudiante"),
    idPeriodo: formData.get("idPeriodo"),
    idGrupo: formData.get("idGrupo"),
    observaciones: formData.get("observaciones"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { idEstudiante, idPeriodo, idGrupo, observaciones } = validated.data
  const supabase = await createClient()

  const { data: periodo } = await supabase
    .from("periodos_academicos")
    .select("nombre_periodo")
    .eq("id_periodo", idPeriodo)
    .single()

  if (!periodo) {
    return { message: "Periodo no encontrado." }
  }

  const codigoMatricula = await generarCodigoMatricula(periodo.nombre_periodo)

  const { error } = await supabase.from("matriculas").insert({
    codigo_matricula: codigoMatricula,
    id_estudiante: idEstudiante,
    id_periodo: idPeriodo,
    id_grupo: idGrupo,
    observaciones: observaciones || null,
    estado_matricula: "Pendiente",
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/matriculas")
  redirect("/dashboard/matriculas")
}

export async function getMatriculasPendientesCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from("matriculas")
    .select("*", { count: "exact", head: true })
    .eq("estado_matricula", "Pendiente")
  return count ?? 0
}

export async function actualizarEstadoMatricula(
  id: string,
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = estadoMatriculaSchema.safeParse({
    estadoMatricula: formData.get("estadoMatricula"),
    motivo: formData.get("motivo"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()

  if (validated.data.estadoMatricula === "Activa") {
    const { data: matricula } = await supabase
      .from("matriculas")
      .select("id_grupo, id_estudiante, id_acudiente_solicitante")
      .eq("id_matricula", id)
      .single()

    if (!matricula) return { message: "Matrícula no encontrada." }

    // Si la matrícula la solicitó un acudiente (no el admin directo) y el estudiante YA está
    // vinculado a un acudiente distinto, no se aprueba sola — hay que resolver a mano si el
    // solicitante de verdad representa a ese estudiante o no (ver ROADMAP.md, 2026-10-15,
    // decisión explícita del usuario: no auto-vincular ni aprobar un posible conflicto de
    // identidad sin que el admin lo revise). Si el estudiante no tiene acudiente todavía, o si
    // ya es el mismo que solicitó, no hay conflicto y se aprueba normal.
    if (matricula.id_acudiente_solicitante) {
      const { data } = await supabase
        .from("estudiantes")
        .select("id_acudiente, acudientes ( nombres, apellidos )")
        .eq("id_estudiante", matricula.id_estudiante)
        .single()
      const estudiante = data as unknown as {
        id_acudiente: string | null
        acudientes: { nombres: string; apellidos: string } | null
      } | null

      if (estudiante?.id_acudiente && estudiante.id_acudiente !== matricula.id_acudiente_solicitante) {
        const acudienteActual = estudiante.acudientes
        const nombreActual = acudienteActual
          ? `${acudienteActual.nombres} ${acudienteActual.apellidos}`
          : "otro acudiente"
        return {
          message: `No se puede aprobar: este estudiante ya está vinculado a ${nombreActual}, distinto de quien solicitó esta matrícula. Resuelve el vínculo desde Comunidad → Estudiantes antes de aprobar.`,
        }
      }
    }

    const [{ data: grupo }, { count: activasEnGrupo }] = await Promise.all([
      supabase.from("grupos").select("cupo_maximo").eq("id_grupo", matricula.id_grupo).single(),
      supabase
        .from("matriculas")
        .select("*", { count: "exact", head: true })
        .eq("id_grupo", matricula.id_grupo)
        .eq("estado_matricula", "Activa")
        .neq("id_matricula", id),
    ])

    if (!grupo) return { message: "Grupo no encontrado." }
    if ((activasEnGrupo ?? 0) >= grupo.cupo_maximo) {
      return { message: "El grupo ya alcanzó su cupo máximo, no se puede aprobar." }
    }
  }

  // El motivo solo tiene sentido junto a Rechazada/Cancelada — si el estado cambia a cualquier
  // otra cosa (ej. se reactiva por error), se limpia para no dejar un motivo de rechazo viejo
  // colgado en una matrícula que ya no está rechazada.
  const esEstadoConMotivo =
    validated.data.estadoMatricula === "Rechazada" || validated.data.estadoMatricula === "Cancelada"
  const motivoEstado = esEstadoConMotivo ? validated.data.motivo || null : null

  const { error } = await supabase
    .from("matriculas")
    .update({ estado_matricula: validated.data.estadoMatricula, motivo_estado: motivoEstado })
    .eq("id_matricula", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/matriculas")
  revalidatePath("/dashboard/inicio")
  return { message: "ok" }
}

export async function eliminarMatricula(id: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("matriculas").delete().eq("id_matricula", id)
  if (error) return { error: mensajeErrorEliminar(error) }
  revalidatePath("/dashboard/matriculas")
  revalidatePath("/dashboard/inicio")
}
