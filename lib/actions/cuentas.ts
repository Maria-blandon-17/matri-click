"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getPerfilActual } from "@/lib/actions/perfil"
import type { RolUsuario } from "@/lib/types/database.types"

export type PerfilPendiente = {
  id: string
  nombre_completo: string | null
  email: string
}

export type VinculosPorRol = {
  // registroId -> datos de la cuenta ya vinculada a ese registro
  vinculados: Record<string, PerfilPendiente>
  // cuentas de ese rol que aún no están vinculadas a ningún registro
  pendientes: PerfilPendiente[]
}

async function emailsPorId(ids: string[]): Promise<Record<string, string>> {
  if (ids.length === 0) return {}
  const admin = createAdminClient()
  const { data } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const map: Record<string, string> = {}
  for (const usuario of data.users) {
    if (ids.includes(usuario.id)) map[usuario.id] = usuario.email ?? ""
  }
  return map
}

async function getVinculos(
  rol: RolUsuario,
  campo: "id_acudiente" | "id_estudiante" | "id_profesor"
): Promise<VinculosPorRol> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("perfiles")
    .select(`id, nombre_completo, ${campo}`)
    .eq("rol", rol)

  const filas = (data ?? []) as unknown as {
    id: string
    nombre_completo: string | null
    id_acudiente?: string | null
    id_estudiante?: string | null
    id_profesor?: string | null
  }[]

  const emails = await emailsPorId(filas.map((f) => f.id))

  const vinculados: Record<string, PerfilPendiente> = {}
  const pendientes: PerfilPendiente[] = []

  for (const fila of filas) {
    const registroId = fila[campo]
    const perfil: PerfilPendiente = {
      id: fila.id,
      nombre_completo: fila.nombre_completo,
      email: emails[fila.id] ?? "",
    }
    if (registroId) {
      vinculados[registroId] = perfil
    } else {
      pendientes.push(perfil)
    }
  }

  return { vinculados, pendientes }
}

export async function getVinculosAcudientes() {
  return getVinculos("acudiente", "id_acudiente")
}

export async function getVinculosEstudiantes() {
  return getVinculos("estudiante", "id_estudiante")
}

export async function getVinculosProfesores() {
  return getVinculos("profesor", "id_profesor")
}

async function vincular(
  campo: "id_acudiente" | "id_estudiante" | "id_profesor",
  perfilId: string,
  registroId: string,
  path: string
) {
  // Defensa en profundidad: esta Server Action es un endpoint HTTP más, invocable sin pasar por
  // la UI (que ya oculta este control a no-admin) — no basta con confiar en que RLS la bloquee.
  // Ver ROADMAP.md (auditoría 2026-10-15): la propia falta de esta verificación, combinada con
  // una política RLS de "perfiles" sin restricción de columnas, permitía que cualquier cuenta se
  // auto-vinculara a la ficha de otra persona.
  const perfil = await getPerfilActual()
  if (perfil?.rol !== "admin") return

  const supabase = await createClient()
  const update =
    campo === "id_acudiente"
      ? { id_acudiente: registroId }
      : campo === "id_estudiante"
        ? { id_estudiante: registroId }
        : { id_profesor: registroId }
  await supabase.from("perfiles").update(update).eq("id", perfilId)
  revalidatePath(path)
}

export async function vincularAcudiente(perfilId: string, idAcudiente: string) {
  await vincular("id_acudiente", perfilId, idAcudiente, "/dashboard/administracion/acudientes")
}

export async function vincularEstudiante(perfilId: string, idEstudiante: string) {
  await vincular("id_estudiante", perfilId, idEstudiante, "/dashboard/estudiantes")
}

export async function vincularProfesor(perfilId: string, idProfesor: string) {
  await vincular("id_profesor", perfilId, idProfesor, "/dashboard/administracion/profesores")
}
