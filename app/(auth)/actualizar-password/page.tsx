import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { AuthShell } from "@/components/auth/auth-shell"

import { ActualizarPasswordForm } from "./form"

/**
 * Página a la que llega el usuario desde el enlace del correo de
 * recuperación (después de que `/auth/callback` creó la sesión). Si no
 * hay sesión, el enlace no es válido / expiró → de vuelta a `/recuperar`.
 */
export default async function ActualizarPasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/recuperar")

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Nueva contraseña</h1>
        <p className="text-sm text-muted-foreground">Elige una contraseña nueva para tu cuenta.</p>
      </div>
      <ActualizarPasswordForm />
    </AuthShell>
  )
}
