import "server-only"

import { createClient } from "@/lib/supabase/server"
import type { RolUsuario } from "@/lib/types/database.types"

export async function getPerfilActual() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!perfil) return null

  return { ...perfil, email: user.email ?? null }
}

export type RegistroVinculado =
  | ({ tipo: "profesor" } & {
      documento: string
      nombres: string
      apellidos: string
      telefono: string | null
      correo_electronico: string | null
    })
  | ({ tipo: "acudiente" } & {
      documento: string
      tipo_documento: string
      nombres: string
      apellidos: string
      telefono: string | null
      direccion: string | null
      parentesco: string
      correo_electronico: string | null
    })
  | ({ tipo: "estudiante" } & {
      documento: string
      tipo_documento: string
      nombres: string
      apellidos: string
      fecha_nacimiento: string
      genero: string
      estado_estudiante: string
    })

export async function getRegistroVinculado(
  rol: RolUsuario,
  ids: { id_profesor: string | null; id_acudiente: string | null; id_estudiante: string | null }
): Promise<RegistroVinculado | null> {
  const supabase = await createClient()

  if (rol === "profesor" && ids.id_profesor) {
    const { data } = await supabase
      .from("profesores")
      .select("documento, nombres, apellidos, telefono, correo_electronico")
      .eq("id_profesor", ids.id_profesor)
      .maybeSingle()
    return data ? { tipo: "profesor", ...data } : null
  }

  if (rol === "acudiente" && ids.id_acudiente) {
    const { data } = await supabase
      .from("acudientes")
      .select("documento, tipo_documento, nombres, apellidos, telefono, direccion, parentesco, correo_electronico")
      .eq("id_acudiente", ids.id_acudiente)
      .maybeSingle()
    return data ? { tipo: "acudiente", ...data } : null
  }

  if (rol === "estudiante" && ids.id_estudiante) {
    const { data } = await supabase
      .from("estudiantes")
      .select("documento, tipo_documento, nombres, apellidos, fecha_nacimiento, genero, estado_estudiante")
      .eq("id_estudiante", ids.id_estudiante)
      .maybeSingle()
    return data ? { tipo: "estudiante", ...data } : null
  }

  return null
}
