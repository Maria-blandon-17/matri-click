"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { actualizarEstadoMatricula } from "@/lib/actions/matriculas"
import { ESTADOS_MATRICULA } from "@/components/dashboard/estado-matricula-badge"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import type { EstadoMatricula } from "@/lib/types/database.types"
import { cn } from "@/lib/utils"

const ESTADOS = Object.fromEntries(ESTADOS_MATRICULA.map((e) => [e, e]))

const COLOR_BY_ESTADO: Record<EstadoMatricula, string> = {
  Pendiente: "text-amber-400",
  "En revisión": "text-yellow-400",
  Activa: "text-emerald-400",
  Rechazada: "text-red-400",
  Cancelada: "text-rose-400",
  Finalizada: "text-slate-300",
  Expirada: "text-slate-400",
}

export function EstadoMatriculaSelect({
  id,
  estado,
}: {
  id: string
  estado: EstadoMatricula
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Combobox
      name="estadoMatricula"
      defaultValue={estado}
      items={ESTADOS}
      disabled={pending}
      onValueChange={(value) => {
        startTransition(async () => {
          const formData = new FormData()
          formData.set("estadoMatricula", value)
          const result = await actualizarEstadoMatricula(id, null, formData)
          if (result?.message === "ok") {
            toast.success("Estado actualizado.")
          } else if (result?.message) {
            toast.error(result.message)
          }
        })
      }}
    >
      <ComboboxTrigger
        className={cn(
          "font-label-mono w-36 border-transparent bg-transparent text-xs hover:bg-white/5 focus-visible:border-primary/50",
          COLOR_BY_ESTADO[estado]
        )}
      >
        <ComboboxValue />
      </ComboboxTrigger>
      <ComboboxContent />
    </Combobox>
  )
}
