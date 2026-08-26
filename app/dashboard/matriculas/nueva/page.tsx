import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getPeriodos } from "@/lib/actions/periodos"
import { getPerfilActual } from "@/lib/actions/perfil"
import { NuevaMatriculaForm } from "@/components/dashboard/matriculas/nueva-matricula-form"

type GrupoConGrado = {
  id_grupo: string
  nombre_grupo: string
  cupo_maximo: number
  grados: { nombre_grado: string } | null
}

export default async function NuevaMatriculaPage() {
  const perfil = await getPerfilActual()
  if (!perfil || (perfil.rol !== "admin" && perfil.rol !== "acudiente")) {
    redirect("/dashboard/matriculas")
  }
  const modoSolicitud = perfil.rol === "acudiente"

  const supabase = await createClient()

  const [{ data: estudiantes }, periodos, { data: grupos }, { data: matriculasActivas }] =
    await Promise.all([
      supabase
        .from("estudiantes")
        .select("id_estudiante, nombres, apellidos, documento")
        .eq("estado_estudiante", "Activo")
        .order("apellidos"),
      getPeriodos(),
      supabase
        .from("grupos")
        .select("id_grupo, nombre_grupo, cupo_maximo, grados ( nombre_grado )")
        .order("nombre_grupo") as unknown as Promise<{ data: GrupoConGrado[] | null }>,
      supabase.from("matriculas").select("id_grupo").eq("estado_matricula", "Activa"),
    ])

  const matriculadosPorGrupo = (matriculasActivas ?? []).reduce<Record<string, number>>(
    (acc, m) => {
      acc[m.id_grupo] = (acc[m.id_grupo] ?? 0) + 1
      return acc
    },
    {}
  )

  const gruposConDisponibilidad = (grupos ?? []).map((g) => ({
    ...g,
    matriculados: matriculadosPorGrupo[g.id_grupo] ?? 0,
  }))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {modoSolicitud ? "Solicitar matrícula" : "Nueva matrícula"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {modoSolicitud
            ? "Elige el estudiante, periodo y grupo. Un administrador del colegio revisará y aprobará tu solicitud."
            : "Complete los detalles para inscribir al estudiante en un nuevo periodo académico."}
        </p>
      </div>
      <NuevaMatriculaForm
        estudiantes={estudiantes ?? []}
        periodos={periodos}
        grupos={gruposConDisponibilidad}
        modoSolicitud={modoSolicitud}
      />
    </div>
  )
}
