import type { LucideIcon } from "lucide-react"

import { AnimatedNumber } from "@/components/dashboard/animated-number"

export function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: LucideIcon
}) {
  return (
    <div className="glass-card group rounded-2xl p-5 transition-colors hover:border-primary/30">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted/60 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mb-1 text-sm text-muted-foreground">{label}</p>
      <h3 className="text-[32px] leading-none font-bold">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </h3>
    </div>
  )
}
