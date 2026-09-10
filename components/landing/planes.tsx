import Link from "next/link"
import { Check } from "lucide-react"

const gratis = [
  "Matrículas en línea, sin límite de estudiantes",
  "Gestión de estudiantes, acudientes y profesores",
  "1 sede, con grados, grupos y periodos académicos",
  "Roles y permisos para cada tipo de usuario",
]

const pro = [
  "Sedes ilimitadas para redes de colegios",
  "Reportes exportables (Excel/PDF) y comparativas entre sedes y periodos",
  "Analítica predictiva: proyección de cupos y alertas de deserción",
  "Notificaciones automáticas a acudientes por email/WhatsApp",
]

function FeatureItem({ label, active }: { label: string; active: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-full ${
          active ? "bg-primary text-white" : "bg-white/10 text-slate-500"
        }`}
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
      <span className={`text-[13.5px] ${active ? "text-slate-300" : "text-slate-500"}`}>{label}</span>
    </li>
  )
}

export function Planes() {
  return (
    <section id="planes" className="mx-auto mb-24 max-w-7xl px-4 sm:px-6">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="font-label-mono mb-3 text-xs tracking-widest text-muted-foreground uppercase">
          Planes
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Elige tu plan</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
          Todo lo que ves en esta página está disponible hoy, gratis. Pro llega más adelante con
          herramientas para instituciones que necesitan escalar.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:gap-7">
        {/* Gratis — plan destacado, activo hoy */}
        <div className="relative flex flex-col justify-between rounded-[32px] border border-blue-400/40 bg-gradient-to-b from-[#18346e]/90 via-[#0d1628]/95 to-[#0b101c]/95 p-8 shadow-[0_0_50px_-12px_rgba(43,102,255,0.35)] backdrop-blur-md sm:p-9 md:-translate-y-1">
          {/* Highlight suave arriba-centro */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 rounded-t-[32px] bg-gradient-to-b from-blue-500/25 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-white">Gratis</h3>
              <span className="font-label-mono rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-400 uppercase">
                Disponible hoy
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">$0</span>
              <span className="ml-1 text-sm font-normal text-slate-400">/ siempre</span>
            </div>
            <p className="mt-2 text-[13px] leading-normal text-slate-300/90">
              Para colegios que quieren digitalizar sus matrículas ya.
            </p>

            <div className="mt-7">
              <Link
                href="/registro"
                className="block w-full rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-black transition-all duration-200 hover:bg-slate-100 hover:shadow-lg"
              >
                Comienza gratis
              </Link>
            </div>

            <ul className="mt-9 space-y-4">
              {gratis.map((item) => (
                <FeatureItem key={item} label={item} active />
              ))}
            </ul>
          </div>
        </div>

        {/* Pro — en construcción, sin CTA activo */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0b101c]/80 p-8 backdrop-blur-md transition-colors duration-300 hover:border-white/20 sm:p-9">
          <div className="absolute top-6 -right-10 rotate-45 bg-white/[0.06] px-12 py-1">
            <span className="font-label-mono text-[10px] text-slate-400 uppercase">Próximamente</span>
          </div>

          <div>
            <h3 className="text-xl font-semibold tracking-tight text-white">Pro</h3>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-slate-400">Por definir</span>
            </div>
            <p className="mt-2 text-[13px] leading-normal text-slate-400">
              Para redes de colegios y equipos que necesitan escalar.
            </p>

            <div className="mt-7">
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-slate-400 opacity-70"
              >
                Próximamente
              </button>
            </div>

            <ul className="mt-9 space-y-4">
              {pro.map((item) => (
                <FeatureItem key={item} label={item} active={false} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
