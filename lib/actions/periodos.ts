"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { periodoSchema } from "@/lib/validations/catalogos"
import type { CrudFormState, DeleteResult } from "@/lib/actions/types"
import { mensajeErrorEliminar } from "@/lib/actions/types"

export async function getPeriodos() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("periodos_academicos")
    .select("*")
    .order("fecha_inicio", { ascending: false })
  return data ?? []
}

function parseInput(formData: FormData) {
  return periodoSchema.safeParse({
    nombrePeriodo: formData.get("nombrePeriodo"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    estado: formData.get("estado"),
  })
}

export async function crearPeriodo(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = parseInput(formData)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("periodos_academicos").insert({
    nombre_periodo: validated.data.nombrePeriodo,
    fecha_inicio: validated.data.fechaInicio,
    fecha_fin: validated.data.fechaFin,
    estado: validated.data.estado,
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/academico/periodos")
  return { message: "ok" }
}

export async function actualizarPeriodo(
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
    .from("periodos_academicos")
    .update({
      nombre_periodo: validated.data.nombrePeriodo,
      fecha_inicio: validated.data.fechaInicio,
      fecha_fin: validated.data.fechaFin,
      estado: validated.data.estado,
    })
    .eq("id_periodo", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/academico/periodos")
  return { message: "ok" }
}

export async function eliminarPeriodo(id: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("periodos_academicos")
    .delete()
    .eq("id_periodo", id)
  if (error) return { error: mensajeErrorEliminar(error) }
  revalidatePath("/dashboard/academico/periodos")
}
