"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { applyTheme } from "@/lib/theme"

/**
 * Re-aplica el tema en cada navegación client-side (el script de
 * `app/layout.tsx` solo corre en la carga inicial / full reload). Monta
 * una sola vez en el layout raíz, no renderiza nada.
 */
export function ThemeManager() {
  const pathname = usePathname()

  useEffect(() => {
    applyTheme(pathname)
  }, [pathname])

  return null
}
