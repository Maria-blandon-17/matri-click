import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo válido." }),
  password: z.string().min(1, { message: "Ingresa tu contraseña." }),
})

export type LoginInput = z.infer<typeof loginSchema>

export const recuperarSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo válido." }),
})

export const nuevaPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

/** Versión vigente del texto de /terminos; subirla si el texto cambia. */
export const TERMINOS_VERSION = "2026-10"

export const registroSchema = z
  .object({
    nombreCompleto: z
      .string()
      .trim()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "Ingresa un correo válido." }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
    confirmPassword: z.string(),
    rol: z.enum(["acudiente", "estudiante", "profesor"], {
      message: "Selecciona tu tipo de cuenta.",
    }),
    documento: z
      .string()
      .trim()
      .min(4, { message: "Ingresa un número de documento válido." })
      .regex(/^\d+$/, { message: "El documento solo puede tener números." }),
    terminos: z.literal("on", { message: "Debes aceptar los términos y condiciones." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

export type RegistroInput = z.infer<typeof registroSchema>
