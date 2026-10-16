"use client"

import Image from "next/image"
import { MapPin, Phone, Plus, Building2 } from "lucide-react"

import { eliminarSede } from "@/lib/actions/sedes"
import type { SedeConEstadisticas } from "@/lib/actions/sedes"
import { SedeFormDialog } from "@/components/dashboard/sedes/sede-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { cn } from "@/lib/utils"

function etiquetaNiveles(niveles: string[]) {
  if (niveles.length === 0) return null
  if (niveles.length > 1) return "Primaria y Bachillerato"
  return niveles[0]
}

export function SedesCards({
  sedes,
  esAdmin,
}: {
  sedes: SedeConEstadisticas[]
  esAdmin: boolean
}) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {sedes.map((sede) => {
        const ocupacion =
          sede.cupoTotal > 0
            ? Math.min(100, Math.round((sede.matriculasActivas / sede.cupoTotal) * 100))
            : null
        const nivel = etiquetaNiveles(sede.niveles)

        return (
          <article
            key={sede.id_sede}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#141E30] shadow-lg transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6),0_0_20px_-3px_rgba(43,102,255,0.2)]"
          >
            <div>
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                {sede.imagen_url ? (
                  <Image
                    src={sede.imagen_url}
                    alt={sede.nombre_sede}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600">
                    <Building2 className="size-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141E30] via-black/10 to-transparent" />
                {nivel && (
                  <span className="absolute top-3 left-3 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-md">
                    {nivel}
                  </span>
                )}
                {esAdmin && (
                  <div className="absolute top-3 right-3 rounded-lg bg-black/50 backdrop-blur-md">
                    <SedeFormDialog sede={sede} />
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-lg font-bold text-white transition-colors group-hover:text-primary">
                    {sede.nombre_sede}
                  </h3>
                </div>

                <div className="space-y-2 border-y border-white/10 py-3 text-xs text-slate-300">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="size-4 shrink-0 text-primary" />
                      <span className="font-medium text-slate-200">
                        {sede.direccion ?? "Dirección por registrar"}
                      </span>
                    </div>
                    {sede.direccion && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sede.direccion)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-[11px] text-primary hover:underline"
                      >
                        Ver en mapa
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="size-4 shrink-0 text-slate-400" />
                    <span>{sede.telefono ?? "Teléfono por registrar"}</span>
                  </div>
                </div>

                {sede.cupoTotal > 0 ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Aforo ocupado</span>
                      <span className="font-bold text-primary">
                        {ocupacion}%{" "}
                        <span className="font-normal text-slate-400">
                          ({sede.matriculasActivas} / {sede.cupoTotal} cupos)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-black/30">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                        style={{ width: `${ocupacion}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Aún no tiene grupos asignados.
                  </p>
                )}

                {sede.totalGrupos > 0 && (
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2.5 text-xs">
                    <span className="block text-[10px] uppercase text-slate-400">
                      Grupos
                    </span>
                    <span className="font-semibold text-white">
                      {sede.totalGrupos} grupo{sede.totalGrupos === 1 ? "" : "s"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {esAdmin && (
              <div className="flex items-center justify-end border-t border-white/10 bg-black/20 px-5 py-3.5">
                <DeleteButton
                  itemLabel={`la sede "${sede.nombre_sede}"`}
                  action={eliminarSede.bind(null, sede.id_sede)}
                />
              </div>
            )}
          </article>
        )
      })}

      {esAdmin && (
        <SedeFormDialog
          trigger={
            <button
              type="button"
              className={cn(
                "flex min-h-[380px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-8 text-center transition-colors duration-200",
                "hover:border-primary/60 hover:bg-primary/5"
              )}
            >
              <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Plus className="size-7" />
              </div>
              <h3 className="mt-5 text-sm font-bold text-white">
                Registrar nueva sede
              </h3>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-400">
                Agrega una nueva sede o campus con su dirección, teléfono e imagen.
              </p>
            </button>
          }
        />
      )}
    </section>
  )
}
