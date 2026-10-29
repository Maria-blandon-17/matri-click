"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    src: "/assets/auth-carousel/slide-1.webp",
    alt: "Profesor y estudiante revisando MatriClick en clase",
  },
  {
    src: "/assets/auth-carousel/slide-2.webp",
    alt: "Administrador revisando el panel de MatriClick desde casa",
  },
  {
    src: "/assets/auth-carousel/slide-3.webp",
    alt: "Estudiante llegando a la sede Santa Margarita",
  },
]

const INTERVAL_MS = 5000

/**
 * Contenido del panel de imagen de las pantallas de auth: carrusel de
 * fotos a sangre completa (fundido entre imágenes, con indicadores) +
 * marca (link a la landing) arriba y claim abajo. Lo usan `AuthShell`
 * (recuperar / nueva contraseña) y `AuthFlow` (login / registro, donde
 * además se desliza de un lado a otro — mismo carrusel en ambos porque
 * es el mismo componente).
 *
 * `className` lo aporta cada consumidor: alto (`min-h-svh` / `h-full`),
 * padding y — en `AuthFlow` — el `rounded-*` de los bordes.
 */
export function AuthVisual({ className }: { className?: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden",
        className
      )}
    >
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 50vw, 0px"
          className={`object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="auth-wave" aria-hidden="true" />
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

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Ir a la imagen ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
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
