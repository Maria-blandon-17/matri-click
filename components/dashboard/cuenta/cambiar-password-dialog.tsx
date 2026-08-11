"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"

import { cambiarPassword } from "@/lib/actions/mi-perfil"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { CrudDialog } from "@/components/dashboard/crud/crud-dialog"

export function CambiarPasswordDialog() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <CrudDialog
      title="Cambiar contraseña"
      description="Elige una nueva contraseña de al menos 8 caracteres."
      action={cambiarPassword}
      trigger={
        <Button className="neon-button font-label-mono w-full justify-center rounded-lg text-xs">
          <KeyRound className="size-4" />
          Cambiar contraseña
        </Button>
      }
    >
      {(state, pending) => (
        <>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
              />
              <FieldError errors={state?.errors?.password?.map((message) => ({ message }))} />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
              />
              <FieldError
                errors={state?.errors?.confirmPassword?.map((message) => ({ message }))}
              />
            </Field>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="size-3.5"
              />
              Mostrar contraseñas
            </label>
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
