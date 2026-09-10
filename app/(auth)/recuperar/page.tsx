"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Mail, ArrowLeft } from "lucide-react"

import { solicitarRecuperacion, type AuthFormState } from "@/lib/actions/auth"
import { AuthShell } from "@/components/auth/auth-shell"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

const initialState: AuthFormState = null

export default function RecuperarPage() {
  const [state, action, pending] = useActionState(solicitarRecuperacion, initialState)

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-sm text-muted-foreground">
          Escribe tu correo y te enviamos un enlace para crear una nueva.
        </p>
      </div>

      {state?.success ? (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-center text-sm text-muted-foreground">
          {state.message}
        </div>
      ) : (
        <form action={action} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email" className="sr-only">
                Correo electrónico
              </FieldLabel>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Correo electrónico"
                  className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0"
                />
              </div>
              <FieldError errors={state?.errors?.email?.map((message) => ({ message }))} />
            </Field>

            {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

            <button
              type="submit"
              disabled={pending}
              className="neon-button mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground transition-opacity disabled:opacity-60"
            >
              {pending ? "Enviando..." : "Enviar enlace"}
            </button>
          </FieldGroup>
        </form>
      )}

      <p className="pt-6 text-center text-xs text-muted-foreground">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Volver a iniciar sesión
        </Link>
      </p>
    </AuthShell>
  )
}
