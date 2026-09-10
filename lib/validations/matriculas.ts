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
})
