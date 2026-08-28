"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { actualizarMiFichaEstudiante } from "@/lib/actions/mi-perfil"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import type { CrudFormState } from "@/lib/actions/types"

const initialState: CrudFormState = null

const TIPOS_DOCUMENTO = { TI: "TI", RC: "RC", CE: "CE", Pasaporte: "Pasaporte" }
const GENEROS = { Masculino: "Masculino", Femenino: "Femenino", Otro: "Otro" }

export function FichaEstudianteForm({
  tipoDocumento,
  nombres,
  apellidos,
  fechaNacimiento,
  genero,
}: {
  tipoDocumento: string
  nombres: string
  apellidos: string
  fechaNacimiento: string
  genero: string
}) {
  const [state, formAction, pending] = useActionState(actualizarMiFichaEstudiante, initialState)

  useEffect(() => {
    if (!state) return
    if (state.message === "ok") toast.success("Datos actualizados.")
    else if (state.message) toast.error(state.message)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="nombres">Nombres</FieldLabel>
            <Input id="nombres" name="nombres" defaultValue={nombres} required className="border-white/10 bg-black/20" />
            <FieldError errors={state?.errors?.nombres?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="apellidos">Apellidos</FieldLabel>
            <Input id="apellidos" name="apellidos" defaultValue={apellidos} required className="border-white/10 bg-black/20" />
            <FieldError errors={state?.errors?.apellidos?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="tipoDocumento">Tipo de documento</FieldLabel>
            <Combobox name="tipoDocumento" defaultValue={tipoDocumento} items={TIPOS_DOCUMENTO}>
              <ComboboxTrigger id="tipoDocumento" className="w-full border-white/10 bg-black/20">
                <ComboboxValue />
              </ComboboxTrigger>
              <ComboboxContent />
            </Combobox>
            <FieldError errors={state?.errors?.tipoDocumento?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="genero">Género</FieldLabel>
            <Combobox name="genero" defaultValue={genero} items={GENEROS}>
              <ComboboxTrigger id="genero" className="w-full border-white/10 bg-black/20">
                <ComboboxValue />
              </ComboboxTrigger>
              <ComboboxContent />
            </Combobox>
            <FieldError errors={state?.errors?.genero?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="fechaNacimiento">Fecha de nacimiento</FieldLabel>
            <Input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              defaultValue={fechaNacimiento}
              className="border-white/10 bg-black/20"
            />
            <FieldError errors={state?.errors?.fechaNacimiento?.map((message) => ({ message }))} />
          </Field>
        </div>
        <Button type="submit" disabled={pending} className="neon-button self-start">
          {pending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </FieldGroup>
    </form>
  )
}
