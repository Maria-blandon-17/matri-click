import { GraduationCap, ClipboardCheck, BookOpen, Settings2 } from "lucide-react"

const modules = [
  {
    icon: GraduationCap,
    title: "Estudiantes",
    description:
      "Registro completo de cada estudiante, con historial académico y vínculo a sus acudientes.",
  },
  {
    icon: ClipboardCheck,
    title: "Matrículas",
    description: "Matricula, consulta y haz seguimiento al estado de cada estudiante en tiempo real.",
  },
  {
    icon: BookOpen,
    title: "Académico",
    description: "Administra grados, grupos y periodos académicos desde un solo lugar.",
  },
  {
    icon: Settings2,
    title: "Administración",
    description: "Gestiona sedes, profesores y acudientes, cada uno con permisos independientes.",
  },
]

export function Modules() {
  return (
    <section id="modules" className="mx-auto mb-24 max-w-7xl px-4 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="font-label-mono mb-3 text-xs tracking-widest text-muted-foreground uppercase">
          Todo en un panel
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Los módulos que ya puedes usar hoy</h2>
        <div className="mx-auto mt-4 mb-6 h-0.5 w-16 rounded-full bg-primary shadow-[0_0_10px_rgba(43,102,255,0.6)]" />
        <p className="text-sm text-muted-foreground">
          Cada módulo respeta roles y permisos distintos: administradores, profesores, acudientes
          y estudiantes ven exactamente lo que les corresponde, ni más ni menos.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <div
            key={module.title}
            className="glass-card flex flex-col rounded-2xl border-t border-t-border p-6 transition-colors hover:bg-accent/40"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              <module.icon className="size-5" />
            </div>
            <h4 className="mb-2 text-lg font-medium">{module.title}</h4>
            <p className="mb-4 text-sm text-muted-foreground">{module.description}</p>
            <span className="font-label-mono mt-auto flex items-center gap-1.5 text-[10px] text-emerald-600 uppercase dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-600 shadow-[0_0_6px_rgba(52,211,153,0.8)] dark:bg-emerald-400" />
              Disponible
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
