"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"

import { THEME_STORAGE_KEY, getStoredTheme, type Theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

/**
 * `SidebarContent` se monta dos veces (sidebar de escritorio + de
 * móvil), así que el toggle necesita un store externo compartido —no
 * `useState` local— para que cambiar el tema en uno se refleje en el
 * otro al instante. `useSyncExternalStore` además evita el flash de
 * hidratación: `getServerSnapshot` devuelve "dark" (lo mismo que
 * renderiza el servidor) y React resincroniza con el valor real del
 * cliente después del montaje, sin el `setState` dentro de un efecto
 * que el lint de React marca como anti-patrón.
 */
const listeners = new Set<() => void>()

function setStoredTheme(next: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    // localStorage puede fallar (modo privado, cuota) — el toggle visual igual funciona.
  }
  document.documentElement.classList.toggle("dark", next === "dark")
  listeners.forEach((listener) => listener())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getServerSnapshot(): Theme {
  return "dark"
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getStoredTheme, getServerSnapshot)

  return (
    <button
      type="button"
      onClick={() => setStoredTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className
      )}
    >
      {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </button>
  )
}
