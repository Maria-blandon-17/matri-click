import "server-only"

import { createClient } from "@/lib/supabase/server"
import type { EstadoMatricula } from "@/lib/types/database.types"

export type UltimaMatricula = {
  id_matricula: string
  codigo_matricula: string
  estudiante: string
  grupo: string
  grado: string
  periodo: string
  fecha_matricula: string
  estado_matricula: EstadoMatricula
}

export type DashboardKpis = {
  estudiantes: number
  matriculasActivas: number
  totalMatriculas: number
  grupos: number
}

const EMPTY_KPIS: DashboardKpis = {
  estudiantes: 0,
  matriculasActivas: 0,
  totalMatriculas: 0,
  grupos: 0,
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const supabase = await createClient()

  const [estudiantes, matriculasActivas, totalMatriculas, grupos] = await Promise.all([
    supabase.from("estudiantes").select("*", { count: "exact", head: true }),
    supabase
      .from("matriculas")
      .select("*", { count: "exact", head: true })
      .eq("estado_matricula", "Activa"),
    supabase.from("matriculas").select("*", { count: "exact", head: true }),
    supabase.from("grupos").select("*", { count: "exact", head: true }),
  ])

  if (
    estudiantes.error ||
    matriculasActivas.error ||
    totalMatriculas.error ||
    grupos.error
  ) {
    return EMPTY_KPIS
  }

  return {
    estudiantes: estudiantes.count ?? 0,
    matriculasActivas: matriculasActivas.count ?? 0,
    totalMatriculas: totalMatriculas.count ?? 0,
    grupos: grupos.count ?? 0,
  }
}

export type OcupacionCupos = {
  cupoTotal: number
  matriculados: number
  disponibles: number
  porcentaje: number
}

export async function getOcupacionCupos(): Promise<OcupacionCupos> {
  const supabase = await createClient()

  const [{ data: grupos }, matriculasActivas] = await Promise.all([
    supabase.from("grupos").select("cupo_maximo"),
    supabase
      .from("matriculas")
      .select("*", { count: "exact", head: true })
      .eq("estado_matricula", "Activa"),
  ])

  const cupoTotal = (grupos ?? []).reduce((sum, g) => sum + g.cupo_maximo, 0)
  const matriculados = matriculasActivas.count ?? 0
  const disponibles = Math.max(cupoTotal - matriculados, 0)
  const porcentaje = cupoTotal > 0 ? Math.round((matriculados / cupoTotal) * 100) : 0

  return { cupoTotal, matriculados, disponibles, porcentaje }
}

export async function getUltimasMatriculas(): Promise<UltimaMatricula[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("matriculas")
    .select(
      `id_matricula, codigo_matricula, fecha_matricula, estado_matricula,
       estudiantes ( nombres, apellidos ),
       periodos_academicos ( nombre_periodo ),
       grupos ( nombre_grupo, grados ( nombre_grado ) )`
    )
    .order("fecha_matricula", { ascending: false })
    .limit(10)

  if (error || !data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((row) => ({
    id_matricula: row.id_matricula,
    codigo_matricula: row.codigo_matricula,
    estudiante: `${row.estudiantes?.nombres ?? ""} ${row.estudiantes?.apellidos ?? ""}`.trim(),
    grupo: row.grupos?.nombre_grupo ?? "",
    grado: row.grupos?.grados?.nombre_grado ?? "",
    periodo: row.periodos_academicos?.nombre_periodo ?? "",
    fecha_matricula: row.fecha_matricula,
    estado_matricula: row.estado_matricula,
  }))
}
