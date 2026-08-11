"use client"

import { LogOut } from "lucide-react"

export function LogoutMenuItem() {
  return (
    <button
      type="submit"
      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
    >
      <LogOut className="size-4.5" />
      Cerrar sesión
    </button>
  )
}
