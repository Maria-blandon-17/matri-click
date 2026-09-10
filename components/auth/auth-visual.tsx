import Image from "next/image"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

/**
 * Contenido del panel de imagen de las pantallas de auth: imagen a
 * sangre completa + marca (link a la landing) arriba y claim abajo.
 * Lo usan `AuthShell` (recuperar / nueva contraseña) y `AuthFlow`
 * (login / registro, donde además se desliza de un lado al otro).
 *
 * `className` lo aporta cada consumidor: alto (`min-h-svh` / `h-full`),
 * padding y — en `AuthFlow` — el `rounded-*` de los bordes.
 */
export function AuthVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden",
        className
      )}
    >
      <Image
        src="/assets/fondo.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 0px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040711]/50 via-[#040711]/20 to-[#040711]/90" />

      <header className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Logo size={32} />
          <span className="text-sm font-bold tracking-wide">MatriClick</span>
        </Link>
      </header>

      <div className="relative z-10 flex flex-col gap-3">
        <p className="max-w-md text-3xl leading-snug font-bold text-balance">
          Precisión sin fricción en la gestión académica.
        </p>
        <p className="font-label-mono text-xs tracking-widest text-white/70 uppercase">
          Estudiantes · Grupos · Sedes · Periodos
        </p>
      </div>
    </div>
  )
}
