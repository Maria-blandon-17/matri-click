import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos y condiciones — MatriClick",
  description: "Condiciones de uso de la plataforma MatriClick.",
}

const secciones = [
  {
    titulo: "1. Aceptación de los términos",
    texto:
      "Al crear una cuenta o usar MatriClick aceptas estos términos y condiciones. Si no estás de acuerdo con alguno de ellos, no debes registrarte ni utilizar la plataforma.",
  },
  {
    titulo: "2. Qué es MatriClick",
    texto:
      "MatriClick es un sistema web de gestión académica que permite administrar matrículas, estudiantes, grupos, sedes y periodos de una institución educativa. Las funciones disponibles dependen del rol de cada cuenta (administrador, profesor, acudiente o estudiante).",
  },
  {
    titulo: "3. Registro y cuenta",
    texto:
      "Debes suministrar información veraz, completa y actualizada al registrarte. Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta. Las cuentas nuevas quedan pendientes de vinculación y pueden ser aceptadas, rechazadas o descartadas por el administrador de la institución.",
  },
  {
    titulo: "4. Uso adecuado",
    texto:
      "Te comprometes a usar la plataforma solo para fines académicos y administrativos legítimos. Está prohibido intentar acceder a información de otras personas, alterar o interferir con el funcionamiento del sistema, o usar la plataforma para fines ilícitos.",
  },
  {
    titulo: "5. Datos personales",
    texto:
      "MatriClick trata datos personales (por ejemplo nombre, documento de identidad y correo) únicamente para gestionar los procesos académicos de la institución, conforme a la normativa colombiana de protección de datos personales (Ley 1581 de 2012). Cada usuario solo puede ver la información que le corresponde según su rol, y puedes solicitar la corrección de tus datos a través de la institución.",
  },
  {
    titulo: "6. Matrículas",
    texto:
      "El estado de una matrícula (pendiente, en revisión, activa, rechazada, cancelada, finalizada o expirada) lo define la institución. Las matrículas pendientes o en revisión pueden expirar automáticamente si no se completan dentro del plazo establecido.",
  },
  {
    titulo: "7. Disponibilidad y responsabilidad",
    texto:
      "Procuramos que el servicio esté disponible de forma continua, pero no garantizamos que funcione sin interrupciones o errores. La plataforma se ofrece tal como está, y no nos hacemos responsables por daños derivados de su uso indebido o de eventos fuera de nuestro control.",
  },
  {
    titulo: "8. Cambios a estos términos",
    texto:
      "Podemos actualizar estos términos cuando sea necesario. La versión vigente será siempre la publicada en esta página; el uso continuado de la plataforma implica la aceptación de los cambios.",
  },
  {
    titulo: "9. Contacto",
    texto:
      "Si tienes preguntas sobre estos términos o sobre el tratamiento de tus datos, comunícate con el administrador de tu institución educativa.",
  },
]

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6 sm:pt-40">
      <p className="font-label-mono mb-3 text-xs tracking-widest text-muted-foreground uppercase">
        Legal
      </p>
      <h1 className="text-3xl font-bold sm:text-4xl">Términos y condiciones</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Última actualización: octubre de 2026
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {secciones.map((s) => (
          <section key={s.titulo}>
            <h2 className="mb-2 text-lg font-semibold">{s.titulo}</h2>
            <p className="text-sm leading-relaxed text-white/70">{s.texto}</p>
          </section>
        ))}
      </div>

      <Link
        href="/registro"
        className="mt-12 inline-block text-sm font-medium text-white hover:text-primary hover:underline"
      >
        Volver al registro
      </Link>
    </div>
  )
}
