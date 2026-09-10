import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"

/**
 * Punto de aterrizaje de los enlaces de correo de Supabase (recuperación de
 * contraseña, y a futuro confirmación de cuenta). Soporta los dos formatos:
 *  - `?code=...`            → flujo PKCE (correo por defecto de Supabase)
 *  - `?token_hash=&type=`   → flujo token_hash (si se personaliza la plantilla)
 * Tras crear la sesión redirige a `?next=` (por defecto el dashboard).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/dashboard/inicio"

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=enlace_invalido`)
}
