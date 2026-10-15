"use client"

import { useState } from "react"
import { Menu } from "lucide-react"

import { SidebarContent } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { RolUsuario } from "@/lib/types/database.types"

export function MobileSidebar({
  rol,
  badges = {},
  nombre,
  correo,
}: {
  rol: RolUsuario
  badges?: Record<string, number>
  nombre?: string | null
  correo?: string | null
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="theme-dark-forced flex w-72 flex-col gap-4 border-sidebar-border bg-sidebar p-4 text-sidebar-foreground"
      >
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <SidebarContent
          onNavigate={() => setOpen(false)}
          rol={rol}
          badges={badges}
          nombre={nombre}
          correo={correo}
        />
      </SheetContent>
    </Sheet>
  )
}
