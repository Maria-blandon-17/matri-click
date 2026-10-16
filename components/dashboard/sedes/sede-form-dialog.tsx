"use client"

import { Plus, Pencil } from "lucide-react"

import { crearSede, actualizarSede } from "@/lib/actions/sedes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { CrudDialog } from "@/components/dashboard/crud/crud-dialog"
import { SedeImagenInput } from "@/components/dashboard/sedes/sede-imagen-input"
import type { Database } from "@/lib/types/database.types"

type Sede = Database["public"]["Tables"]["sedes"]["Row"]

export function SedeFormDialog({
  sede,
  trigger,
}: {
  sede?: Sede
  trigger?: React.ReactElement
}) {
  const isEdit = Boolean(sede)
  const action = isEdit
    ? actualizarSede.bind(null, sede!.id_sede)
    : crearSede

  return (
    <CrudDialog
      title={isEdit ? "Editar sede" : "Nueva sede"}
      action={action}
      trigger={
        trigger ??
        (isEdit ? (
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100 hover:text-primary">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="neon-button">
            <Plus className="size-4" />
            Nueva sede
          </Button>
        ))
      }
    >
      {(state, pending) => (
        <>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nombreSede">Nombre</FieldLabel>
              <Input
                id="nombreSede"
                name="nombreSede"
                defaultValue={sede?.nombre_sede}
                required
              />
              <FieldError
                errors={state?.errors?.nombreSede?.map((message) => ({ message }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
              <Input
                id="direccion"
                name="direccion"
                defaultValue={sede?.direccion ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
              <Input
                id="telefono"
                name="telefono"
                defaultValue={sede?.telefono ?? ""}
              />
            </Field>
            <SedeImagenInput defaultUrl={sede?.imagen_url} />
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
