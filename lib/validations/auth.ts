import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo válido." }),
  password: z.string().min(1, { message: "Ingresa tu contraseña." }),
})

export type LoginInput = z.infer<typeof loginSchema>

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
    rol: z.enum(["acudiente", "estudiante"], {
      message: "Selecciona si eres acudiente o estudiante.",
    }),
    documento: z
      .string()
      .trim()
      .min(4, { message: "Ingresa un número de documento válido." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

export type RegistroInput = z.infer<typeof registroSchema>
