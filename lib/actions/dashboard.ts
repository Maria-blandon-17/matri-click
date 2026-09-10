"use server"

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

export async function getDashboardKpis(idPeriodo?: string): Promise<DashboardKpis> {
  const supabase = await createClient()

  let matriculasActivasQuery = supabase
    .from("matriculas")
    .select("*", { count: "exact", head: true })
    .eq("estado_matricula", "Activa")
  let totalMatriculasQuery = supabase.from("matriculas").select("*", { count: "exact", head: true })

  if (idPeriodo) {
    matriculasActivasQuery = matriculasActivasQuery.eq("id_periodo", idPeriodo)
    totalMatriculasQuery = totalMatriculasQuery.eq("id_periodo", idPeriodo)
  }

  // "Estudiantes" y "Grupos" no están ligados a un periodo en el schema (solo "matriculas" lo
  // está), así que quedan iguales sin importar el filtro — es correcto, no un bug.
  const [estudiantes, matriculasActivas, totalMatriculas, grupos] = await Promise.all([
    supabase.from("estudiantes").select("*", { count: "exact", head: true }),
    matriculasActivasQuery,
    totalMatriculasQuery,
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

export async function getOcupacionCupos(idPeriodo?: string): Promise<OcupacionCupos> {
  const supabase = await createClient()

  let matriculasActivasQuery = supabase
    .from("matriculas")
    .select("*", { count: "exact", head: true })
    .eq("estado_matricula", "Activa")
  if (idPeriodo) {
    matriculasActivasQuery = matriculasActivasQuery.eq("id_periodo", idPeriodo)
  }

  const [{ data: grupos }, matriculasActivas] = await Promise.all([
    supabase.from("grupos").select("cupo_maximo"),
    matriculasActivasQuery,
  ])

  const cupoTotal = (grupos ?? []).reduce((sum, g) => sum + g.cupo_maximo, 0)
  const matriculados = matriculasActivas.count ?? 0
  const disponibles = Math.max(cupoTotal - matriculados, 0)
  const porcentaje = cupoTotal > 0 ? Math.round((matriculados / cupoTotal) * 100) : 0

  return { cupoTotal, matriculados, disponibles, porcentaje }
}

export async function getUltimasMatriculas(idPeriodo?: string): Promise<UltimaMatricula[]> {
  const supabase = await createClient()

  let query = supabase
    .from("matriculas")
    .select(
      `id_matricula, codigo_matricula, fecha_matricula, estado_matricula,
       estudiantes ( nombres, apellidos ),
       periodos_academicos ( nombre_periodo ),
       grupos ( nombre_grupo, grados ( nombre_grado ) )`
    )
    .order("fecha_matricula", { ascending: false })
    .limit(10)

  if (idPeriodo) {
    query = query.eq("id_periodo", idPeriodo)
  }

  const { data, error } = await query

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

export type ResumenDominios = {
  comunidad: { estudiantes: number; acudientes: number; profesores: number }
  matriculas: { total: number; activas: number; pendientes: number }
  academico: { grupos: number; grados: number; ocupacionPct: number }
}

// Contadores por dominio para las 3 tarjetas de resumen de /dashboard/inicio.
// Solo "matriculas" se filtra por periodo (es la única entidad ligada a un periodo).
export async function getResumenDominios(idPeriodo?: string): Promise<ResumenDominios> {
  const supabase = await createClient()
  const count = (tabla: "estudiantes" | "acudientes" | "profesores" | "grupos" | "grados") =>
    supabase.from(tabla).select("*", { count: "exact", head: true })

  let totalQ = supabase.from("matriculas").select("*", { count: "exact", head: true })
  let activasQ = supabase
    .from("matriculas")
    .select("*", { count: "exact", head: true })
    .eq("estado_matricula", "Activa")
  let pendientesQ = supabase
    .from("matriculas")
    .select("*", { count: "exact", head: true })
    .eq("estado_matricula", "Pendiente")
  if (idPeriodo) {
    totalQ = totalQ.eq("id_periodo", idPeriodo)
    activasQ = activasQ.eq("id_periodo", idPeriodo)
    pendientesQ = pendientesQ.eq("id_periodo", idPeriodo)
  }

  const [estudiantes, acudientes, profesores, grupos, grados, total, activas, pendientes, ocupacion] =
    await Promise.all([
      count("estudiantes"),
      count("acudientes"),
      count("profesores"),
      count("grupos"),
      count("grados"),
      totalQ,
      activasQ,
      pendientesQ,
      getOcupacionCupos(idPeriodo),
    ])

  return {
    comunidad: {
      estudiantes: estudiantes.count ?? 0,
      acudientes: acudientes.count ?? 0,
      profesores: profesores.count ?? 0,
    },
    matriculas: {
      total: total.count ?? 0,
      activas: activas.count ?? 0,
      pendientes: pendientes.count ?? 0,
    },
    academico: {
      grupos: grupos.count ?? 0,
      grados: grados.count ?? 0,
      ocupacionPct: ocupacion.porcentaje,
    },
  }
}

export type OcupacionGrado = {
  grado: string
  matriculados: number
  cupo: number
  porcentaje: number
}

// % de cupos ocupados por grado — para el gráfico de barras de /dashboard/inicio.
// matriculados = matrículas Activas cuyo grupo pertenece al grado; cupo = suma de
// `cupo_maximo` de los grupos de ese grado.
export async function getOcupacionPorGrado(idPeriodo?: string): Promise<OcupacionGrado[]> {
  const supabase = await createClient()

  let matriculasQuery = supabase
    .from("matriculas")
    .select("grupos ( id_grado )")
    .eq("estado_matricula", "Activa")
  if (idPeriodo) {
    matriculasQuery = matriculasQuery.eq("id_periodo", idPeriodo)
  }

  const [{ data: grupos }, { data: matriculas }] = await Promise.all([
    supabase.from("grupos").select("id_grado, cupo_maximo, grados ( nombre_grado )"),
    matriculasQuery,
  ])

  const porGrado = new Map<
    string,
    { grado: string; cupo: number; matriculados: number }
  >()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const g of (grupos ?? []) as any[]) {
    const key = g.id_grado as string
    const actual = porGrado.get(key) ?? {
      grado: g.grados?.nombre_grado ?? "Sin grado",
      cupo: 0,
      matriculados: 0,
    }
    actual.cupo += g.cupo_maximo ?? 0
    porGrado.set(key, actual)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const m of (matriculas ?? []) as any[]) {
    const key = m.grupos?.id_grado as string | undefined
    if (!key) continue
    const actual = porGrado.get(key)
    if (actual) actual.matriculados += 1
  }

  return [...porGrado.values()]
    .map((v) => ({
      ...v,
      porcentaje: v.cupo > 0 ? Math.round((v.matriculados / v.cupo) * 100) : 0,
    }))
    .sort((a, b) => a.grado.localeCompare(b.grado, "es"))
}

export type InicioDashboardData = {
  kpis: DashboardKpis
  ocupacion: OcupacionCupos
  matriculas: UltimaMatricula[]
  resumen: ResumenDominios
  ocupacionPorGrado: OcupacionGrado[]
}

// Se llama directo desde el cliente (Server Action) cuando cambia el filtro de periodo en
// /dashboard/inicio, sin navegar de página — así la actualización es solo un fetch de datos,
// no un reload completo del árbol de la página.
export async function getInicioDashboardData(idPeriodo?: string): Promise<InicioDashboardData> {
  const [kpis, ocupacion, matriculas, resumen, ocupacionPorGrado] = await Promise.all([
    getDashboardKpis(idPeriodo),
    getOcupacionCupos(idPeriodo),
    getUltimasMatriculas(idPeriodo),
    getResumenDominios(idPeriodo),
    getOcupacionPorGrado(idPeriodo),
  ])

  return { kpis, ocupacion, matriculas, resumen, ocupacionPorGrado }
}
