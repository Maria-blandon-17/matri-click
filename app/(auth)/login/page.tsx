"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

import { login, type AuthFormState } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Logo } from "@/components/brand/logo"

const initialState: AuthFormState = null

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="glass-card flex flex-col items-center rounded-2xl p-8 shadow-2xl">
      <div className="mb-10 flex flex-col items-center text-center">
        <Logo size={56} className="mb-4" />
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary">MatriClick</h1>
        <p className="text-muted-foreground">Gestión académica de precisión</p>
      </div>

      <form action={action} className="flex w-full flex-col gap-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email" className="font-label-mono ml-1 text-muted-foreground">
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
                placeholder="estudiante@institucion.edu"
                className="h-12 rounded-lg border-white/10 bg-black/20 pl-12 placeholder:text-muted-foreground/30 focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
            <FieldError errors={state?.errors?.email?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password" className="font-label-mono ml-1 text-muted-foreground">
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
                placeholder="••••••••"
                className="h-12 rounded-lg border-white/10 bg-black/20 pr-12 pl-12 placeholder:text-muted-foreground/30 focus-visible:border-primary focus-visible:ring-0"
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
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
          <button
            type="submit"
            disabled={pending}
            className="neon-button mt-4 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground transition-opacity disabled:opacity-60"
          >
            {pending ? "Ingresando..." : "Iniciar sesión"}
            <ArrowRight className="size-5" />
          </button>
        </FieldGroup>
      </form>

      <p className="mt-8 text-center text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-primary hover:text-primary/80">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
