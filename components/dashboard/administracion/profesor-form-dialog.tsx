"use client"

import { Plus, Pencil } from "lucide-react"

import { crearProfesor, actualizarProfesor } from "@/lib/actions/profesores"
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

type Profesor = Database["public"]["Tables"]["profesores"]["Row"]

const ESTADOS = { Activo: "Activo", Inactivo: "Inactivo" }

export function ProfesorFormDialog({ profesor }: { profesor?: Profesor }) {
  const isEdit = Boolean(profesor)
  const action = isEdit
    ? actualizarProfesor.bind(null, profesor!.id_profesor)
    : crearProfesor

  return (
    <CrudDialog
      title={isEdit ? "Editar profesor" : "Nuevo profesor"}
      action={action}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100 hover:text-primary">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="neon-button">
            <Plus className="size-4" />
            Nuevo profesor
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
                <Input id="nombres" name="nombres" defaultValue={profesor?.nombres} required />
              </div>
              <div className="w-full">
                <FieldLabel htmlFor="apellidos">Apellidos</FieldLabel>
                <Input
                  id="apellidos"
                  name="apellidos"
                  defaultValue={profesor?.apellidos}
                  required
                />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="documento">Documento</FieldLabel>
              <Input
                id="documento"
                name="documento"
                defaultValue={profesor?.documento}
                required
              />
              <FieldError
                errors={state?.errors?.documento?.map((message) => ({ message }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="correoElectronico">Correo electrónico</FieldLabel>
              <Input
                id="correoElectronico"
                name="correoElectronico"
                type="email"
                defaultValue={profesor?.correo_electronico ?? ""}
              />
              <FieldError
                errors={state?.errors?.correoElectronico?.map((message) => ({
                  message,
                }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
              <Input id="telefono" name="telefono" defaultValue={profesor?.telefono ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="estadoProfesor">Estado</FieldLabel>
              <Select
                name="estadoProfesor"
                defaultValue={profesor?.estado_profesor ?? "Activo"}
                items={ESTADOS}
              >
                <SelectTrigger id="estadoProfesor" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
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
