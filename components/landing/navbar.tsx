import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={40} />
          <span className="text-xl font-black tracking-tight">MatriClick</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#modules"
            className="font-label-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Módulos
          </a>
          <a
            href="#how-it-works"
            className="font-label-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Cómo funciona
          </a>
          <a
            href="#planes"
            className="font-label-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Planes
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="font-label-mono hidden text-xs text-muted-foreground hover:text-foreground md:inline-flex"
            nativeButton={false}
            render={<Link href="/login">Iniciar sesión</Link>}
          />
          <Button
            className="neon-button font-label-mono rounded-lg bg-primary text-xs text-primary-foreground hover:bg-primary"
            nativeButton={false}
            render={
              <Link href="/registro">
                <Plus className="size-4" />
                Registrarme
              </Link>
            }
          />
        </div>
      </div>
    </header>
  )
}
