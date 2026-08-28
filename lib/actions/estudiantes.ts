"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { estudianteSchema } from "@/lib/validations/personas"
import type { CrudFormState, DeleteResult } from "@/lib/actions/types"
import { mensajeErrorEliminar } from "@/lib/actions/types"
import type { Database } from "@/lib/types/database.types"

export type EstudianteConAcudiente = Database["public"]["Tables"]["estudiantes"]["Row"] & {
  acudientes: { nombres: string; apellidos: string } | null
}

export async function getEstudiantes(): Promise<EstudianteConAcudiente[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("estudiantes")
    .select("*, acudientes ( nombres, apellidos )")
    .order("apellidos")
  return (data ?? []) as unknown as EstudianteConAcudiente[]
}

function parseInput(formData: FormData) {
  const idAcudiente = formData.get("idAcudiente")
  return estudianteSchema.safeParse({
    tipoDocumento: formData.get("tipoDocumento"),
    documento: formData.get("documento"),
    nombres: formData.get("nombres"),
    apellidos: formData.get("apellidos"),
    fechaNacimiento: formData.get("fechaNacimiento"),
    genero: formData.get("genero"),
    idAcudiente: idAcudiente === "none" ? "" : idAcudiente,
    estadoEstudiante: formData.get("estadoEstudiante"),
  })
}

export async function crearEstudiante(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = parseInput(formData)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("estudiantes").insert({
    tipo_documento: validated.data.tipoDocumento,
    documento: validated.data.documento,
    nombres: validated.data.nombres,
    apellidos: validated.data.apellidos,
    fecha_nacimiento: validated.data.fechaNacimiento,
    genero: validated.data.genero,
    id_acudiente: validated.data.idAcudiente || null,
    estado_estudiante: validated.data.estadoEstudiante,
  })

  if (error) return { message: error.message }

  revalidatePath("/dashboard/estudiantes")
  return { message: "ok" }
}

export async function actualizarEstudiante(
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
    .from("estudiantes")
    .update({
      tipo_documento: validated.data.tipoDocumento,
      documento: validated.data.documento,
      nombres: validated.data.nombres,
      apellidos: validated.data.apellidos,
      fecha_nacimiento: validated.data.fechaNacimiento,
      genero: validated.data.genero,
      id_acudiente: validated.data.idAcudiente || null,
      estado_estudiante: validated.data.estadoEstudiante,
    })
    .eq("id_estudiante", id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/estudiantes")
  return { message: "ok" }
}

export async function eliminarEstudiante(id: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("estudiantes").delete().eq("id_estudiante", id)
  if (error) return { error: mensajeErrorEliminar(error) }
  revalidatePath("/dashboard/estudiantes")
}
