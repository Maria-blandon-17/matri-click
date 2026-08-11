import { z } from "zod"

export const nombrePerfilSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
})

export const cambiarPasswordSchema = z
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
