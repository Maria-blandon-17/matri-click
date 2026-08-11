"use client"

import { Plus, Pencil } from "lucide-react"

import { crearEstudiante, actualizarEstudiante } from "@/lib/actions/estudiantes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { CrudDialog } from "@/components/dashboard/crud/crud-dialog"
import type { Database } from "@/lib/types/database.types"

type Acudiente = Database["public"]["Tables"]["acudientes"]["Row"]

type Estudiante = {
  id_estudiante: string
  tipo_documento: string
  documento: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  genero: string
  id_acudiente: string | null
  estado_estudiante: string
}

const TIPOS_DOC = { TI: "TI", RC: "RC", CE: "CE", Pasaporte: "Pasaporte" }
const GENEROS = { Masculino: "Masculino", Femenino: "Femenino", Otro: "Otro" }
const ESTADOS = { Activo: "Activo", Retirado: "Retirado", Graduado: "Graduado" }

export function EstudianteFormDialog({
  estudiante,
  acudientes,
}: {
  estudiante?: Estudiante
  acudientes: Acudiente[]
}) {
  const isEdit = Boolean(estudiante)
  const action = isEdit
    ? actualizarEstudiante.bind(null, estudiante!.id_estudiante)
    : crearEstudiante

  const acudienteItems = Object.fromEntries(
    acudientes.map((a) => [a.id_acudiente, `${a.nombres} ${a.apellidos}`])
  )

  return (
    <CrudDialog
      title={isEdit ? "Editar estudiante" : "Nuevo estudiante"}
      action={action}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100 hover:text-primary">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="neon-button">
            <Plus className="size-4" />
            Nuevo estudiante
          </Button>
        )
      }
    >
      {(state, pending) => (
        <>
          <FieldGroup>
            <Field orientation="responsive">
              <div className="w-full">
                <FieldLabel htmlFor="nombres">Nombres</FieldLabel>
                <Input
                  id="nombres"
                  name="nombres"
                  defaultValue={estudiante?.nombres}
                  required
                />
              </div>
              <div className="w-full">
                <FieldLabel htmlFor="apellidos">Apellidos</FieldLabel>
                <Input
                  id="apellidos"
                  name="apellidos"
                  defaultValue={estudiante?.apellidos}
                  required
                />
              </div>
            </Field>
            <Field orientation="responsive">
              <div className="w-32">
                <FieldLabel htmlFor="tipoDocumento">Tipo doc.</FieldLabel>
                <Combobox
                  name="tipoDocumento"
                  defaultValue={estudiante?.tipo_documento ?? "TI"}
                  items={TIPOS_DOC}
                >
                  <ComboboxTrigger id="tipoDocumento" className="w-full">
                    <ComboboxValue />
                  </ComboboxTrigger>
                  <ComboboxContent />
                </Combobox>
              </div>
              <div className="w-full">
                <FieldLabel htmlFor="documento">Documento</FieldLabel>
                <Input
                  id="documento"
                  name="documento"
                  defaultValue={estudiante?.documento}
                  required
                />
              </div>
            </Field>
            <FieldError errors={state?.errors?.documento?.map((message) => ({ message }))} />
            <Field orientation="responsive">
              <div className="w-full">
                <FieldLabel htmlFor="fechaNacimiento">Fecha de nacimiento</FieldLabel>
                <Input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  defaultValue={estudiante?.fecha_nacimiento}
                  required
                />
              </div>
              <div className="w-full">
                <FieldLabel htmlFor="genero">Género</FieldLabel>
                <Combobox
                  name="genero"
                  defaultValue={estudiante?.genero ?? "Masculino"}
                  items={GENEROS}
                >
                  <ComboboxTrigger id="genero" className="w-full">
                    <ComboboxValue />
                  </ComboboxTrigger>
                  <ComboboxContent />
                </Combobox>
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="idAcudiente">Acudiente</FieldLabel>
              <Combobox
                name="idAcudiente"
                defaultValue={estudiante?.id_acudiente ?? "none"}
                items={{ none: "Sin asignar", ...acudienteItems }}
              >
                <ComboboxTrigger id="idAcudiente" className="w-full">
                  <ComboboxValue placeholder="Sin asignar" />
                </ComboboxTrigger>
                <ComboboxContent searchPlaceholder="Buscar acudiente..." />
              </Combobox>
            </Field>
            <Field>
              <FieldLabel htmlFor="estadoEstudiante">Estado</FieldLabel>
              <Combobox
                name="estadoEstudiante"
                defaultValue={estudiante?.estado_estudiante ?? "Activo"}
                items={ESTADOS}
              >
                <ComboboxTrigger id="estadoEstudiante" className="w-full">
                  <ComboboxValue />
                </ComboboxTrigger>
                <ComboboxContent />
              </Combobox>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4 -mx-4 -mb-4 rounded-b-2xl border-t border-white/10 bg-black/20 p-4">
            <DialogClose
              render={
                <Button type="button" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" disabled={pending} className="neon-button">
              {pending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </>
      )}
    </CrudDialog>
  )
}
