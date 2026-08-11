"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-lg font-medium">Algo salió mal</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Ocurrió un error al cargar esta sección. Intenta de nuevo.
      </p>
      <Button onClick={() => reset()}>Reintentar</Button>
    </div>
  )
}
