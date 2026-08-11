"use client"

import { Plus, Pencil } from "lucide-react"

import { crearGrupo, actualizarGrupo } from "@/lib/actions/grupos"
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
              <Select name="idGrado" defaultValue={grupo?.id_grado} items={gradoItems}>
                <SelectTrigger id="idGrado" className="w-full">
                  <SelectValue placeholder="Selecciona un grado" />
                </SelectTrigger>
                <SelectContent>
                  {grados.map((g) => (
                    <SelectItem key={g.id_grado} value={g.id_grado}>
                      {g.nombre_grado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state?.errors?.idGrado?.map((message) => ({ message }))} />
            </Field>
            <Field>
              <FieldLabel htmlFor="idSede">Sede</FieldLabel>
              <Select name="idSede" defaultValue={grupo?.id_sede} items={sedeItems}>
                <SelectTrigger id="idSede" className="w-full">
                  <SelectValue placeholder="Selecciona una sede" />
                </SelectTrigger>
                <SelectContent>
                  {sedes.map((s) => (
                    <SelectItem key={s.id_sede} value={s.id_sede}>
                      {s.nombre_sede}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state?.errors?.idSede?.map((message) => ({ message }))} />
            </Field>
            <Field>
              <FieldLabel htmlFor="idDirectorGrupo">Director de grupo</FieldLabel>
              <Select
                name="idDirectorGrupo"
                defaultValue={grupo?.id_director_grupo ?? "none"}
                items={{ none: "Sin asignar", ...profesorItems }}
              >
                <SelectTrigger id="idDirectorGrupo" className="w-full">
                  <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {profesores.map((p) => (
                    <SelectItem key={p.id_profesor} value={p.id_profesor}>
                      {p.nombres} {p.apellidos}
                    </SelectItem>
                  ))}
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
