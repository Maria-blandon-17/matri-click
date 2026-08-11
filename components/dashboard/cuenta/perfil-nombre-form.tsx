"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { actualizarNombrePerfil } from "@/lib/actions/mi-perfil"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import type { CrudFormState } from "@/lib/actions/types"

const initialState: CrudFormState = null

export function PerfilNombreForm({ nombreCompleto }: { nombreCompleto: string | null }) {
  const [state, formAction, pending] = useActionState(actualizarNombrePerfil, initialState)

  useEffect(() => {
    if (!state) return
    if (state.message === "ok") {
      toast.success("Nombre actualizado.")
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <Field className="flex-1">
        <Input
          name="nombreCompleto"
          defaultValue={nombreCompleto ?? ""}
          placeholder="Tu nombre completo"
          required
          className="h-11 border-white/10 bg-black/20 text-lg font-semibold"
        />
        <FieldError errors={state?.errors?.nombreCompleto?.map((message) => ({ message }))} />
      </Field>
      <Button type="submit" disabled={pending} variant="outline" className="h-11 border-primary/40 text-primary hover:bg-primary/10">
        {pending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  )
}
