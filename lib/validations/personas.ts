import { z } from "zod"

export const profesorSchema = z.object({
  documento: z.string().trim().min(4, { message: "Ingresa un documento válido." }),
  nombres: z.string().trim().min(1, { message: "Ingresa los nombres." }),
  apellidos: z.string().trim().min(1, { message: "Ingresa los apellidos." }),
  telefono: z.string().trim().optional().or(z.literal("")),
  correoElectronico: z
    .string()
    .trim()
    .email({ message: "Ingresa un correo válido." })
    .optional()
    .or(z.literal("")),
  estadoProfesor: z.enum(["Activo", "Inactivo"]),
})
export type ProfesorInput = z.infer<typeof profesorSchema>

export const acudienteSchema = z.object({
  tipoDocumento: z.enum(["TI", "CC", "CE", "Pasaporte"]),
  documento: z.string().trim().min(4, { message: "Ingresa un documento válido." }),
  nombres: z.string().trim().min(1, { message: "Ingresa los nombres." }),
  apellidos: z.string().trim().min(1, { message: "Ingresa los apellidos." }),
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
export type AcudienteInput = z.infer<typeof acudienteSchema>

export const estudianteSchema = z.object({
  tipoDocumento: z.enum(["TI", "RC", "CE", "Pasaporte"]),
  documento: z.string().trim().min(4, { message: "Ingresa un documento válido." }),
  nombres: z.string().trim().min(1, { message: "Ingresa los nombres." }),
  apellidos: z.string().trim().min(1, { message: "Ingresa los apellidos." }),
  fechaNacimiento: z.string().min(1, { message: "Ingresa la fecha de nacimiento." }),
  genero: z.enum(["Masculino", "Femenino", "Otro"]),
  idAcudiente: z.string().uuid().optional().or(z.literal("")),
  estadoEstudiante: z.enum(["Activo", "Retirado", "Graduado"]),
})
export type EstudianteInput = z.infer<typeof estudianteSchema>
