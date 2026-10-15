"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

import { login, type AuthFormState } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

const initialState: AuthFormState = null

export function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [state, action, pending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Hola de nuevo</h1>
        <p className="text-sm text-white/70">Inicia sesión para entrar a tu panel</p>
      </div>

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
                className="h-12 rounded-xl auth-field pl-12 placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
            <FieldError errors={state?.errors?.email?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password" className="sr-only">
              Contraseña
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Contraseña"
                className="h-12 rounded-xl auth-field pr-12 pl-12 placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0"
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

          <div className="flex justify-end">
            <Link
              href="/recuperar"
              className="text-xs font-medium text-white transition-colors hover:text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          <button
            type="submit"
            disabled={pending}
            className="neon-button mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground transition-opacity disabled:opacity-60"
          >
            {pending ? "Ingresando..." : "Iniciar sesión"}
            <ArrowRight className="size-5" />
          </button>

          <p className="pt-2 text-center text-xs text-white/70">
            ¿No tienes cuenta?
            <button
              type="button"
              onClick={onSwitch}
              className="ml-1 font-medium text-white hover:text-primary hover:underline"
            >
              Regístrate
            </button>
          </p>
        </FieldGroup>
      </form>
    </div>
  )
}
