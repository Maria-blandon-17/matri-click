"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Users,
  UserPlus,
  ClipboardList,
  BarChart3,
  UserCircle,
  Sparkles,
  ChevronsUpDown,
  LogOut,
  UserRound,
} from "lucide-react"

import { logout } from "@/lib/actions/auth"
import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
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

const TODOS_LOS_ROLES: RolUsuario[] = ["admin", "profesor", "acudiente", "estudiante"]

const nav = [
  {
    label: "Inicio",
    roles: TODOS_LOS_ROLES,
    items: [{ href: "/dashboard/inicio", label: "Inicio", icon: LayoutDashboard }],
  },
  {
    label: "Académico",
    roles: ["admin", "profesor"] as RolUsuario[],
    items: [
      { href: "/dashboard/academico/grados", label: "Grados", icon: GraduationCap },
      { href: "/dashboard/academico/grupos", label: "Grupos", icon: GraduationCap },
      { href: "/dashboard/academico/periodos", label: "Periodos", icon: GraduationCap },
    ],
  },
  {
    label: "Administración",
    // Lo operativo/infraestructura. admin-only por defecto; Matrículas se abre a todos los
    // roles con un override, ya que cada rol necesita ver (una porción de) sus matrículas.
    roles: ["admin"] as RolUsuario[],
    items: [
      { href: "/dashboard/administracion/sedes", label: "Sedes", icon: Building2 },
      { href: "/dashboard/matriculas", label: "Matrículas", icon: ClipboardList, roles: TODOS_LOS_ROLES },
      {
        href: "/dashboard/administracion/cuentas-pendientes",
        label: "Cuentas pendientes",
        icon: UserPlus,
      },
    ],
  },
  {
    label: "Comunidad",
    // Las personas del colegio. Profesores/Acudientes admin-only (acudientes no tiene política
    // de lectura general en RLS). Estudiantes se abre a profesor/acudiente con un override;
    // se excluye el propio rol "estudiante" porque esa pantalla le sería redundante con Inicio.
    roles: ["admin"] as RolUsuario[],
    items: [
      { href: "/dashboard/administracion/profesores", label: "Profesores", icon: Users },
      { href: "/dashboard/administracion/acudientes", label: "Acudientes", icon: Users },
      {
        href: "/dashboard/estudiantes",
        label: "Estudiantes",
        icon: Users,
        roles: ["admin", "profesor", "acudiente"] as RolUsuario[],
      },
    ],
  },
  {
    label: "Sistema",
    roles: ["admin"] as RolUsuario[],
    items: [
      { href: "/dashboard/reportes", label: "Reportes", icon: BarChart3 },
      { href: "/dashboard/cuentas", label: "Cuentas", icon: UserCircle },
    ],
  },
]

export function SidebarNavContent({
  onNavigate,
  rol,
  badges = {},
}: {
  onNavigate?: () => void
  rol: RolUsuario
  badges?: Record<string, number>
}) {
  const pathname = usePathname()
  const seccionesVisibles = nav
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => (item.roles ?? section.roles).includes(rol)),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="flex-1 overflow-y-auto pr-1">
      {seccionesVisibles.map((section) => (
        <div key={section.label} className="mb-2">
          <p className="font-label-mono px-4 pt-4 pb-1 text-[11px] text-muted-foreground/70">
            {section.label}
          </p>
          {section.items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "mx-2 flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary font-bold text-primary-foreground shadow-[0_0_10px_rgba(43,102,255,0.3)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
                {(badges[item.href] ?? 0) > 0 && (
                  <span className="font-label-mono ml-auto rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    {badges[item.href]}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function SidebarProfile({
  nombre,
  correo,
  onNavigate,
}: {
  nombre?: string | null
  correo?: string | null
  onNavigate?: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-left outline-none transition-colors hover:bg-white/[0.06]">
        <Avatar className="size-9 border border-primary/30">
          <AvatarFallback className="bg-card text-xs">
            {initials(nombre || correo)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{nombre || "Mi cuenta"}</p>
          {correo && <p className="truncate text-[10px] text-muted-foreground">{correo}</p>}
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          render={
            <Link
              href="/dashboard/cuentas"
              onClick={onNavigate}
              className="flex w-full items-center gap-2"
            >
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
  )
}

export function SidebarContent({
  onNavigate,
  rol,
  badges = {},
  nombre,
  correo,
}: {
  onNavigate?: () => void
  rol: RolUsuario
  badges?: Record<string, number>
  nombre?: string | null
  correo?: string | null
}) {
  return (
    <>
      <div className="mb-6 flex items-center gap-3 px-2">
        <Logo size={40} className="shadow-[0_0_15px_rgba(43,102,255,0.3)]" />
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] leading-tight font-bold tracking-tight text-primary">
            MatriClick
          </h1>
          <p className="font-label-mono text-[11px] text-muted-foreground">Gestión académica</p>
        </div>
        <ThemeToggle />
      </div>

      <SidebarNavContent onNavigate={onNavigate} rol={rol} badges={badges} />

      <div className="group relative mt-4 cursor-default overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-transparent p-4">
        <div className="relative z-10 flex items-center gap-3">
          <Sparkles className="size-5 text-primary" />
          <div>
            <p className="text-sm">Acceso Premium</p>
            <p className="font-label-mono text-[10px] text-muted-foreground">
              Potenciado con IA
            </p>
          </div>
        </div>
      </div>

      <SidebarProfile nombre={nombre} correo={correo} onNavigate={onNavigate} />
    </>
  )
}

export function Sidebar({
  rol,
  badges = {},
  nombre,
  correo,
}: {
  rol: RolUsuario
  badges?: Record<string, number>
  nombre?: string | null
  correo?: string | null
}) {
  return (
    <aside className="theme-dark-forced sticky top-0 hidden h-svh w-[248px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground md:flex">
      <SidebarContent rol={rol} badges={badges} nombre={nombre} correo={correo} />
    </aside>
  )
}
