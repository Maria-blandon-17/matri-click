"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Check, X } from "lucide-react"

import {
  aceptarCuenta,
  rechazarCuenta,
  descartarCuenta,
  type CuentaPendiente,
} from "@/lib/actions/cuentas-pendientes"
import { DataTable } from "@/components/dashboard/data-table"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import type { RolUsuario } from "@/lib/types/database.types"

const ROL_LABEL: Partial<Record<RolUsuario, string>> = {
  profesor: "Profesor",
  acudiente: "Acudiente",
  estudiante: "Estudiante",
}

const ROL_BADGE: Partial<Record<RolUsuario, string>> = {
  profesor: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  acudiente: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  estudiante: "bg-violet-400/10 text-violet-300 border-violet-400/20",
}

function FilaAcciones({ cuenta }: { cuenta: CuentaPendiente }) {
  const [pending, startTransition] = useTransition()

  function aceptar() {
    startTransition(async () => {
      try {
        const result = await aceptarCuenta(cuenta.id)
        if (result?.error) {
          toast.error(result.error)
          return
        }
        toast.success("Cuenta aceptada y vinculada.")
      } catch {
        toast.error("No se pudo aceptar. Intenta de nuevo.")
      }
    })
  }

  function rechazar() {
    startTransition(async () => {
      try {
        const result = await rechazarCuenta(cuenta.id)
        if (result?.error) {
          toast.error(result.error)
          return
        }
        toast.success("Cuenta rechazada.")
      } catch {
        toast.error("No se pudo rechazar. Intenta de nuevo.")
      }
    })
  }

  return (
    <div className="flex justify-end gap-1.5">
      <Button
        size="sm"
        className="neon-button h-8 gap-1.5 px-3 text-xs"
        disabled={pending}
        onClick={aceptar}
      >
        <Check className="size-3.5" />
        Aceptar
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 border-amber-400/30 px-3 text-xs text-amber-400 hover:bg-amber-400/10"
        disabled={pending}
        onClick={rechazar}
      >
        <X className="size-3.5" />
        Rechazar
      </Button>
      <DeleteButton
        itemLabel={`la cuenta de "${cuenta.nombreCompleto ?? cuenta.email}" (se borra por completo)`}
        action={descartarCuenta.bind(null, cuenta.id)}
      />
    </div>
  )
}

export function CuentasPendientesTable({ cuentas }: { cuentas: CuentaPendiente[] }) {
  return (
    <DataTable
      data={cuentas}
      emptyMessage="No hay cuentas nuevas pendientes de revisión."
      header={
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead>Nombre</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="hidden md:table-cell">Fecha de registro</TableHead>
          <TableHead className="w-56 text-right">Acciones</TableHead>
        </TableRow>
      }
      renderRow={(cuenta) => (
        <TableRow key={cuenta.id} className="group border-white/5 hover:bg-white/[0.03]">
          <TableCell className="font-medium">{cuenta.nombreCompleto ?? "Sin nombre"}</TableCell>
          <TableCell className="text-muted-foreground">{cuenta.email || "—"}</TableCell>
          <TableCell className="text-muted-foreground">{cuenta.documento ?? "—"}</TableCell>
          <TableCell>
            <span
              className={`font-label-mono inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] uppercase ${ROL_BADGE[cuenta.rol]}`}
            >
              {ROL_LABEL[cuenta.rol]}
            </span>
          </TableCell>
          <TableCell>
            <StatusBadge variant="pending" label="Pendiente" />
          </TableCell>
          <TableCell className="hidden text-muted-foreground md:table-cell">
            {new Date(cuenta.creadaEn).toLocaleDateString("es-CO")}
          </TableCell>
          <TableCell>
            <FilaAcciones cuenta={cuenta} />
          </TableCell>
        </TableRow>
      )}
    />
  )
}
