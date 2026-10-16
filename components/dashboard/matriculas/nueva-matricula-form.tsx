"use client"

import { useActionState, useMemo, useState } from "react"
import Link from "next/link"
import { User, CalendarDays, NotebookText } from "lucide-react"

import { crearMatricula, crearSolicitudMatricula } from "@/lib/actions/matriculas"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import type { Database } from "@/lib/types/database.types"

type Estudiante = Pick<
  Database["public"]["Tables"]["estudiantes"]["Row"],
  "id_estudiante" | "nombres" | "apellidos" | "documento"
>
type Periodo = Database["public"]["Tables"]["periodos_academicos"]["Row"]
type Sede = Pick<Database["public"]["Tables"]["sedes"]["Row"], "id_sede" | "nombre_sede">
type Grupo = {
  id_grupo: string
  id_sede: string
  nombre_grupo: string
  cupo_maximo: number
  matriculados: number
  grados: { nombre_grado: string } | null
}

export function NuevaMatriculaForm({
  estudiantes,
  periodos,
  sedes,
  grupos,
  modoSolicitud = false,
}: {
  estudiantes: Estudiante[]
  periodos: Periodo[]
  sedes: Sede[]
  grupos: Grupo[]
  modoSolicitud?: boolean
}) {
  const [state, formAction, pending] = useActionState(
    modoSolicitud ? crearSolicitudMatricula : crearMatricula,
    null
  )
  const [sedeSeleccionada, setSedeSeleccionada] = useState<string | undefined>()
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | undefined>()

  const estudianteItems = Object.fromEntries(
    estudiantes.map((e) => [e.id_estudiante, `${e.nombres} ${e.apellidos} (${e.documento})`])
  )
  const periodoItems = Object.fromEntries(
    periodos.map((p) => [p.id_periodo, p.nombre_periodo])
  )
  const sedeItems = Object.fromEntries(sedes.map((s) => [s.id_sede, s.nombre_sede]))
  const gruposDeLaSede = useMemo(
    () => grupos.filter((g) => g.id_sede === sedeSeleccionada),
    [grupos, sedeSeleccionada]
  )
  const grupoItems = Object.fromEntries(
    gruposDeLaSede.map((g) => [g.id_grupo, `${g.nombre_grupo}${g.grados ? ` — ${g.grados.nombre_grado}` : ""}`])
  )

  const grupo = useMemo(
    () => grupos.find((g) => g.id_grupo === grupoSeleccionado),
    [grupos, grupoSeleccionado]
  )
  const disponibles = grupo ? Math.max(grupo.cupo_maximo - grupo.matriculados, 0) : null
  const porcentajeOcupado = grupo ? Math.round((grupo.matriculados / grupo.cupo_maximo) * 100) : 0
  const circumference = 2 * Math.PI * 45
  const offset = circumference * (1 - porcentajeOcupado / 100)
  const sinCupo = disponibles === 0

  return (
    <form action={formAction} className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="flex flex-col gap-5 lg:col-span-8">
        <div className="glass-card relative overflow-hidden rounded-xl p-6">
          <div className="bg-primary/50 absolute top-0 left-0 h-full w-1" />
          <h3 className="mb-6 flex items-center gap-2 text-lg font-medium">
            <User className="size-5 text-primary" />
            Selección de estudiante
          </h3>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="idEstudiante">Estudiante</FieldLabel>
              <Combobox name="idEstudiante" items={estudianteItems}>
                <ComboboxTrigger id="idEstudiante" className="w-full border-white/10 bg-black/20">
                  <ComboboxValue placeholder="Selecciona un estudiante" />
                </ComboboxTrigger>
                <ComboboxContent searchPlaceholder="Buscar estudiante..." />
              </Combobox>
              <FieldError
                errors={state?.errors?.idEstudiante?.map((message) => ({ message }))}
              />
            </Field>
          </FieldGroup>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-medium">
            <CalendarDays className="size-5 text-primary" />
            Detalles académicos
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="idSede">Sede</FieldLabel>
              <Combobox
                items={sedeItems}
                value={sedeSeleccionada}
                onValueChange={(value) => {
                  setSedeSeleccionada(value)
                  setGrupoSeleccionado(undefined)
                }}
              >
                <ComboboxTrigger id="idSede" className="w-full border-white/10 bg-black/20">
                  <ComboboxValue placeholder="Selecciona una sede" />
                </ComboboxTrigger>
                <ComboboxContent searchPlaceholder="Buscar sede..." />
              </Combobox>
            </Field>
            <Field>
              <FieldLabel htmlFor="idPeriodo">Periodo académico</FieldLabel>
              <Combobox name="idPeriodo" items={periodoItems}>
                <ComboboxTrigger id="idPeriodo" className="w-full border-white/10 bg-black/20">
                  <ComboboxValue placeholder="Selecciona un periodo" />
                </ComboboxTrigger>
                <ComboboxContent />
              </Combobox>
              <FieldError
                errors={state?.errors?.idPeriodo?.map((message) => ({ message }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="idGrupo">Grupo</FieldLabel>
              <Combobox
                name="idGrupo"
                items={grupoItems}
                value={grupoSeleccionado}
                onValueChange={setGrupoSeleccionado}
                disabled={!sedeSeleccionada}
              >
                <ComboboxTrigger id="idGrupo" className="w-full border-white/10 bg-black/20">
                  <ComboboxValue
                    placeholder={sedeSeleccionada ? "Selecciona un grupo" : "Primero elige una sede"}
                  />
                </ComboboxTrigger>
                <ComboboxContent
                  searchPlaceholder="Buscar grupo..."
                  emptyText="Esta sede aún no tiene grupos registrados."
                />
              </Combobox>
              <FieldError errors={state?.errors?.idGrupo?.map((message) => ({ message }))} />
            </Field>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-medium">
            <NotebookText className="size-5 text-primary" />
            Observaciones
          </h3>
          <Field>
            <FieldLabel htmlFor="observaciones">Notas adicionales (opcional)</FieldLabel>
            <Textarea
              id="observaciones"
              name="observaciones"
              rows={4}
              className="border-white/10 bg-black/20"
              placeholder="Ingresa cualquier comentario relevante para esta matrícula..."
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:col-span-4">
        <div className="glass-card relative flex flex-col items-center overflow-hidden rounded-xl p-6 text-center">
          <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />
          <h3 className="relative z-10 mb-4 w-full text-left text-lg font-medium">
            Disponibilidad
          </h3>
          {grupo ? (
            <>
              <div className="relative z-10 mb-4 size-32">
                <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={sinCupo ? "#ffb4ab" : "#2b66ff"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                      filter: `drop-shadow(0 0 8px ${sinCupo ? "rgba(255,180,171,0.6)" : "rgba(43,102,255,0.6)"})`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{disponibles}</span>
                  <span className="font-label-mono text-[10px] text-muted-foreground">
                    cupos
                  </span>
                </div>
              </div>
              <div className="relative z-10 mt-2 flex w-full items-center justify-between rounded-lg border border-white/5 bg-black/20 p-3">
                <span className="font-label-mono text-xs text-muted-foreground">
                  Estado {grupo.nombre_grupo}
                </span>
                <span
                  className={`font-label-mono rounded-full px-2 py-1 text-[10px] font-bold ${
                    sinCupo
                      ? "bg-destructive/20 text-destructive"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {sinCupo ? "Sin cupo" : "Disponible"}
                </span>
              </div>
              {modoSolicitud && sinCupo && (
                <p className="relative z-10 mt-3 text-xs text-muted-foreground">
                  Este grupo ya no tiene cupo, pero puedes enviar la solicitud igual — quedará en
                  espera por si se libera un cupo antes de que el colegio la revise.
                </p>
              )}
            </>
          ) : (
            <p className="relative z-10 py-8 text-sm text-muted-foreground">
              Selecciona un grupo para ver la disponibilidad de cupos.
            </p>
          )}
        </div>

        <div className="glass-card mt-auto flex flex-col gap-3 rounded-xl p-6">
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
          <Button
            type="submit"
            disabled={pending || (sinCupo && !modoSolicitud)}
            className="neon-button h-12 rounded-xl font-bold"
          >
            {pending
              ? modoSolicitud
                ? "Enviando solicitud..."
                : "Matriculando..."
              : modoSolicitud
                ? "Enviar solicitud"
                : "Confirmar matrícula"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-primary/40 text-primary hover:bg-primary/10"
            nativeButton={false}
            render={<Link href="/dashboard/matriculas">Cancelar</Link>}
          />
        </div>
      </div>
    </form>
  )
}
