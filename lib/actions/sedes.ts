"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { sedeSchema } from "@/lib/validations/catalogos"
import type { CrudFormState, DeleteResult } from "@/lib/actions/types"
import { mensajeErrorEliminar } from "@/lib/actions/types"
import type { Database } from "@/lib/types/database.types"

export async function getSedes() {
  const supabase = await createClient()
  const { data } = await supabase.from("sedes").select("*").order("nombre_sede")
  return data ?? []
}

export type SedeConEstadisticas = Database["public"]["Tables"]["sedes"]["Row"] & {
  totalGrupos: number
  cupoTotal: number
  matriculasActivas: number
  niveles: string[]
}

export async function getSedesConEstadisticas(): Promise<SedeConEstadisticas[]> {
  const supabase = await createClient()
  const [{ data: sedes }, { data: grupos }, { data: matriculas }] = await Promise.all([
    supabase.from("sedes").select("*").order("nombre_sede"),
    supabase
      .from("grupos")
      .select("id_grupo, id_sede, cupo_maximo, grados ( nivel_educativo )"),
    supabase.from("matriculas").select("id_grupo").eq("estado_matricula", "Activa"),
  ])

  type GrupoFila = {
    id_grupo: string
    id_sede: string
    cupo_maximo: number
    grados: { nivel_educativo: string } | null
  }
  const gruposPorSede = (grupos ?? []) as unknown as GrupoFila[]
  const matriculasActivasPorGrupo = new Map<string, number>()
  for (const matricula of matriculas ?? []) {
    matriculasActivasPorGrupo.set(
      matricula.id_grupo,
      (matriculasActivasPorGrupo.get(matricula.id_grupo) ?? 0) + 1
    )
  }

  return (sedes ?? []).map((sede) => {
    const gruposSede = gruposPorSede.filter((grupo) => grupo.id_sede === sede.id_sede)
    const niveles = Array.from(
      new Set(gruposSede.map((grupo) => grupo.grados?.nivel_educativo).filter(Boolean))
    ) as string[]
    return {
      ...sede,
      totalGrupos: gruposSede.length,
      cupoTotal: gruposSede.reduce((total, grupo) => total + grupo.cupo_maximo, 0),
      matriculasActivas: gruposSede.reduce(
        (total, grupo) => total + (matriculasActivasPorGrupo.get(grupo.id_grupo) ?? 0),
        0
      ),
      niveles,
    }
  })
}

export async function crearSede(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = sedeSchema.safeParse({
    nombreSede: formData.get("nombreSede"),
    direccion: formData.get("direccion"),
    telefono: formData.get("telefono"),
    imagenUrl: formData.get("imagenUrl"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("sedes").insert({
    nombre_sede: validated.data.nombreSede,
    direccion: validated.data.direccion || null,
    telefono: validated.data.telefono || null,
    imagen_url: validated.data.imagenUrl || null,
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/administracion/sedes")
  return { message: "ok" }
}

export async function actualizarSede(
  id: string,
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = sedeSchema.safeParse({
    nombreSede: formData.get("nombreSede"),
    direccion: formData.get("direccion"),
    telefono: formData.get("telefono"),
    imagenUrl: formData.get("imagenUrl"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("sedes")
    .update({
      nombre_sede: validated.data.nombreSede,
      direccion: validated.data.direccion || null,
      telefono: validated.data.telefono || null,
      imagen_url: validated.data.imagenUrl || null,
    })
    .eq("id_sede", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/administracion/sedes")
  return { message: "ok" }
}

export async function eliminarSede(id: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("sedes").delete().eq("id_sede", id)
  if (error) return { error: mensajeErrorEliminar(error) }
  revalidatePath("/dashboard/administracion/sedes")
}
