import { Sparkles, ExternalLink } from "lucide-react"

export function AiInsightCard({ porcentaje }: { porcentaje: number }) {
  return (
    <div className="glass-card relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl p-6 lg:col-span-1">
      <div className="from-primary/20 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-50" />
      <div className="from-primary/20 absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t to-transparent" />
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
          <span className="size-2 rounded-full bg-primary shadow-[0_0_5px_rgba(0,102,255,1)]" />
          <span className="font-label-mono text-[10px] tracking-wider">AI INSIGHTS</span>
        </div>
        <button className="flex size-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10">
          <ExternalLink className="size-4.5" />
        </button>
      </div>
      <div className="relative z-10 mt-auto">
        <div className="mb-4 flex gap-1">
          <Sparkles className="size-4 text-primary" />
        </div>
        <h3 className="text-2xl leading-tight font-semibold">
          Tus grupos tienen un <span className="text-primary">{porcentaje}%</span> de ocupación
          total este periodo.
        </h3>
      </div>
    </div>
  )
}
