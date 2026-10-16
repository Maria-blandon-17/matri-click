"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { actualizarEstadoMatricula } from "@/lib/actions/matriculas"
import { ESTADOS_MATRICULA } from "@/components/dashboard/estado-matricula-badge"
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent } from "@/components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
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

// Estados donde vale la pena dejarle un motivo al acudiente — ver ROADMAP.md (2026-10-15).
const ESTADOS_CON_MOTIVO: EstadoMatricula[] = ["Rechazada", "Cancelada"]

export function EstadoMatriculaSelect({
  id,
  estado,
}: {
  id: string
  estado: EstadoMatricula
}) {
  const [pending, startTransition] = useTransition()
  const [estadoActual, setEstadoActual] = useState(estado)
  const [estadoPendiente, setEstadoPendiente] = useState<EstadoMatricula | null>(null)
  const [motivo, setMotivo] = useState("")

  function aplicar(nuevoEstado: EstadoMatricula, motivoTexto: string) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("estadoMatricula", nuevoEstado)
      formData.set("motivo", motivoTexto)
      const result = await actualizarEstadoMatricula(id, null, formData)
      if (result?.message === "ok") {
        setEstadoActual(nuevoEstado)
        toast.success("Estado actualizado.")
      } else if (result?.message) {
        toast.error(result.message)
      }
    })
  }

  function onValueChange(value: string) {
    const nuevoEstado = value as EstadoMatricula
    if (ESTADOS_CON_MOTIVO.includes(nuevoEstado)) {
      setMotivo("")
      setEstadoPendiente(nuevoEstado)
      return
    }
    aplicar(nuevoEstado, "")
  }

  return (
    <>
      <Combobox
        name="estadoMatricula"
        value={estadoActual}
        items={ESTADOS}
        disabled={pending}
        onValueChange={onValueChange}
      >
        <ComboboxTrigger
          className={cn(
            "font-label-mono w-36 border-transparent bg-transparent text-xs hover:bg-white/5 focus-visible:border-primary/50",
            COLOR_BY_ESTADO[estadoActual]
          )}
        >
          <ComboboxValue />
        </ComboboxTrigger>
        <ComboboxContent />
      </Combobox>

      <Dialog
        open={estadoPendiente !== null}
        onOpenChange={(open) => {
          if (!open) setEstadoPendiente(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {estadoPendiente === "Rechazada" ? "Rechazar matrícula" : "Cancelar matrícula"}
            </DialogTitle>
            <DialogDescription>
              El motivo es opcional, pero el acudiente lo va a ver junto al estado de su
              solicitud — ayuda a que entienda por qué sin tener que preguntar.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="motivo-estado">Motivo (opcional)</FieldLabel>
            <Textarea
              id="motivo-estado"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. El documento del estudiante no coincide con el registrado..."
            />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEstadoPendiente(null)}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={pending}
              onClick={() => {
                if (estadoPendiente) aplicar(estadoPendiente, motivo)
                setEstadoPendiente(null)
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
