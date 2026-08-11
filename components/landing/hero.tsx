import Link from "next/link"
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="mx-auto mb-24 flex max-w-7xl flex-col items-center gap-12 px-4 pt-32 pb-0 sm:px-6 lg:flex-row">
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-[48px] lg:leading-[56px]">
          Precisión sin fricción en la{" "}
          <span className="bg-gradient-to-r from-primary to-[#b3c5ff] bg-clip-text text-transparent">
            gestión académica
          </span>
          .
        </h1>
        <p className="max-w-xl text-base text-pretty text-muted-foreground">
          Transforma el proceso burocrático de matrículas en una experiencia digital fluida,
          impulsada por tecnología y diseño premium.
        </p>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Button
            className="neon-button font-label-mono rounded-lg bg-primary px-6 py-3 text-xs text-primary-foreground hover:bg-primary"
            nativeButton={false}
            render={
              <Link href="/registro">
                Explorar plataforma
                <ArrowRight className="size-4" />
              </Link>
            }
          />
          <Button
            variant="outline"
            className="glass-card font-label-mono rounded-lg border-primary/30 px-6 py-3 text-xs hover:bg-white/5"
            nativeButton={false}
            render={<Link href="/login">Iniciar sesión</Link>}
          />
        </div>
      </div>

      <div className="relative w-full max-w-md flex-1">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-transparent blur-xl" />
        <div className="glass-card relative flex h-64 flex-col justify-between overflow-hidden rounded-2xl p-6">
          <div className="bg-grid-pattern absolute inset-0 opacity-20" />
          <div className="from-primary/10 absolute inset-0 bg-gradient-to-t to-transparent" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-card/80 px-3 py-1 backdrop-blur-md">
              <Sparkles className="size-3.5 text-primary" />
              <span className="font-label-mono text-[10px]">AI Insights</span>
            </div>
            <span className="font-label-mono rounded border border-white/10 bg-card/50 px-2 py-1 text-[9px] text-muted-foreground uppercase">
              Vista previa
            </span>
          </div>
          <div className="relative z-10 mt-auto space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4 text-primary" />
              <span>
                Ocupación de cupos: <span className="font-semibold text-foreground">82%</span> este periodo
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full w-[82%] rounded-full bg-gradient-to-r from-primary to-[#b3c5ff]"
                style={{ boxShadow: "0 0 10px rgba(0,102,255,0.5)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
