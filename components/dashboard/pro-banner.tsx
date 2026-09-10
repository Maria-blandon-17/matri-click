import Link from "next/link"
import { Sparkles } from "lucide-react"

/**
 * Banner de la columna derecha de /dashboard/inicio (equivale al
 * "Go Premium" del mockup). MatriClick Pro no existe todavía — se
 * presenta como "Próximamente", coherente con la sección Planes de la
 * landing. No es un CTA de compra.
 */
export function ProBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#131c2c] p-5">
      <div className="from-primary/25 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent" />
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="font-label-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            MatriClick
          </span>
        </div>
        <h3 className="mb-1 text-base leading-tight font-bold">MatriClick Pro</h3>
        <p className="mb-4 max-w-[190px] text-[11px] leading-relaxed text-muted-foreground">
          Reportes exportables, analítica predictiva y notificaciones automáticas a acudientes.
        </p>
        <Link
          href="/#planes"
          className="font-label-mono inline-flex rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold text-primary transition-colors hover:bg-primary/20"
        >
          Próximamente · Ver planes
        </Link>
      </div>
    </div>
  )
}
