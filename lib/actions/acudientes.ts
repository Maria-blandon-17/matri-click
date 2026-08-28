"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { acudienteSchema } from "@/lib/validations/personas"
import type { CrudFormState, DeleteResult } from "@/lib/actions/types"
import { mensajeErrorEliminar } from "@/lib/actions/types"

export async function getAcudientes() {
  const supabase = await createClient()
  const { data } = await supabase.from("acudientes").select("*").order("apellidos")
  return data ?? []
}

function parseInput(formData: FormData) {
  return acudienteSchema.safeParse({
    tipoDocumento: formData.get("tipoDocumento"),
    documento: formData.get("documento"),
    nombres: formData.get("nombres"),
    apellidos: formData.get("apellidos"),
    telefono: formData.get("telefono"),
    correoElectronico: formData.get("correoElectronico"),
    direccion: formData.get("direccion"),
    parentesco: formData.get("parentesco"),
  })
}

export async function crearAcudiente(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = parseInput(formData)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("acudientes").insert({
    tipo_documento: validated.data.tipoDocumento,
    documento: validated.data.documento,
    nombres: validated.data.nombres,
    apellidos: validated.data.apellidos,
    telefono: validated.data.telefono || null,
    correo_electronico: validated.data.correoElectronico || null,
    direccion: validated.data.direccion || null,
    parentesco: validated.data.parentesco,
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/administracion/acudientes")
  return { message: "ok" }
}

export async function actualizarAcudiente(
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
    .from("acudientes")
    .update({
      tipo_documento: validated.data.tipoDocumento,
      documento: validated.data.documento,
      nombres: validated.data.nombres,
      apellidos: validated.data.apellidos,
      telefono: validated.data.telefono || null,
      correo_electronico: validated.data.correoElectronico || null,
      direccion: validated.data.direccion || null,
      parentesco: validated.data.parentesco,
    })
    .eq("id_acudiente", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/administracion/acudientes")
  return { message: "ok" }
}

export async function eliminarAcudiente(id: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("acudientes").delete().eq("id_acudiente", id)
  if (error) return { error: mensajeErrorEliminar(error) }
  revalidatePath("/dashboard/administracion/acudientes")
}
