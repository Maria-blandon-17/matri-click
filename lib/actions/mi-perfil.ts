"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { nombrePerfilSchema, cambiarPasswordSchema } from "@/lib/validations/mi-perfil"
import type { CrudFormState } from "@/lib/actions/types"

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
