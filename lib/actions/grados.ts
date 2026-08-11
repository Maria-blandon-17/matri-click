"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { gradoSchema } from "@/lib/validations/catalogos"
import type { CrudFormState } from "@/lib/actions/types"

export async function getGrados() {
  const supabase = await createClient()
  const { data } = await supabase.from("grados").select("*").order("nombre_grado")
  return data ?? []
}

export async function crearGrado(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = gradoSchema.safeParse({
    nombreGrado: formData.get("nombreGrado"),
    nivelEducativo: formData.get("nivelEducativo"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("grados").insert({
    nombre_grado: validated.data.nombreGrado,
    nivel_educativo: validated.data.nivelEducativo,
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/academico/grados")
  return { message: "ok" }
}

export async function actualizarGrado(
  id: string,
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = gradoSchema.safeParse({
    nombreGrado: formData.get("nombreGrado"),
    nivelEducativo: formData.get("nivelEducativo"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("grados")
    .update({
      nombre_grado: validated.data.nombreGrado,
      nivel_educativo: validated.data.nivelEducativo,
    })
    .eq("id_grado", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/academico/grados")
  return { message: "ok" }
}

export async function eliminarGrado(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("grados").delete().eq("id_grado", id)
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/academico/grados")
}
