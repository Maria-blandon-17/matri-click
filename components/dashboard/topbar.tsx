"use client"

import { usePathname } from "next/navigation"

import { DashboardHeader, DashboardGreeting } from "@/components/dashboard/dashboard-header"
import type { RolUsuario } from "@/lib/types/database.types"

/**
 * Header a lo ancho completo para todas las páginas del dashboard EXCEPTO
 * /dashboard/inicio, que renderiza su propio `DashboardHeader` dentro de
 * la columna central (ver `InicioFiltroPeriodo`) para alinear el buscador
 * y el avatar con el saludo.
 */
export function Topbar({
  nombre,
  correo,
  rol,
  badges = {},
}: {
  nombre?: string | null
  correo?: string | null
  rol: RolUsuario
  badges?: Record<string, number>
}) {
  const pathname = usePathname()
  if (pathname === "/dashboard/inicio") return null

  return (
    <DashboardHeader
      nombre={nombre}
      correo={correo}
      rol={rol}
      badges={badges}
      greeting={<DashboardGreeting nombre={nombre} correo={correo} />}
    />
  )
}
