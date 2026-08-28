"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { actualizarMiFichaAcudiente } from "@/lib/actions/mi-perfil"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import type { CrudFormState } from "@/lib/actions/types"

const initialState: CrudFormState = null

const TIPOS_DOCUMENTO = { TI: "TI", CC: "CC", CE: "CE", Pasaporte: "Pasaporte" }
const PARENTESCOS = { Padre: "Padre", Madre: "Madre", Tutor: "Tutor", Otro: "Otro" }

export function FichaAcudienteForm({
  tipoDocumento,
  nombres,
  apellidos,
  telefono,
  correoElectronico,
  direccion,
  parentesco,
}: {
  tipoDocumento: string
  nombres: string
  apellidos: string
  telefono: string | null
  correoElectronico: string | null
  direccion: string | null
  parentesco: string
}) {
  const [state, formAction, pending] = useActionState(actualizarMiFichaAcudiente, initialState)

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
            <FieldLabel htmlFor="parentesco">Parentesco</FieldLabel>
            <Combobox name="parentesco" defaultValue={parentesco} items={PARENTESCOS}>
              <ComboboxTrigger id="parentesco" className="w-full border-white/10 bg-black/20">
                <ComboboxValue />
              </ComboboxTrigger>
              <ComboboxContent />
            </Combobox>
            <FieldError errors={state?.errors?.parentesco?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
            <Input id="telefono" name="telefono" defaultValue={telefono ?? ""} className="border-white/10 bg-black/20" />
            <FieldError errors={state?.errors?.telefono?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="correoElectronico">Correo</FieldLabel>
            <Input
              id="correoElectronico"
              name="correoElectronico"
              type="email"
              defaultValue={correoElectronico ?? ""}
              className="border-white/10 bg-black/20"
            />
            <FieldError errors={state?.errors?.correoElectronico?.map((message) => ({ message }))} />
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
            <Input id="direccion" name="direccion" defaultValue={direccion ?? ""} className="border-white/10 bg-black/20" />
            <FieldError errors={state?.errors?.direccion?.map((message) => ({ message }))} />
          </Field>
        </div>
        <Button type="submit" disabled={pending} className="neon-button self-start">
          {pending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </FieldGroup>
    </form>
  )
}
