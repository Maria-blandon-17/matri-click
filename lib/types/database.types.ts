/**
 * Tipos generados manualmente a partir de supabase/migrations/0001_schema.sql y 0002_roles_y_perfiles.sql.
 * Reemplazar por `supabase gen types typescript --project-id <id> > lib/types/database.types.ts`
 * en cuanto el proyecto de Supabase esté creado.
 */

export type NivelEducativo = "Primaria" | "Bachillerato"
export type EstadoProfesor = "Activo" | "Inactivo"
export type TipoDocAcudiente = "TI" | "CC" | "CE" | "Pasaporte"
export type Parentesco = "Padre" | "Madre" | "Tutor" | "Otro"
export type TipoDocEstudiante = "TI" | "RC" | "CE" | "Pasaporte"
export type Genero = "Masculino" | "Femenino" | "Otro"
export type EstadoEstudiante = "Activo" | "Retirado" | "Graduado"
export type EstadoPeriodo = "Activo" | "Finalizado" | "Planeado"
export type EstadoMatricula = "Activa" | "Cancelada" | "Finalizada" | "Pendiente"
export type RolUsuario = "admin" | "profesor" | "acudiente" | "estudiante"

export interface Database {
  public: {
    Tables: {
      sedes: {
        Row: {
          id_sede: string
          nombre_sede: string
          direccion: string | null
          telefono: string | null
          created_at: string
        }
        Insert: {
          id_sede?: string
          nombre_sede: string
          direccion?: string | null
          telefono?: string | null
          created_at?: string
        }
        Relationships: []
        Update: Partial<Database["public"]["Tables"]["sedes"]["Insert"]>
      }
      profesores: {
        Row: {
          id_profesor: string
          documento: string
          nombres: string
          apellidos: string
          telefono: string | null
          correo_electronico: string | null
          estado_profesor: EstadoProfesor
          created_at: string
        }
        Insert: {
          id_profesor?: string
          documento: string
          nombres: string
          apellidos: string
          telefono?: string | null
          correo_electronico?: string | null
          estado_profesor?: EstadoProfesor
          created_at?: string
        }
        Relationships: []
        Update: Partial<Database["public"]["Tables"]["profesores"]["Insert"]>
      }
      grados: {
        Row: {
          id_grado: string
          nombre_grado: string
          nivel_educativo: NivelEducativo
        }
        Insert: {
          id_grado?: string
          nombre_grado: string
          nivel_educativo: NivelEducativo
        }
        Relationships: []
        Update: Partial<Database["public"]["Tables"]["grados"]["Insert"]>
      }
      grupos: {
        Row: {
          id_grupo: string
          id_grado: string
          id_sede: string
          nombre_grupo: string
          cupo_maximo: number
          id_director_grupo: string | null
        }
        Insert: {
          id_grupo?: string
          id_grado: string
          id_sede: string
          nombre_grupo: string
          cupo_maximo?: number
          id_director_grupo?: string | null
        }
        Relationships: []
        Update: Partial<Database["public"]["Tables"]["grupos"]["Insert"]>
      }
      periodos_academicos: {
        Row: {
          id_periodo: string
          nombre_periodo: string
          fecha_inicio: string
          fecha_fin: string
          estado: EstadoPeriodo
        }
        Insert: {
          id_periodo?: string
          nombre_periodo: string
          fecha_inicio: string
          fecha_fin: string
          estado?: EstadoPeriodo
        }
        Relationships: []
        Update: Partial<
          Database["public"]["Tables"]["periodos_academicos"]["Insert"]
        >
      }
      acudientes: {
        Row: {
          id_acudiente: string
          tipo_documento: TipoDocAcudiente
          documento: string
          nombres: string
          apellidos: string
          telefono: string | null
          correo_electronico: string | null
          direccion: string | null
          parentesco: Parentesco
          created_at: string
        }
        Insert: {
          id_acudiente?: string
          tipo_documento: TipoDocAcudiente
          documento: string
          nombres: string
          apellidos: string
          telefono?: string | null
          correo_electronico?: string | null
          direccion?: string | null
          parentesco: Parentesco
          created_at?: string
        }
        Relationships: []
        Update: Partial<Database["public"]["Tables"]["acudientes"]["Insert"]>
      }
      estudiantes: {
        Row: {
          id_estudiante: string
          tipo_documento: TipoDocEstudiante
          documento: string
          nombres: string
          apellidos: string
          fecha_nacimiento: string
          genero: Genero
          id_acudiente: string | null
          fecha_registro: string
          estado_estudiante: EstadoEstudiante
        }
        Insert: {
          id_estudiante?: string
          tipo_documento: TipoDocEstudiante
          documento: string
          nombres: string
          apellidos: string
          fecha_nacimiento: string
          genero: Genero
          id_acudiente?: string | null
          fecha_registro?: string
          estado_estudiante?: EstadoEstudiante
        }
        Relationships: []
        Update: Partial<Database["public"]["Tables"]["estudiantes"]["Insert"]>
      }
      matriculas: {
        Row: {
          id_matricula: string
          codigo_matricula: string
          id_estudiante: string
          id_periodo: string
          id_grupo: string
          fecha_matricula: string
          estado_matricula: EstadoMatricula
          observaciones: string | null
        }
        Insert: {
          id_matricula?: string
          codigo_matricula: string
          id_estudiante: string
          id_periodo: string
          id_grupo: string
          fecha_matricula?: string
          estado_matricula?: EstadoMatricula
          observaciones?: string | null
        }
        Relationships: []
        Update: Partial<Database["public"]["Tables"]["matriculas"]["Insert"]>
      }
      perfiles: {
        Row: {
          id: string
          rol: RolUsuario
          nombre_completo: string | null
          documento: string | null
          rechazado: boolean
          id_profesor: string | null
          id_acudiente: string | null
          id_estudiante: string | null
          created_at: string
        }
        Insert: {
          id: string
          rol: RolUsuario
          nombre_completo?: string | null
          documento?: string | null
          rechazado?: boolean
          id_profesor?: string | null
          id_acudiente?: string | null
          id_estudiante?: string | null
          created_at?: string
        }
        Relationships: []
        Update: Partial<Database["public"]["Tables"]["perfiles"]["Insert"]>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      nivel_educativo: NivelEducativo
      estado_profesor: EstadoProfesor
      tipo_doc_acudiente: TipoDocAcudiente
      parentesco: Parentesco
      tipo_doc_estudiante: TipoDocEstudiante
      genero: Genero
      estado_estudiante: EstadoEstudiante
      estado_periodo: EstadoPeriodo
      estado_matricula: EstadoMatricula
      rol_usuario: RolUsuario
    }
    CompositeTypes: Record<string, never>
  }
}
