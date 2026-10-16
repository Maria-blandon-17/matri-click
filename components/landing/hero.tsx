import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative mx-auto mb-24 flex max-w-3xl flex-col items-center gap-6 px-4 pt-36 pb-24 text-center sm:pt-44">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
        <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(43,102,255,0.85)]" />
        Matrículas escolares, sin el papeleo
      </span>

      <h1 className="text-4xl leading-[1.06] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
        Precisión sin fricción en la gestión académica.
      </h1>

      <p className="max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
        Estudiantes, grupos, sedes y periodos en un solo lugar. Matricula en minutos y sigue la
        ocupación de cada grupo sin salir del panel.
      </p>

      <div className="flex flex-col items-center gap-3 pt-3 sm:flex-row">
        <Button
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_34px_-10px_rgba(43,102,255,0.65)] hover:bg-primary"
          nativeButton={false}
          render={
            <Link href="/registro">
              Crear cuenta gratis
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <Button
          variant="ghost"
          className="rounded-full px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          nativeButton={false}
          render={<Link href="/login">Iniciar sesión</Link>}
        />
      </div>
    </section>
  )
}
