"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { sedeSchema } from "@/lib/validations/catalogos"
import type { CrudFormState, DeleteResult } from "@/lib/actions/types"
import { mensajeErrorEliminar } from "@/lib/actions/types"

export async function getSedes() {
  const supabase = await createClient()
  const { data } = await supabase.from("sedes").select("*").order("nombre_sede")
  return data ?? []
}

export async function crearSede(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = sedeSchema.safeParse({
    nombreSede: formData.get("nombreSede"),
    direccion: formData.get("direccion"),
    telefono: formData.get("telefono"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("sedes").insert({
    nombre_sede: validated.data.nombreSede,
    direccion: validated.data.direccion || null,
    telefono: validated.data.telefono || null,
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
