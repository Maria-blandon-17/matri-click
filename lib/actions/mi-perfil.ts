"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import {
  nombrePerfilSchema,
  cambiarPasswordSchema,
  miFichaProfesorSchema,
  miFichaAcudienteSchema,
  miFichaEstudianteSchema,
} from "@/lib/validations/mi-perfil"
import type { CrudFormState } from "@/lib/actions/types"

async function idFichaPropia(campo: "id_profesor" | "id_acudiente" | "id_estudiante") {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = (await supabase.from("perfiles").select(campo).eq("id", user.id).single()) as unknown as {
    data: Record<string, string | null> | null
  }
  return data?.[campo] ?? null
}

export async function actualizarNombrePerfil(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = nombrePerfilSchema.safeParse({
    nombreCompleto: formData.get("nombreCompleto"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { message: "No autenticado." }

  const { error } = await supabase
    .from("perfiles")
    .update({ nombre_completo: validated.data.nombreCompleto })
    .eq("id", user.id)

  if (error) return { message: error.message }

  revalidatePath("/dashboard/cuentas")
  revalidatePath("/dashboard/inicio")
  return { message: "ok" }
}

export async function actualizarMiFichaProfesor(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = miFichaProfesorSchema.safeParse({
    nombres: formData.get("nombres"),
    apellidos: formData.get("apellidos"),
    telefono: formData.get("telefono"),
    correoElectronico: formData.get("correoElectronico"),
  })
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors }

  const idProfesor = await idFichaPropia("id_profesor")
  if (!idProfesor) return { message: "No tienes un registro de profesor vinculado." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("profesores")
    .update({
      nombres: validated.data.nombres,
      apellidos: validated.data.apellidos,
      telefono: validated.data.telefono || null,
      correo_electronico: validated.data.correoElectronico || null,
    })
    .eq("id_profesor", idProfesor)

  if (error) return { message: error.message }
  revalidatePath("/dashboard/cuentas")
  return { message: "ok" }
}

export async function actualizarMiFichaAcudiente(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = miFichaAcudienteSchema.safeParse({
    tipoDocumento: formData.get("tipoDocumento"),
    nombres: formData.get("nombres"),
    apellidos: formData.get("apellidos"),
    telefono: formData.get("telefono"),
    correoElectronico: formData.get("correoElectronico"),
    direccion: formData.get("direccion"),
    parentesco: formData.get("parentesco"),
  })
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors }

  const idAcudiente = await idFichaPropia("id_acudiente")
  if (!idAcudiente) return { message: "No tienes un registro de acudiente vinculado." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("acudientes")
    .update({
      tipo_documento: validated.data.tipoDocumento,
      nombres: validated.data.nombres,
      apellidos: validated.data.apellidos,
      telefono: validated.data.telefono || null,
      correo_electronico: validated.data.correoElectronico || null,
      direccion: validated.data.direccion || null,
      parentesco: validated.data.parentesco,
    })
    .eq("id_acudiente", idAcudiente)

  if (error) return { message: error.message }
  revalidatePath("/dashboard/cuentas")
  return { message: "ok" }
}

export async function actualizarMiFichaEstudiante(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = miFichaEstudianteSchema.safeParse({
    tipoDocumento: formData.get("tipoDocumento"),
    nombres: formData.get("nombres"),
    apellidos: formData.get("apellidos"),
    fechaNacimiento: formData.get("fechaNacimiento"),
    genero: formData.get("genero"),
  })
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors }

  const idEstudiante = await idFichaPropia("id_estudiante")
  if (!idEstudiante) return { message: "No tienes un registro de estudiante vinculado." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("estudiantes")
    .update({
      tipo_documento: validated.data.tipoDocumento,
      nombres: validated.data.nombres,
      apellidos: validated.data.apellidos,
      fecha_nacimiento: validated.data.fechaNacimiento,
      genero: validated.data.genero,
    })
    .eq("id_estudiante", idEstudiante)

  if (error) return { message: error.message }
  revalidatePath("/dashboard/cuentas")
  return { message: "ok" }
}

export async function cambiarPassword(
  _prevState: CrudFormState,
  formData: FormData
): Promise<CrudFormState> {
  const validated = cambiarPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: validated.data.password })

  if (error) return { message: error.message }

  return { message: "ok" }
}
