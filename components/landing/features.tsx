import { UserCheck, Building2, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: UserCheck,
    title: "Matrículas en línea",
    description:
      "Procesos 100% digitales, reduciendo filas y papeleo con validación instantánea de cupos.",
  },
  {
    icon: Building2,
    title: "Gestión multi-sede",
    description:
      "Administra cupos, grupos y periodos a través de múltiples sedes desde un solo panel.",
  },
  {
    icon: ShieldCheck,
    title: "Roles y permisos",
    description:
      "Seguridad granular con accesos personalizados para administradores, profesores y familias.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto mb-24 max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass-card flex flex-col items-start rounded-2xl border-t border-t-white/10 p-6 transition-colors hover:bg-white/[0.03]"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              <feature.icon className="size-5" />
            </div>
            <h4 className="mb-2 text-lg font-medium">{feature.title}</h4>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
