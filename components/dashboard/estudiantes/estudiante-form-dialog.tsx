"use client"

import { Plus, Pencil } from "lucide-react"

import { crearEstudiante, actualizarEstudiante } from "@/lib/actions/estudiantes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
                <Select
                  name="tipoDocumento"
                  defaultValue={estudiante?.tipo_documento ?? "TI"}
                  items={TIPOS_DOC}
                >
                  <SelectTrigger id="tipoDocumento" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="RC">RC</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  name="genero"
                  defaultValue={estudiante?.genero ?? "Masculino"}
                  items={GENEROS}
                >
                  <SelectTrigger id="genero" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="idAcudiente">Acudiente</FieldLabel>
              <Select
                name="idAcudiente"
                defaultValue={estudiante?.id_acudiente ?? "none"}
                items={{ none: "Sin asignar", ...acudienteItems }}
              >
                <SelectTrigger id="idAcudiente" className="w-full">
                  <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {acudientes.map((a) => (
                    <SelectItem key={a.id_acudiente} value={a.id_acudiente}>
                      {a.nombres} {a.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="estadoEstudiante">Estado</FieldLabel>
              <Select
                name="estadoEstudiante"
                defaultValue={estudiante?.estado_estudiante ?? "Activo"}
                items={ESTADOS}
              >
                <SelectTrigger id="estadoEstudiante" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Retirado">Retirado</SelectItem>
                  <SelectItem value="Graduado">Graduado</SelectItem>
                </SelectContent>
              </Select>
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
