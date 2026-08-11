"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { loginSchema, registroSchema } from "@/lib/validations/auth"

export type AuthFormState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
  values?: {
    nombreCompleto?: string
    email?: string
    documento?: string
    rol?: string
  }
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
  // Se conservan los valores no sensibles del intento anterior para que el formulario
  // pueda re-poblarlos si la validación o el signUp fallan (nunca se hace eco de contraseñas).
  const values = {
    nombreCompleto: formData.get("nombreCompleto")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    documento: formData.get("documento")?.toString() ?? "",
    rol: formData.get("rol")?.toString() ?? "",
  }

  const validated = registroSchema.safeParse({
    nombreCompleto: formData.get("nombreCompleto"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    rol: formData.get("rol"),
    documento: formData.get("documento"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, values }
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
    return { message: error.message, values }
  }

  if (data.user) {
    // Vincula el perfil recién creado con el estudiante/acudiente existente por documento.
    // Usa el cliente admin (bypassa RLS) a propósito: un usuario recién registrado y aún sin
    // vincular no tiene ninguna política de lectura sobre "acudientes"/"estudiantes" (solo
    // admin, o el propio registro una vez ya vinculado), así que con el cliente normal esta
    // búsqueda siempre devolvía cero filas y el auto-link nunca ocurría. El alcance queda
    // acotado: solo lee por documento exacto y solo actualiza el perfil recién creado.
    const admin = createAdminClient()

    if (rol === "acudiente") {
      const { data: match } = await admin
        .from("acudientes")
        .select("id_acudiente")
        .eq("documento", documento)
        .maybeSingle()

      if (match) {
        await admin
          .from("perfiles")
          .update({ id_acudiente: match.id_acudiente })
          .eq("id", data.user.id)
      }
    } else {
      const { data: match } = await admin
        .from("estudiantes")
        .select("id_estudiante")
        .eq("documento", documento)
        .maybeSingle()

      if (match) {
        await admin
          .from("perfiles")
          .update({ id_estudiante: match.id_estudiante })
          .eq("id", data.user.id)
      }
    }
  }

  return {
    success: true,
    message:
      "Cuenta creada. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
