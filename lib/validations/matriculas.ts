import { z } from "zod"

export const matriculaSchema = z.object({
  idEstudiante: z.string().uuid({ message: "Selecciona un estudiante." }),
  idPeriodo: z.string().uuid({ message: "Selecciona un periodo académico." }),
  idGrupo: z.string().uuid({ message: "Selecciona un grupo." }),
  observaciones: z.string().trim().optional().or(z.literal("")),
})
export type MatriculaInput = z.infer<typeof matriculaSchema>

export const estadoMatriculaSchema = z.object({
  estadoMatricula: z.enum([
    "Pendiente",
    "En revisión",
    "Activa",
    "Rechazada",
    "Cancelada",
    "Finalizada",
    "Expirada",
  ]),
  // Solo se usa (y se pide en la UI) al pasar a "Rechazada"/"Cancelada" — opcional, nunca
  // bloquea el cambio de estado. Ver ROADMAP.md.
  motivo: z.string().trim().max(500, "Máximo 500 caracteres.").optional().or(z.literal("")),
})
