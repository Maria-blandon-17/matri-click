"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  loginSchema,
  nuevaPasswordSchema,
  recuperarSchema,
  registroSchema,
  TERMINOS_VERSION,
} from "@/lib/validations/auth"

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
    terminos: formData.get("terminos"),
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
    // Vincula el perfil recién creado con el estudiante/acudiente/profesor existente por
    // documento. Usa el cliente admin (bypassa RLS) a propósito: un usuario recién registrado
    // y aún sin vincular no tiene ninguna política de lectura sobre esas tablas (solo admin, o
    // el propio registro una vez ya vinculado), así que con el cliente normal esta búsqueda
    // siempre devolvía cero filas y el auto-link nunca ocurría. El alcance queda acotado: solo
    // lee por documento exacto y solo actualiza el perfil recién creado.
    // El documento se guarda siempre en el perfil, haya o no coincidencia — si no la hay, la
    // cuenta queda "pendiente" y un admin la revisa desde /dashboard/administracion/cuentas-pendientes.
    const admin = createAdminClient()
    const tabla = rol === "acudiente" ? "acudientes" : rol === "profesor" ? "profesores" : "estudiantes"
    const columnaId =
      rol === "acudiente" ? "id_acudiente" : rol === "profesor" ? "id_profesor" : "id_estudiante"

    const { data: match } = (await admin
      .from(tabla)
      .select(columnaId)
      .eq("documento", documento)
      .maybeSingle()) as unknown as { data: Record<string, string> | null }

    await admin
      .from("perfiles")
      .update({
        documento,
        ...(match ? { [columnaId]: match[columnaId] } : {}),
      })
      .eq("id", data.user.id)

    // Aparte del update de arriba a propósito: si la migración 0011 aún no se aplicó, que
    // este update falle no debe tumbar el guardado del documento / la vinculación.
    const { error: terminosError } = await admin
      .from("perfiles")
      .update({
        terminos_aceptados_at: new Date().toISOString(),
        terminos_version: TERMINOS_VERSION,
      })
      .eq("id", data.user.id)
    if (terminosError) {
      console.error("No se pudo guardar la aceptación de términos:", terminosError.message)
    }
  }

  return {
    success: true,
    message:
      "Cuenta creada. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
  }
}

export async function solicitarRecuperacion(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validated = recuperarSchema.safeParse({ email: formData.get("email") })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  // Base URL desde la request (no hay NEXT_PUBLIC_SITE_URL configurada).
  const hdrs = await headers()
  const origin =
    hdrs.get("origin") ?? `https://${hdrs.get("host") ?? "matri-click.vercel.app"}`

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(validated.data.email, {
    redirectTo: `${origin}/auth/callback?next=/actualizar-password`,
  })

  if (error) {
    return { message: "No pudimos enviar el correo. Intenta de nuevo en unos minutos." }
  }

  // Respuesta neutra a propósito: no revela si el correo tiene cuenta o no.
  return {
    success: true,
    message:
      "Si ese correo tiene una cuenta, te enviamos un enlace para restablecer la contraseña. Revisa tu bandeja de entrada y la carpeta de spam.",
  }
}

export async function actualizarPassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validated = nuevaPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      message:
        'El enlace expiró o no es válido. Solicita uno nuevo desde "¿Olvidaste tu contraseña?".',
    }
  }

  const { error } = await supabase.auth.updateUser({ password: validated.data.password })

  if (error) {
    return { message: error.message }
  }

  redirect("/dashboard/inicio")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
