import { z } from "zod"

export const nombrePerfilSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
})

// Autoedición de la propia ficha académica: nunca incluyen documento ni estado —
// esos los protege el trigger de base de datos (solo admin los puede tocar).
export const miFichaProfesorSchema = z.object({
  nombres: z.string().trim().min(1, { message: "Ingresa tus nombres." }),
  apellidos: z.string().trim().min(1, { message: "Ingresa tus apellidos." }),
  telefono: z.string().trim().optional().or(z.literal("")),
  correoElectronico: z
    .string()
    .trim()
    .email({ message: "Ingresa un correo válido." })
    .optional()
    .or(z.literal("")),
})

export const miFichaAcudienteSchema = z.object({
  tipoDocumento: z.enum(["TI", "CC", "CE", "Pasaporte"]),
  nombres: z.string().trim().min(1, { message: "Ingresa tus nombres." }),
  apellidos: z.string().trim().min(1, { message: "Ingresa tus apellidos." }),
  telefono: z.string().trim().optional().or(z.literal("")),
  correoElectronico: z
    .string()
    .trim()
    .email({ message: "Ingresa un correo válido." })
    .optional()
    .or(z.literal("")),
  direccion: z.string().trim().optional().or(z.literal("")),
  parentesco: z.enum(["Padre", "Madre", "Tutor", "Otro"]),
})

export const miFichaEstudianteSchema = z.object({
  tipoDocumento: z.enum(["TI", "RC", "CE", "Pasaporte"]),
  nombres: z.string().trim().min(1, { message: "Ingresa tus nombres." }),
  apellidos: z.string().trim().min(1, { message: "Ingresa tus apellidos." }),
  fechaNacimiento: z.string().min(1, { message: "Ingresa tu fecha de nacimiento." }),
  genero: z.enum(["Masculino", "Femenino", "Otro"]),
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
