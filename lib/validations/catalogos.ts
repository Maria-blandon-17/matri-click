import { z } from "zod"

export const sedeSchema = z.object({
  nombreSede: z.string().trim().min(2, { message: "El nombre es requerido." }),
  direccion: z.string().trim().optional().or(z.literal("")),
  telefono: z.string().trim().optional().or(z.literal("")),
})
export type SedeInput = z.infer<typeof sedeSchema>

export const gradoSchema = z.object({
  nombreGrado: z.string().trim().min(1, { message: "El nombre es requerido." }),
  nivelEducativo: z.enum(["Primaria", "Bachillerato"], {
    message: "Selecciona un nivel educativo.",
  }),
})
export type GradoInput = z.infer<typeof gradoSchema>

export const periodoSchema = z
  .object({
    nombrePeriodo: z.string().trim().min(1, { message: "El nombre es requerido." }),
    fechaInicio: z.string().min(1, { message: "Ingresa la fecha de inicio." }),
    fechaFin: z.string().min(1, { message: "Ingresa la fecha de fin." }),
    estado: z.enum(["Activo", "Finalizado", "Planeado"]),
  })
  .refine((data) => data.fechaFin >= data.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio.",
    path: ["fechaFin"],
  })
export type PeriodoInput = z.infer<typeof periodoSchema>

export const grupoSchema = z.object({
  nombreGrupo: z.string().trim().min(1, { message: "El nombre es requerido." }),
  idGrado: z.string().uuid({ message: "Selecciona un grado." }),
  idSede: z.string().uuid({ message: "Selecciona una sede." }),
  cupoMaximo: z.coerce.number().int().min(1, { message: "El cupo debe ser al menos 1." }),
  idDirectorGrupo: z.string().uuid().optional().or(z.literal("")),
})
export type GrupoInput = z.infer<typeof grupoSchema>
