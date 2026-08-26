"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"

import type { Database } from "@/lib/types/database.types"

type Periodo = Database["public"]["Tables"]["periodos_academicos"]["Row"]

export function MatriculasFilters({ periodos }: { periodos: Periodo[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-card/30 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="font-label-mono text-xs text-muted-foreground">Periodo:</label>
          <select
            className="cursor-pointer rounded-lg border border-white/10 bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
            defaultValue={searchParams.get("periodo") ?? "all"}
            onChange={(e) => setParam("periodo", e.target.value)}
          >
            <option value="all">Todos los periodos</option>
            {periodos.map((p) => (
              <option key={p.id_periodo} value={p.id_periodo}>
                {p.nombre_periodo}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-label-mono text-xs text-muted-foreground">Estado:</label>
          <select
            className="cursor-pointer rounded-lg border border-white/10 bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
            defaultValue={searchParams.get("estado") ?? "all"}
            onChange={(e) => setParam("estado", e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Activa">Activa</option>
            <option value="Finalizada">Finalizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="size-4" />
        <span className="font-label-mono text-xs">Filtros</span>
      </div>
    </div>
  )
}
