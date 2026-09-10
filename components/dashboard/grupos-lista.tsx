import Link from "next/link"
import { School, ChevronRight } from "lucide-react"

import type { GrupoConRelaciones } from "@/lib/actions/grupos"

export function GruposLista({ grupos }: { grupos: GrupoConRelaciones[] }) {
  return (
    <div className="glass-card flex flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">Grupos</h3>
        <Link
          href="/dashboard/academico/grupos"
          className="font-label-mono text-[11px] text-muted-foreground underline decoration-white/20 transition-colors hover:text-foreground"
        >
          Ver todos
        </Link>
      </div>

      {grupos.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          Aún no hay grupos creados.
        </p>
      ) : (
        <ul className="space-y-3">
          {grupos.slice(0, 5).map((g) => (
            <li key={g.id_grupo}>
              <Link
                href="/dashboard/academico/grupos"
                className="group flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <School className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{g.nombre_grupo}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {[g.grados?.nombre_grado, g.sedes?.nombre_sede].filter(Boolean).join(" · ") ||
                        "Sin grado ni sede"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
