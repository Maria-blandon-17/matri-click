"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

/**
 * Fase 2 del modo claro/oscuro (ver CLAUDE.md "Modo claro/oscuro del
 * dashboard"): arranca solo con `/dashboard/inicio`. Esa ruta pierde el
 * `theme-dark-forced` y responde de verdad al toggle (fondo/texto claros
 * en modo claro). El resto de pantallas (catálogos/CRUD) se quedan
 * exactamente como antes, oscuras siempre, hasta que se migren una por
 * una.
 */
export function MainThemeScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const esInicio = pathname === "/dashboard/inicio"

  return (
    <main
      className={cn(
        "min-w-0 flex-1 space-y-5 rounded-2xl bg-background p-4 text-foreground sm:p-6",
        !esInicio && "theme-dark-forced"
      )}
    >
      {children}
    </main>
  )
}
