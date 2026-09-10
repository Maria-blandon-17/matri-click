import Link from "next/link"
import { Users, ClipboardList, School, type LucideIcon } from "lucide-react"

import type { ResumenDominios } from "@/lib/actions/dashboard"
import { AnimatedNumber } from "@/components/dashboard/animated-number"
import { cn } from "@/lib/utils"

type Card = {
  href: string
  icon: LucideIcon
  tint: string
  titulo: string
  valor: number
  unidad: string
  pie: { label: string; valor: number | string }[]
}

export function ResumenCards({ resumen }: { resumen: ResumenDominios }) {
  const cards: Card[] = [
    {
      href: "/dashboard/estudiantes",
      icon: Users,
      tint: "bg-primary/10 text-primary",
      titulo: "Comunidad",
      valor: resumen.comunidad.estudiantes,
      unidad: "estudiantes",
      pie: [
        { label: "Acudientes", valor: resumen.comunidad.acudientes },
        { label: "Profesores", valor: resumen.comunidad.profesores },
      ],
    },
    {
      href: "/dashboard/matriculas",
      icon: ClipboardList,
      tint: "bg-emerald-400/10 text-emerald-400",
      titulo: "Matrículas",
      valor: resumen.matriculas.total,
      unidad: "este periodo",
      pie: [
        { label: "Activas", valor: resumen.matriculas.activas },
        { label: "Pendientes", valor: resumen.matriculas.pendientes },
      ],
    },
    {
      href: "/dashboard/academico/grupos",
      icon: School,
      tint: "bg-amber-400/10 text-amber-400",
      titulo: "Académico",
      valor: resumen.academico.grupos,
      unidad: "grupos",
      pie: [
        { label: "Grados", valor: resumen.academico.grados },
        { label: "Ocupación", valor: `${resumen.academico.ocupacionPct}%` },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.titulo}
          href={card.href}
          className="glass-card group rounded-2xl p-4 transition-colors hover:border-primary/30"
        >
          <div className="mb-3 flex items-center gap-3">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full",
                card.tint
              )}
            >
              <card.icon className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">{card.titulo}</h3>
              <p className="text-[11px] text-muted-foreground">{card.unidad}</p>
            </div>
          </div>

          <p className="text-[28px] leading-none font-bold">
            <AnimatedNumber value={card.valor} />
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
            {card.pie.map((p) => (
              <div key={p.label}>
                <p className="font-label-mono text-[9px] tracking-wide text-muted-foreground uppercase">
                  {p.label}
                </p>
                <p className="text-sm font-bold">{p.valor}</p>
              </div>
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
}
