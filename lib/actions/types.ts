export type CrudFormState = {
  errors?: Record<string, string[]>
  message?: string
} | null

export type DeleteResult = { error?: string } | undefined

// Traduce el error de Postgres a un mensaje que un usuario final entienda. Las funciones
// eliminarX deben usar esto y RETORNAR el resultado (nunca "throw" el error): un Server Action
// que hace throw pierde su mensaje real en producción — Next.js lo reemplaza por un mensaje
// genérico ("digest") por seguridad, y eso es lo que se veía como un error de React sin sentido.
export function mensajeErrorEliminar(error: {
  code?: string
  message: string
  details?: string | null
}): string {
  // 23503 = foreign_key_violation: hay otras filas que todavía apuntan a esto.
  if (error.code === "23503") {
    const tabla = error.details?.match(/referenced from table "(\w+)"/)?.[1]
    const nombreTabla: Record<string, string> = {
      grupos: "grupos",
      matriculas: "matrículas",
      estudiantes: "estudiantes",
      perfiles: "cuentas de usuario",
    }
    const que = tabla ? (nombreTabla[tabla] ?? tabla) : "otros registros"
    return `No se puede eliminar: todavía hay ${que} que dependen de esto. Reasígnalos o elimínalos primero.`
  }
  return error.message
}
