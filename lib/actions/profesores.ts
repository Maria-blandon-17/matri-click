"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { profesorSchema } from "@/lib/validations/personas"
import type { CrudFormState } from "@/lib/actions/types"

export async function getProfesores() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profesores")
    .select("*")
    .order("apellidos")
  return data ?? []
}

function parseInput(formData: FormData) {
  return profesorSchema.safeParse({
    documento: formData.get("documento"),
    nombres: formData.get("nombres"),
    apellidos: formData.get("apellidos"),
    telefono: formData.get("telefono"),
    correoElectronico: formData.get("correoElectronico"),
    estadoProfesor: formData.get("estadoProfesor"),
  })
}

export async function crearProfesor(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = parseInput(formData)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("profesores").insert({
    documento: validated.data.documento,
    nombres: validated.data.nombres,
    apellidos: validated.data.apellidos,
    telefono: validated.data.telefono || null,
    correo_electronico: validated.data.correoElectronico || null,
    estado_profesor: validated.data.estadoProfesor,
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/administracion/profesores")
  return { message: "ok" }
}

export async function actualizarProfesor(
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
    .from("profesores")
    .update({
      documento: validated.data.documento,
      nombres: validated.data.nombres,
      apellidos: validated.data.apellidos,
      telefono: validated.data.telefono || null,
      correo_electronico: validated.data.correoElectronico || null,
      estado_profesor: validated.data.estadoProfesor,
    })
    .eq("id_profesor", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/administracion/profesores")
  return { message: "ok" }
}

export async function eliminarProfesor(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("profesores").delete().eq("id_profesor", id)
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/administracion/profesores")
}
