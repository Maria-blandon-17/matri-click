"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { grupoSchema } from "@/lib/validations/catalogos"
import type { CrudFormState, DeleteResult } from "@/lib/actions/types"
import { mensajeErrorEliminar } from "@/lib/actions/types"

export type GrupoConRelaciones = {
  id_grupo: string
  nombre_grupo: string
  cupo_maximo: number
  id_grado: string
  id_sede: string
  id_director_grupo: string | null
  grados: { nombre_grado: string } | null
  sedes: { nombre_sede: string } | null
  profesores: { nombres: string; apellidos: string } | null
}

export async function getGrupos(): Promise<GrupoConRelaciones[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("grupos")
    .select(
      `id_grupo, nombre_grupo, cupo_maximo, id_grado, id_sede, id_director_grupo,
       grados ( nombre_grado ),
       sedes ( nombre_sede ),
       profesores ( nombres, apellidos )`
    )
    .order("nombre_grupo")
  return (data ?? []) as unknown as GrupoConRelaciones[]
}

function parseInput(formData: FormData) {
  const idDirectorGrupo = formData.get("idDirectorGrupo")
  return grupoSchema.safeParse({
    nombreGrupo: formData.get("nombreGrupo"),
    idGrado: formData.get("idGrado"),
    idSede: formData.get("idSede"),
    cupoMaximo: formData.get("cupoMaximo"),
    idDirectorGrupo: idDirectorGrupo === "none" ? "" : idDirectorGrupo,
  })
}

export async function crearGrupo(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = parseInput(formData)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("grupos").insert({
    nombre_grupo: validated.data.nombreGrupo,
    id_grado: validated.data.idGrado,
    id_sede: validated.data.idSede,
    cupo_maximo: validated.data.cupoMaximo,
    id_director_grupo: validated.data.idDirectorGrupo || null,
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/academico/grupos")
  return { message: "ok" }
}

export async function actualizarGrupo(
  id: string,
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = parseInput(formData)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("grupos")
    .update({
      nombre_grupo: validated.data.nombreGrupo,
      id_grado: validated.data.idGrado,
      id_sede: validated.data.idSede,
      cupo_maximo: validated.data.cupoMaximo,
      id_director_grupo: validated.data.idDirectorGrupo || null,
    })
    .eq("id_grupo", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/academico/grupos")
  return { message: "ok" }
}

export async function eliminarGrupo(id: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("grupos").delete().eq("id_grupo", id)
  if (error) return { error: mensajeErrorEliminar(error) }
  revalidatePath("/dashboard/academico/grupos")
}
