"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteButton({
  action,
  itemLabel,
}: {
  action: () => Promise<void>
  itemLabel: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <AlertDialogContent className="glass-modal rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar {itemLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => {
              startTransition(async () => {
                try {
                  await action()
                  toast.success("Eliminado correctamente.")
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : "No se pudo eliminar."
                  )
                }
              })
            }}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
