"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Users,
  ClipboardList,
  BarChart3,
  UserCircle,
  Sparkles,
} from "lucide-react"

import { logout } from "@/lib/actions/auth"
import { LogoutMenuItem } from "@/components/dashboard/logout-menu-item"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

const nav = [
  {
    label: "Inicio",
    items: [{ href: "/dashboard/inicio", label: "Inicio", icon: LayoutDashboard }],
  },
  {
    label: "Académico",
    items: [
      { href: "/dashboard/academico/grados", label: "Grados", icon: GraduationCap },
      { href: "/dashboard/academico/grupos", label: "Grupos", icon: GraduationCap },
      { href: "/dashboard/academico/periodos", label: "Periodos", icon: GraduationCap },
    ],
  },
  {
    label: "Administración",
    items: [
      { href: "/dashboard/administracion/sedes", label: "Sedes", icon: Building2 },
      { href: "/dashboard/administracion/profesores", label: "Profesores", icon: Users },
      { href: "/dashboard/administracion/acudientes", label: "Acudientes", icon: Users },
    ],
  },
  {
    label: "Estudiantes",
    items: [{ href: "/dashboard/estudiantes", label: "Estudiantes", icon: Users }],
  },
  {
    label: "Matrículas",
    items: [{ href: "/dashboard/matriculas", label: "Matrículas", icon: ClipboardList }],
  },
  {
    label: "Sistema",
    items: [
      { href: "/dashboard/reportes", label: "Reportes", icon: BarChart3 },
      { href: "/dashboard/cuentas", label: "Cuentas", icon: UserCircle },
    ],
  },
]

export function SidebarNavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex-1 overflow-y-auto pr-1">
      {nav.map((section) => (
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
                  "mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary font-bold text-primary-foreground shadow-[0_0_10px_rgba(0,102,255,0.3)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="mb-6 flex items-center gap-3 px-2">
        <Logo size={40} className="shadow-[0_0_15px_rgba(0,102,255,0.3)]" />
        <div>
          <h1 className="text-[22px] leading-tight font-bold tracking-tight text-primary">
            MatriClick
          </h1>
          <p className="font-label-mono text-[11px] text-muted-foreground">Gestión académica</p>
        </div>
      </div>

      <SidebarNavContent onNavigate={onNavigate} />

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

      <div className="mt-2 border-t border-white/5 pt-2">
        <form action={logout}>
          <LogoutMenuItem />
        </form>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-full w-[260px] flex-col gap-4 border-r border-white/10 bg-card/60 p-4 shadow-2xl backdrop-blur-xl md:flex">
      <SidebarContent />
    </aside>
  )
}
