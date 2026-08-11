"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import type { CrudFormState } from "@/lib/actions/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CrudDialog({
  trigger,
  title,
  description,
  action,
  children,
}: {
  trigger: React.ReactElement
  title: string
  description?: string
  action: (state: CrudFormState, formData: FormData) => Promise<CrudFormState>
  children: (state: CrudFormState, pending: boolean) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<CrudFormState, FormData>(
    action,
    null
  )

  useEffect(() => {
    if (!state) return
    if (state.message === "ok") {
      toast.success("Guardado correctamente.")
      // Closing the dialog in response to a completed Server Action result
      // (an external system) is the sanctioned use of setState-in-effect here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false)
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="glass-modal max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form action={formAction}>{children(state, pending)}</form>
      </DialogContent>
    </Dialog>
  )
}
