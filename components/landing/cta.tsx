import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Cta() {
  return (
    <section className="mx-auto mb-24 max-w-7xl px-4 sm:px-6">
      <div className="bg-hero-glow glass-card relative overflow-hidden rounded-2xl p-12 text-center">
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Transforma tu gestión académica</h2>
          <p className="mb-8 text-muted-foreground">
            Crea tu cuenta gratis y empieza a gestionar matrículas, estudiantes y sedes hoy mismo.
          </p>
          <Button
            size="lg"
            className="neon-button font-label-mono rounded-xl bg-primary px-8 py-4 text-xs text-primary-foreground hover:bg-primary"
            nativeButton={false}
            render={
              <Link href="/registro">
                <Sparkles className="size-4" />
                Comienza gratis
              </Link>
            }
          />
        </div>
      </div>
    </section>
  )
}
