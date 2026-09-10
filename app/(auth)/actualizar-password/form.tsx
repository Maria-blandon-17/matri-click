"use client"

import { useActionState, useState } from "react"
import { Lock, KeyRound, Eye, EyeOff, ArrowRight } from "lucide-react"

import { actualizarPassword, type AuthFormState } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

const initialState: AuthFormState = null

export function ActualizarPasswordForm() {
  const [state, action, pending] = useActionState(actualizarPassword, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={action} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password" className="sr-only">
            Contraseña nueva
          </FieldLabel>
          <div className="relative">
            <Lock className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Contraseña nueva"
              className="h-12 rounded-xl border-white/10 bg-black/20 pr-12 pl-12 placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
          <FieldError errors={state?.errors?.password?.map((message) => ({ message }))} />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword" className="sr-only">
            Confirmar contraseña
          </FieldLabel>
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0"
            />
          </div>
          <FieldError errors={state?.errors?.confirmPassword?.map((message) => ({ message }))} />
        </Field>

        {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="neon-button mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Guardar contraseña"}
          <ArrowRight className="size-5" />
        </button>
      </FieldGroup>
    </form>
  )
}
