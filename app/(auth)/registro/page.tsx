"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import {
  User,
  Mail,
  IdCard,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react"

import { registro, type AuthFormState } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

const initialState: AuthFormState = null

const inputClassName =
  "h-12 rounded-lg border-transparent bg-black/20 pl-10 placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-0"

export default function RegistroPage() {
  const [state, action, pending] = useActionState(registro, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [rol, setRol] = useState<"acudiente" | "estudiante">("acudiente")

  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-8 shadow-2xl">
      <div className="via-primary absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent opacity-50" />

      <div className="mb-8 flex flex-col items-center text-center">
        <Logo size={48} className="mb-3" />
        <h1 className="mb-2 text-2xl font-bold text-primary">MatriClick</h1>
        <p className="text-lg text-muted-foreground">Crea tu cuenta</p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="nombreCompleto"
              className="font-label-mono text-muted-foreground uppercase"
            >
              Nombre completo
            </FieldLabel>
            <div className="relative">
              <User className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="nombreCompleto"
                name="nombreCompleto"
                placeholder="Ej. Juan Pérez"
                required
                className={inputClassName}
              />
            </div>
            <FieldError
              errors={state?.errors?.nombreCompleto?.map((message) => ({ message }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email" className="font-label-mono text-muted-foreground uppercase">
              Correo electrónico
            </FieldLabel>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className={inputClassName}
              />
            </div>
            <FieldError errors={state?.errors?.email?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="documento"
              className="font-label-mono text-muted-foreground uppercase"
            >
              Número de documento
            </FieldLabel>
            <div className="relative">
              <IdCard className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="documento"
                name="documento"
                placeholder="123456789"
                required
                className={inputClassName}
              />
            </div>
            <FieldError errors={state?.errors?.documento?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <FieldLabel className="font-label-mono text-muted-foreground uppercase">
              Tipo de usuario
            </FieldLabel>
            <input type="hidden" name="rol" value={rol} />
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRol("acudiente")}
                className={cn(
                  "flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 transition-colors",
                  rol === "acudiente" && "border-primary bg-primary/10 text-primary"
                )}
              >
                <Users className="size-5" />
                <span>Acudiente</span>
              </button>
              <button
                type="button"
                onClick={() => setRol("estudiante")}
                className={cn(
                  "flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 transition-colors",
                  rol === "estudiante" && "border-primary bg-primary/10 text-primary"
                )}
              >
                <GraduationCap className="size-5" />
                <span>Estudiante</span>
              </button>
            </div>
            <FieldError errors={state?.errors?.rol?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="password"
              className="font-label-mono text-muted-foreground uppercase"
            >
              Contraseña
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className={cn(inputClassName, "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
              </button>
            </div>
            <FieldError errors={state?.errors?.password?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="confirmPassword"
              className="font-label-mono text-muted-foreground uppercase"
            >
              Confirmar contraseña
            </FieldLabel>
            <div className="relative">
              <KeyRound className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className={inputClassName}
              />
            </div>
            <FieldError
              errors={state?.errors?.confirmPassword?.map((message) => ({ message }))}
            />
          </Field>

          {state?.message && <p className="text-sm text-muted-foreground">{state.message}</p>}

          <button
            type="submit"
            disabled={pending}
            className="neon-button mt-4 flex h-14 items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground transition-opacity disabled:opacity-60"
          >
            {pending ? "Creando cuenta..." : "Crear cuenta"}
            <ArrowRight className="size-5" />
          </button>
        </FieldGroup>
      </form>

      <div className="mt-8 text-center">
        <Link href="/login" className="text-muted-foreground transition-colors hover:text-primary">
          Ya tengo cuenta, iniciar sesión
        </Link>
      </div>
    </div>
  )
}
