"use client"

import { useState } from "react"
import { Menu } from "lucide-react"

import { SidebarContent } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MobileSidebar() {
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
        className="flex w-72 flex-col gap-4 border-white/10 bg-card p-4 text-foreground"
      >
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
