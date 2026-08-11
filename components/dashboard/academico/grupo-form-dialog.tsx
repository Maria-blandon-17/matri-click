"use client"

import { Plus, Pencil } from "lucide-react"

import { crearGrupo, actualizarGrupo } from "@/lib/actions/grupos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { CrudDialog } from "@/components/dashboard/crud/crud-dialog"
import type { Database } from "@/lib/types/database.types"

type Grado = Database["public"]["Tables"]["grados"]["Row"]
type Sede = Database["public"]["Tables"]["sedes"]["Row"]
type Profesor = Database["public"]["Tables"]["profesores"]["Row"]

type Grupo = {
  id_grupo: string
  nombre_grupo: string
  cupo_maximo: number
  id_grado: string
  id_sede: string
  id_director_grupo: string | null
}

export function GrupoFormDialog({
  grupo,
  grados,
  sedes,
  profesores,
}: {
  grupo?: Grupo
  grados: Grado[]
  sedes: Sede[]
  profesores: Profesor[]
}) {
  const isEdit = Boolean(grupo)
  const action = isEdit ? actualizarGrupo.bind(null, grupo!.id_grupo) : crearGrupo

  const gradoItems = Object.fromEntries(grados.map((g) => [g.id_grado, g.nombre_grado]))
  const sedeItems = Object.fromEntries(sedes.map((s) => [s.id_sede, s.nombre_sede]))
  const profesorItems = Object.fromEntries(
    profesores.map((p) => [p.id_profesor, `${p.nombres} ${p.apellidos}`])
  )

  return (
    <CrudDialog
      title={isEdit ? "Editar grupo" : "Nuevo grupo"}
      action={action}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100 hover:text-primary">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="neon-button">
            <Plus className="size-4" />
            Nuevo grupo
          </Button>
        )
      }
    >
      {(state, pending) => (
        <>
          <FieldGroup>
            <Field orientation="responsive">
              <div className="w-full">
                <FieldLabel htmlFor="nombreGrupo">Nombre del grupo</FieldLabel>
                <Input
                  id="nombreGrupo"
                  name="nombreGrupo"
                  placeholder="5-A"
                  defaultValue={grupo?.nombre_grupo}
                  required
                />
              </div>
              <div className="w-full">
                <FieldLabel htmlFor="cupoMaximo">Cupo máximo</FieldLabel>
                <Input
                  id="cupoMaximo"
                  name="cupoMaximo"
                  type="number"
                  min={1}
                  defaultValue={grupo?.cupo_maximo ?? 30}
                  required
                />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="idGrado">Grado</FieldLabel>
              <Combobox name="idGrado" defaultValue={grupo?.id_grado} items={gradoItems}>
                <ComboboxTrigger id="idGrado" className="w-full">
                  <ComboboxValue placeholder="Selecciona un grado" />
                </ComboboxTrigger>
                <ComboboxContent />
              </Combobox>
              <FieldError errors={state?.errors?.idGrado?.map((message) => ({ message }))} />
            </Field>
            <Field>
              <FieldLabel htmlFor="idSede">Sede</FieldLabel>
              <Combobox name="idSede" defaultValue={grupo?.id_sede} items={sedeItems}>
                <ComboboxTrigger id="idSede" className="w-full">
                  <ComboboxValue placeholder="Selecciona una sede" />
                </ComboboxTrigger>
                <ComboboxContent />
              </Combobox>
              <FieldError errors={state?.errors?.idSede?.map((message) => ({ message }))} />
            </Field>
            <Field>
              <FieldLabel htmlFor="idDirectorGrupo">Director de grupo</FieldLabel>
              <Combobox
                name="idDirectorGrupo"
                defaultValue={grupo?.id_director_grupo ?? "none"}
                items={{ none: "Sin asignar", ...profesorItems }}
              >
                <ComboboxTrigger id="idDirectorGrupo" className="w-full">
                  <ComboboxValue placeholder="Sin asignar" />
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
