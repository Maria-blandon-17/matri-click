"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { loginSchema, registroSchema } from "@/lib/validations/auth"

export type AuthFormState = {
  errors?: Record<string, string[]>
  message?: string
} | null

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(validated.data)

  if (error) {
    return { message: "Correo o contraseña incorrectos." }
  }

  redirect("/dashboard/inicio")
}

export async function registro(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validated = registroSchema.safeParse({
    nombreCompleto: formData.get("nombreCompleto"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    rol: formData.get("rol"),
    documento: formData.get("documento"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { nombreCompleto, email, password, rol, documento } = validated.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { rol, nombre_completo: nombreCompleto },
    },
  })

  if (error) {
    return { message: error.message }
  }

  if (data.user) {
    // Vincula el perfil recién creado con el estudiante/acudiente existente por documento.
    // Si no hay coincidencia, el registro queda pendiente para que el admin lo resuelva.
    if (rol === "acudiente") {
      const { data: match } = await supabase
        .from("acudientes")
        .select("id_acudiente")
        .eq("documento", documento)
        .maybeSingle()

      if (match) {
        await supabase
          .from("perfiles")
          .update({ id_acudiente: match.id_acudiente })
          .eq("id", data.user.id)
      }
    } else {
      const { data: match } = await supabase
        .from("estudiantes")
        .select("id_estudiante")
        .eq("documento", documento)
        .maybeSingle()

      if (match) {
        await supabase
          .from("perfiles")
          .update({ id_estudiante: match.id_estudiante })
          .eq("id", data.user.id)
      }
    }
  }

  return {
    message:
      "Cuenta creada. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
