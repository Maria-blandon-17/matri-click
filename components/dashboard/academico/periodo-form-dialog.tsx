"use client"

import { Plus, Pencil } from "lucide-react"

import { crearPeriodo, actualizarPeriodo } from "@/lib/actions/periodos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { CrudDialog } from "@/components/dashboard/crud/crud-dialog"
import type { Database } from "@/lib/types/database.types"

type Periodo = Database["public"]["Tables"]["periodos_academicos"]["Row"]

const ESTADOS = {
  Activo: "Activo",
  Finalizado: "Finalizado",
  Planeado: "Planeado",
}

export function PeriodoFormDialog({ periodo }: { periodo?: Periodo }) {
  const isEdit = Boolean(periodo)
  const action = isEdit
    ? actualizarPeriodo.bind(null, periodo!.id_periodo)
    : crearPeriodo

  return (
    <CrudDialog
      title={isEdit ? "Editar periodo" : "Nuevo periodo académico"}
      action={action}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100 hover:text-primary">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="neon-button">
            <Plus className="size-4" />
            Nuevo periodo
          </Button>
        )
      }
    >
      {(state, pending) => (
        <>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nombrePeriodo">Nombre</FieldLabel>
              <Input
                id="nombrePeriodo"
                name="nombrePeriodo"
                placeholder="2024"
                defaultValue={periodo?.nombre_periodo}
                required
              />
              <FieldError
                errors={state?.errors?.nombrePeriodo?.map((message) => ({ message }))}
              />
            </Field>
            <Field orientation="responsive">
              <div className="w-full">
                <FieldLabel htmlFor="fechaInicio">Fecha inicio</FieldLabel>
                <Input
                  id="fechaInicio"
                  name="fechaInicio"
                  type="date"
                  defaultValue={periodo?.fecha_inicio}
                  required
                />
              </div>
              <div className="w-full">
                <FieldLabel htmlFor="fechaFin">Fecha fin</FieldLabel>
                <Input
                  id="fechaFin"
                  name="fechaFin"
                  type="date"
                  defaultValue={periodo?.fecha_fin}
                  required
                />
              </div>
            </Field>
            <FieldError
              errors={state?.errors?.fechaFin?.map((message) => ({ message }))}
            />
            <Field>
              <FieldLabel htmlFor="estado">Estado</FieldLabel>
              <Combobox
                name="estado"
                defaultValue={periodo?.estado ?? "Planeado"}
                items={ESTADOS}
              >
                <ComboboxTrigger id="estado" className="w-full">
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
