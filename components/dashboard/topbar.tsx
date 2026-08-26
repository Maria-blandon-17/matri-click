import Link from "next/link"
import { LogOut, Plus, UserRound } from "lucide-react"

import { logout } from "@/lib/actions/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import type { RolUsuario } from "@/lib/types/database.types"

function initials(name: string | null | undefined) {
  if (!name) return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function Topbar({
  nombre,
  correo,
  rol,
  pendientesMatriculas = 0,
}: {
  nombre?: string | null
  correo?: string | null
  rol: RolUsuario
  pendientesMatriculas?: number
}) {
  const nombreMostrado = nombre || correo || "tu cuenta"
  const fecha = new Date()
    .toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "long" })
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        <MobileSidebar rol={rol} pendientesMatriculas={pendientesMatriculas} />
        <div>
          <p className="font-label-mono mb-1 text-[11px] tracking-widest text-muted-foreground">
            {fecha}
          </p>
          <h2 className="text-xl font-semibold sm:text-2xl">
            ¡Hola de nuevo, <span className="text-primary/80">{nombreMostrado}</span>!
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {rol === "admin" && (
          <Button
            className="neon-button font-label-mono hidden rounded-lg bg-primary text-xs text-primary-foreground hover:bg-primary sm:inline-flex"
            nativeButton={false}
            render={
              <Link href="/dashboard/matriculas/nueva">
                <Plus className="size-4" />
                Nueva matrícula
                {pendientesMatriculas > 0 && (
                  <span className="ml-1 rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] text-amber-950">
                    {pendientesMatriculas} pendiente{pendientesMatriculas === 1 ? "" : "s"}
                  </span>
                )}
              </Link>
            }
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none">
            <Avatar className="size-10 border-2 border-primary/30">
              <AvatarFallback className="bg-card">{initials(nombre || correo)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={
                <Link href="/dashboard/cuentas" className="flex w-full items-center gap-2">
                  <UserRound className="size-4" />
                  Mi perfil
                </Link>
              }
            />
            <DropdownMenuItem variant="destructive">
              <form action={logout} className="contents">
                <button type="submit" className="flex w-full items-center gap-2">
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
