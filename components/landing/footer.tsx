import Image from "next/image"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"

const navegacion = [
  { label: "Módulos", href: "#modules" },
  { label: "Cómo funciona", href: "#how-it-works" },
  { label: "Planes", href: "#planes" },
]

const cuenta = [
  { label: "Iniciar sesión", href: "/login" },
  { label: "Crear cuenta", href: "/registro" },
]

const legal = [{ label: "Términos y condiciones", href: "/terminos" }]

export function Footer() {
  return (
    <footer className="relative z-10 w-full">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Logo size={36} />
              <span className="text-lg font-black tracking-tight">MatriClick</span>
              <span className="h-6 w-px bg-white/15" aria-hidden="true" />
              <Image
                src="/assets/institucion-logo.jpeg"
                alt="Institución Educativa Barrio Santa Margarita"
                width={90}
                height={90}
                className="size-9 rounded-full bg-white object-cover"
              />
              <Image
                src="/assets/sena-logo.png"
                alt="SENA"
                width={96}
                height={96}
                className="size-9 object-contain"
              />
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Precisión sin fricción en la gestión académica. Estudiantes, grupos, sedes y periodos
              en un solo panel.
            </p>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col gap-3">
            <p className="font-label-mono text-xs tracking-widest text-muted-foreground uppercase">
              Navegación
            </p>
            <ul className="flex flex-col gap-2.5">
              {navegacion.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cuenta */}
          <nav className="flex flex-col gap-3">
            <p className="font-label-mono text-xs tracking-widest text-muted-foreground uppercase">
              Cuenta
            </p>
            <ul className="flex flex-col gap-2.5">
              {cuenta.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav className="flex flex-col gap-3">
            <p className="font-label-mono text-xs tracking-widest text-muted-foreground uppercase">
              Legal
            </p>
            <ul className="flex flex-col gap-2.5">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MatriClick. Todos los derechos reservados.
          </p>
          <p className="font-label-mono text-xs tracking-widest text-muted-foreground uppercase">
            Precisión sin fricción
          </p>
        </div>
      </div>
    </footer>
  )
}
