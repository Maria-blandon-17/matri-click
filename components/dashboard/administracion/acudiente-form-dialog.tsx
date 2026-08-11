"use client"

import { Plus, Pencil } from "lucide-react"

import { crearAcudiente, actualizarAcudiente } from "@/lib/actions/acudientes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { CrudDialog } from "@/components/dashboard/crud/crud-dialog"
import type { Database } from "@/lib/types/database.types"

type Acudiente = Database["public"]["Tables"]["acudientes"]["Row"]

const TIPOS_DOC = { TI: "TI", CC: "CC", CE: "CE", Pasaporte: "Pasaporte" }
const PARENTESCOS = { Padre: "Padre", Madre: "Madre", Tutor: "Tutor", Otro: "Otro" }

export function AcudienteFormDialog({ acudiente }: { acudiente?: Acudiente }) {
  const isEdit = Boolean(acudiente)
  const action = isEdit
    ? actualizarAcudiente.bind(null, acudiente!.id_acudiente)
    : crearAcudiente

  return (
    <CrudDialog
      title={isEdit ? "Editar acudiente" : "Nuevo acudiente"}
      action={action}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100 hover:text-primary">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="neon-button">
            <Plus className="size-4" />
            Nuevo acudiente
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
                <Input id="nombres" name="nombres" defaultValue={acudiente?.nombres} required />
              </div>
              <div className="w-full">
                <FieldLabel htmlFor="apellidos">Apellidos</FieldLabel>
                <Input
                  id="apellidos"
                  name="apellidos"
                  defaultValue={acudiente?.apellidos}
                  required
                />
              </div>
            </Field>
            <Field orientation="responsive">
              <div className="w-32">
                <FieldLabel htmlFor="tipoDocumento">Tipo doc.</FieldLabel>
                <Combobox
                  name="tipoDocumento"
                  defaultValue={acudiente?.tipo_documento ?? "CC"}
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
                  defaultValue={acudiente?.documento}
                  required
                />
              </div>
            </Field>
            <FieldError errors={state?.errors?.documento?.map((message) => ({ message }))} />
            <Field>
              <FieldLabel htmlFor="parentesco">Parentesco</FieldLabel>
              <Combobox
                name="parentesco"
                defaultValue={acudiente?.parentesco ?? "Padre"}
                items={PARENTESCOS}
              >
                <ComboboxTrigger id="parentesco" className="w-full">
                  <ComboboxValue />
                </ComboboxTrigger>
                <ComboboxContent />
              </Combobox>
            </Field>
            <Field>
              <FieldLabel htmlFor="correoElectronico">Correo electrónico</FieldLabel>
              <Input
                id="correoElectronico"
                name="correoElectronico"
                type="email"
                defaultValue={acudiente?.correo_electronico ?? ""}
              />
              <FieldError
                errors={state?.errors?.correoElectronico?.map((message) => ({ message }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
              <Input id="telefono" name="telefono" defaultValue={acudiente?.telefono ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
              <Input id="direccion" name="direccion" defaultValue={acudiente?.direccion ?? ""} />
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
