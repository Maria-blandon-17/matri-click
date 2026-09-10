import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import type { RolUsuario } from "@/lib/types/database.types"

/** Fecha + saludo — bloque izquierdo del header en /dashboard/inicio. */
export function DashboardGreeting({
  nombre,
  correo,
}: {
  nombre?: string | null
  correo?: string | null
}) {
  const nombreMostrado = nombre || correo || "tu cuenta"
  const fecha = new Date()
    .toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "long" })
    .toUpperCase()

  return (
    <div>
      <p className="font-label-mono mb-1 text-[11px] tracking-widest text-muted-foreground">
        {fecha}
      </p>
      <h2 className="text-xl font-semibold sm:text-2xl">
        ¡Hola de nuevo, <span className="text-primary/80">{nombreMostrado}</span>!
      </h2>
    </div>
  )
}

/**
 * Fila superior del dashboard: menú móvil + `greeting` opcional. El menú
 * del avatar (Mi perfil / Cerrar sesión) vive al pie del sidebar.
 *
 * En /dashboard/inicio se renderiza DENTRO de la columna central (así el
 * saludo queda alineado con el contenido y la columna derecha arranca a
 * la misma altura). En el resto de páginas lo monta `Topbar`.
 */
export function DashboardHeader({
  nombre,
  correo,
  rol,
  badges = {},
  greeting,
}: {
  nombre?: string | null
  correo?: string | null
  rol: RolUsuario
  badges?: Record<string, number>
  greeting?: React.ReactNode
}) {
  return (
    <header className="flex items-center gap-4">
      <MobileSidebar rol={rol} badges={badges} nombre={nombre} correo={correo} />
      {greeting}
    </header>
  )
}
