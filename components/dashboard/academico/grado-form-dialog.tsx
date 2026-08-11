"use client"

import { Plus, Pencil } from "lucide-react"

import { crearGrado, actualizarGrado } from "@/lib/actions/grados"
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

type Grado = Database["public"]["Tables"]["grados"]["Row"]

const NIVELES = {
  Primaria: "Primaria",
  Bachillerato: "Bachillerato",
}

export function GradoFormDialog({ grado }: { grado?: Grado }) {
  const isEdit = Boolean(grado)
  const action = isEdit ? actualizarGrado.bind(null, grado!.id_grado) : crearGrado

  return (
    <CrudDialog
      title={isEdit ? "Editar grado" : "Nuevo grado"}
      action={action}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100 hover:text-primary">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="neon-button">
            <Plus className="size-4" />
            Nuevo grado
          </Button>
        )
      }
    >
      {(state, pending) => (
        <>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nombreGrado">Nombre</FieldLabel>
              <Input
                id="nombreGrado"
                name="nombreGrado"
                defaultValue={grado?.nombre_grado}
                required
              />
              <FieldError
                errors={state?.errors?.nombreGrado?.map((message) => ({ message }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="nivelEducativo">Nivel educativo</FieldLabel>
              <Select
                name="nivelEducativo"
                defaultValue={grado?.nivel_educativo ?? "Primaria"}
                items={NIVELES}
              >
                <SelectTrigger id="nivelEducativo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primaria">Primaria</SelectItem>
                  <SelectItem value="Bachillerato">Bachillerato</SelectItem>
                </SelectContent>
              </Select>
              <FieldError
                errors={state?.errors?.nivelEducativo?.map((message) => ({ message }))}
              />
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
