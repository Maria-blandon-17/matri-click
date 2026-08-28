"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { RolUsuario } from "@/lib/types/database.types"
import type { DeleteResult } from "@/lib/actions/types"
import { mensajeErrorEliminar } from "@/lib/actions/types"

export type CuentaPendiente = {
  id: string
  rol: RolUsuario
  nombreCompleto: string | null
  documento: string | null
  email: string
  creadaEn: string
}

function splitNombre(nombreCompleto: string | null) {
  const partes = (nombreCompleto ?? "").trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return { nombres: "Sin nombre", apellidos: "Sin apellido" }
  if (partes.length === 1) return { nombres: partes[0], apellidos: partes[0] }
  return { nombres: partes[0], apellidos: partes.slice(1).join(" ") }
}

function esPendiente(p: {
  rol: RolUsuario
  id_profesor: string | null
  id_acudiente: string | null
  id_estudiante: string | null
}) {
  return (
    (p.rol === "profesor" && !p.id_profesor) ||
    (p.rol === "acudiente" && !p.id_acudiente) ||
    (p.rol === "estudiante" && !p.id_estudiante)
  )
}

export async function getCuentasPendientesCount(): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("perfiles")
    .select("rol, id_profesor, id_acudiente, id_estudiante")
    .eq("rechazado", false)
    .in("rol", ["profesor", "acudiente", "estudiante"])

  return (data ?? []).filter(esPendiente).length
}

export async function getCuentasPendientes(): Promise<CuentaPendiente[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("perfiles")
    .select("id, rol, nombre_completo, documento, created_at, id_profesor, id_acudiente, id_estudiante")
    .eq("rechazado", false)
    .in("rol", ["profesor", "acudiente", "estudiante"])
    .order("created_at", { ascending: false })

  const pendientes = (data ?? []).filter(esPendiente)
  if (pendientes.length === 0) return []

  const admin = createAdminClient()
  const { data: usuarios } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const emailPorId = new Map(usuarios.users.map((u) => [u.id, u.email ?? ""]))

  return pendientes.map((p) => ({
    id: p.id,
    rol: p.rol,
    nombreCompleto: p.nombre_completo,
    documento: p.documento,
    email: emailPorId.get(p.id) ?? "",
    creadaEn: p.created_at,
  }))
}

export async function aceptarCuenta(perfilId: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, nombre_completo, documento")
    .eq("id", perfilId)
    .single()

  if (!perfil) return { error: "Cuenta no encontrada." }
  if (!perfil.documento) return { error: "Esta cuenta no tiene documento registrado." }

  const { nombres, apellidos } = splitNombre(perfil.nombre_completo)
  const admin = createAdminClient()
  const { data: usuario } = await admin.auth.admin.getUserById(perfilId)
  const email = usuario.user?.email ?? null

  if (perfil.rol === "profesor") {
    const { data: nuevo, error } = await supabase
      .from("profesores")
      .insert({ documento: perfil.documento, nombres, apellidos, correo_electronico: email })
      .select("id_profesor")
      .single()
    if (error || !nuevo) return { error: error ? mensajeErrorEliminar(error) : "No se pudo crear la ficha." }
    await supabase.from("perfiles").update({ id_profesor: nuevo.id_profesor }).eq("id", perfilId)
  } else if (perfil.rol === "acudiente") {
    const { data: nuevo, error } = await supabase
      .from("acudientes")
      .insert({
        documento: perfil.documento,
        nombres,
        apellidos,
        correo_electronico: email,
        tipo_documento: "CC",
        parentesco: "Otro",
      })
      .select("id_acudiente")
      .single()
    if (error || !nuevo) return { error: error ? mensajeErrorEliminar(error) : "No se pudo crear la ficha." }
    await supabase.from("perfiles").update({ id_acudiente: nuevo.id_acudiente }).eq("id", perfilId)
  } else if (perfil.rol === "estudiante") {
    const { data: nuevo, error } = await supabase
      .from("estudiantes")
      .insert({
        documento: perfil.documento,
        nombres,
        apellidos,
        tipo_documento: "TI",
        fecha_nacimiento: "2000-01-01",
        genero: "Otro",
      })
      .select("id_estudiante")
      .single()
    if (error || !nuevo) return { error: error ? mensajeErrorEliminar(error) : "No se pudo crear la ficha." }
    await supabase.from("perfiles").update({ id_estudiante: nuevo.id_estudiante }).eq("id", perfilId)
  }

  revalidatePath("/dashboard/administracion/cuentas-pendientes")
  revalidatePath("/dashboard/administracion/profesores")
  revalidatePath("/dashboard/administracion/acudientes")
  revalidatePath("/dashboard/estudiantes")
}

export async function rechazarCuenta(perfilId: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("perfiles").update({ rechazado: true }).eq("id", perfilId)
  if (error) return { error: mensajeErrorEliminar(error) }
  revalidatePath("/dashboard/administracion/cuentas-pendientes")
}

export async function descartarCuenta(perfilId: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("perfiles").delete().eq("id", perfilId)
  if (error) return { error: mensajeErrorEliminar(error) }

  const admin = createAdminClient()
  await admin.auth.admin.deleteUser(perfilId)

  revalidatePath("/dashboard/administracion/cuentas-pendientes")
}
