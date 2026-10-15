"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
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
  School,
  ArrowRight,
} from "lucide-react"

import { registro, type AuthFormState } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

const initialState: AuthFormState = null

const inputClassName =
  "h-12 rounded-xl auth-field pl-12 placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0"

export function RegistroForm({ onSwitch }: { onSwitch: () => void }) {
  const [state, action, pending] = useActionState(registro, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [rol, setRol] = useState<"acudiente" | "estudiante" | "profesor">(
    state?.values?.rol === "estudiante" || state?.values?.rol === "profesor"
      ? state.values.rol
      : "acudiente"
  )

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success(state.message ?? "Cuenta creada correctamente.")
    } else if (state.message) {
      toast.error(state.message)
    } else if (state.errors) {
      toast.error("Revisa los campos marcados en rojo.")
    }
  }, [state])

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Crea tu cuenta</h1>
        <p className="text-sm text-white/70">
          Regístrate para gestionar tus matrículas
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nombreCompleto" className="sr-only">
              Nombre completo
            </FieldLabel>
            <div className="relative">
              <User className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="nombreCompleto"
                name="nombreCompleto"
                placeholder="Nombre completo"
                defaultValue={state?.values?.nombreCompleto}
                required
                className={inputClassName}
              />
            </div>
            <FieldError errors={state?.errors?.nombreCompleto?.map((message) => ({ message }))} />
          </Field>

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
                placeholder="Correo electrónico"
                defaultValue={state?.values?.email}
                required
                autoComplete="email"
                className={inputClassName}
              />
            </div>
            <FieldError errors={state?.errors?.email?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <FieldLabel htmlFor="documento" className="sr-only">
              Número de documento
            </FieldLabel>
            <div className="relative">
              <IdCard className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="documento"
                name="documento"
                placeholder="Número de documento"
                defaultValue={state?.values?.documento}
                required
                className={inputClassName}
              />
            </div>
            <FieldError errors={state?.errors?.documento?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <FieldLabel className="font-label-mono ml-1 text-xs text-white/70 uppercase">
              Tipo de usuario
            </FieldLabel>
            <input type="hidden" name="rol" value={rol} />
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRol("acudiente")}
                className={cn(
                  "flex h-12 flex-col items-center justify-center gap-1 rounded-xl border text-xs transition-colors sm:flex-row sm:gap-2 sm:text-sm",
                  rol === "acudiente" ? "border-primary bg-primary/10 text-primary" : "auth-field"
                )}
              >
                <Users className="size-4.5 sm:size-5" />
                <span>Acudiente</span>
              </button>
              <button
                type="button"
                onClick={() => setRol("estudiante")}
                className={cn(
                  "flex h-12 flex-col items-center justify-center gap-1 rounded-xl border text-xs transition-colors sm:flex-row sm:gap-2 sm:text-sm",
                  rol === "estudiante" ? "border-primary bg-primary/10 text-primary" : "auth-field"
                )}
              >
                <GraduationCap className="size-4.5 sm:size-5" />
                <span>Estudiante</span>
              </button>
              <button
                type="button"
                onClick={() => setRol("profesor")}
                className={cn(
                  "flex h-12 flex-col items-center justify-center gap-1 rounded-xl border text-xs transition-colors sm:flex-row sm:gap-2 sm:text-sm",
                  rol === "profesor" ? "border-primary bg-primary/10 text-primary" : "auth-field"
                )}
              >
                <School className="size-4.5 sm:size-5" />
                <span>Profesor</span>
              </button>
            </div>
            <FieldError errors={state?.errors?.rol?.map((message) => ({ message }))} />
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
                placeholder="Contraseña"
                required
                autoComplete="new-password"
                className={cn(inputClassName, "pr-12")}
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
                placeholder="Repite la contraseña"
                required
                autoComplete="new-password"
                className={inputClassName}
              />
            </div>
            <FieldError errors={state?.errors?.confirmPassword?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <label className="flex cursor-pointer items-start gap-3 text-xs text-white/70">
              <input
                type="checkbox"
                name="terminos"
                required
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
              />
              <span>
                Acepto los{" "}
                <Link
                  href="/terminos"
                  target="_blank"
                  className="font-medium text-white hover:text-primary hover:underline"
                >
                  términos y condiciones
                </Link>
              </span>
            </label>
            <FieldError errors={state?.errors?.terminos?.map((message) => ({ message }))} />
          </Field>

          {state?.message && (
            <p className={cn("text-sm", state.success ? "text-emerald-400" : "text-destructive")}>
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="neon-button mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground transition-opacity disabled:opacity-60"
          >
            {pending ? "Creando cuenta..." : "Crear cuenta"}
            <ArrowRight className="size-5" />
          </button>

          <p className="pt-2 text-center text-xs text-white/70">
            ¿Ya tienes cuenta?
            <button
              type="button"
              onClick={onSwitch}
              className="ml-1 font-medium text-white hover:text-primary hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </FieldGroup>
      </form>
    </div>
  )
}
