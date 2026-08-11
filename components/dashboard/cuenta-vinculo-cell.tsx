"use client"

import { useState, useTransition } from "react"
import { Check, Link2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import type { PerfilPendiente } from "@/lib/actions/cuentas"

export function CuentaVinculoCell({
  registroId,
  vinculado,
  pendientes,
  vincularAction,
}: {
  registroId: string
  vinculado?: PerfilPendiente
  pendientes: PerfilPendiente[]
  vincularAction: (perfilId: string, registroId: string) => Promise<void>
}) {
  const [seleccionado, setSeleccionado] = useState("")
  const [pending, startTransition] = useTransition()

  if (vinculado) {
    return (
      <span className="font-label-mono inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-400">
        <Check className="size-3" />
        {vinculado.email || "Sin email"}
      </span>
    )
  }

  if (pendientes.length === 0) {
    return <span className="text-xs text-muted-foreground">Sin cuenta</span>
  }

  const items = Object.fromEntries(
    pendientes.map((p) => [p.id, `${p.nombre_completo ?? "Sin nombre"} — ${p.email}`])
  )

  return (
    <div className="flex items-center gap-2">
      <Combobox value={seleccionado} onValueChange={setSeleccionado} items={items}>
        <ComboboxTrigger className="w-52 text-xs">
          <ComboboxValue placeholder="Sin cuenta — vincular" />
        </ComboboxTrigger>
        <ComboboxContent searchPlaceholder="Buscar cuenta..." />
      </Combobox>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        disabled={!seleccionado || pending}
        onClick={() =>
          startTransition(async () => {
            await vincularAction(seleccionado, registroId)
            setSeleccionado("")
          })
        }
      >
        <Link2 className="size-4" />
      </Button>
    </div>
  )
}
