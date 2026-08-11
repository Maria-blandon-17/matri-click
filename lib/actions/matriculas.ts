"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { matriculaSchema, estadoMatriculaSchema } from "@/lib/validations/matriculas"
import type { CrudFormState } from "@/lib/actions/types"
import type { EstadoMatricula } from "@/lib/types/database.types"

export type MatriculaConRelaciones = {
  id_matricula: string
  codigo_matricula: string
  fecha_matricula: string
  estado_matricula: EstadoMatricula
  observaciones: string | null
  estudiantes: { nombres: string; apellidos: string } | null
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
      `id_matricula, codigo_matricula, fecha_matricula, estado_matricula, observaciones,
       estudiantes ( nombres, apellidos ),
       periodos_academicos ( nombre_periodo ),
       grupos ( nombre_grupo, grados ( nombre_grado ) )`
    )
    .order("fecha_matricula", { ascending: false })

  if (filtros.idPeriodo) query = query.eq("id_periodo", filtros.idPeriodo)
  if (filtros.estado) query = query.eq("estado_matricula", filtros.estado)

  const { data } = await query
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

export async function actualizarEstadoMatricula(
  id: string,
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = estadoMatriculaSchema.safeParse({
    estadoMatricula: formData.get("estadoMatricula"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("matriculas")
    .update({ estado_matricula: validated.data.estadoMatricula })
    .eq("id_matricula", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/matriculas")
  revalidatePath("/dashboard/inicio")
  return { message: "ok" }
}

export async function eliminarMatricula(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("matriculas").delete().eq("id_matricula", id)
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/matriculas")
  revalidatePath("/dashboard/inicio")
}
