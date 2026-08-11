import Image from "next/image"

import { cn } from "@/lib/utils"

export function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-xl bg-white p-1.5", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/assets/logo-icon.png"
        alt="MatriClick"
        width={size}
        height={size}
        className="h-full w-full object-contain"
        priority
      />
    </div>
  )
}
