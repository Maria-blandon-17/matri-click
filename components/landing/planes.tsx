import Link from "next/link"
import { Check, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

const gratis = [
  "Matrículas en línea, sin límite de estudiantes",
  "Gestión de estudiantes, acudientes y profesores",
  "1 sede, con grados, grupos y periodos académicos",
  "Roles y permisos para cada tipo de usuario",
]

const pro = [
  "Sedes ilimitadas para redes de colegios con varias sedes",
  "Reportes exportables (Excel/PDF) y comparativas entre sedes y periodos",
  "Analítica predictiva: proyección de cupos y alertas de deserción",
  "Notificaciones automáticas a acudientes por email/WhatsApp",
]

export function Planes() {
  return (
    <section id="planes" className="mx-auto mb-24 max-w-7xl px-4 sm:px-6">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <p className="font-label-mono mb-3 text-xs tracking-widest text-muted-foreground uppercase">
          Planes
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Elige tu plan</h2>
        <div className="mx-auto mt-4 mb-6 h-0.5 w-16 rounded-full bg-primary shadow-[0_0_10px_rgba(0,102,255,0.6)]" />
        <p className="text-sm text-muted-foreground">
          Todo lo que ves en esta página está disponible hoy, gratis. Pro llega más adelante con
          herramientas para instituciones que necesitan escalar.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-6 md:grid-cols-2">
        {/* Gratis: plan destacado, activo hoy */}
        <div className="glass-card relative z-10 flex flex-col rounded-2xl border-t border-t-primary/40 p-8 shadow-[0_0_40px_rgba(0,102,255,0.12)] md:scale-105">
          <span className="font-label-mono mb-4 w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] text-emerald-400 uppercase">
            Disponible hoy
          </span>
          <h3 className="text-lg font-medium text-muted-foreground">Gratis</h3>
          <p className="mb-6 text-4xl font-bold">
            $0<span className="text-base font-normal text-muted-foreground"> /siempre</span>
          </p>
          <ul className="mb-8 flex flex-1 flex-col gap-4">
            {gratis.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button
            className="neon-button font-label-mono w-full justify-center rounded-lg text-xs"
            nativeButton={false}
            render={<Link href="/registro">Comienza gratis</Link>}
          />
        </div>

        {/* Pro: en construcción, sin CTA activo */}
        <div className="glass-card relative flex flex-col overflow-hidden rounded-2xl border-t border-t-white/10 p-8">
          <div className="absolute top-5 -right-9 rotate-45 bg-white/10 px-10 py-1">
            <span className="font-label-mono text-[10px] text-muted-foreground uppercase">
              Próximamente
            </span>
          </div>
          <h3 className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Pro
          </h3>
          <p className="mb-6 text-4xl font-bold text-muted-foreground">Por definir</p>
          <ul className="mb-8 flex flex-1 flex-col gap-4">
            {pro.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled
            className="font-label-mono w-full cursor-not-allowed rounded-lg border border-white/10 py-3 text-center text-xs text-muted-foreground opacity-70"
          >
            Próximamente
          </button>
        </div>
      </div>
    </section>
  )
}
