const steps = [
  {
    number: "1",
    title: "Regístrate",
    description: "Crea tu cuenta como acudiente o estudiante en pocos minutos.",
  },
  {
    number: "2",
    title: "Vincula tu perfil",
    description: "Ingresa tu documento para conectar tu cuenta con tu registro académico.",
  },
  {
    number: "3",
    title: "Matricula o consulta",
    description: "El administrador gestiona tu matrícula y tú haces seguimiento desde tu cuenta.",
  },
  {
    number: "4",
    title: "Seguimiento en tiempo real",
    description: "Consulta el estado de tu matrícula y datos académicos cuando quieras.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto mb-24 max-w-7xl px-4 sm:px-6">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <p className="font-label-mono mb-3 text-xs tracking-widest text-muted-foreground uppercase">
          Proceso
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Cómo funciona</h2>
        <div className="mx-auto mt-4 mb-6 h-0.5 w-16 rounded-full bg-primary shadow-[0_0_10px_rgba(0,102,255,0.6)]" />
        <p className="text-sm text-muted-foreground">
          De registrarte a tener tu matrícula al día, en cuatro pasos.
        </p>
      </div>
      <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-4 sm:gap-8">
        <div className="absolute top-6 right-12 left-12 hidden h-px bg-white/10 sm:block" />
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex flex-col items-start gap-3 text-left">
            <div
              className={`flex size-12 items-center justify-center rounded-full text-base font-semibold ${
                index === 0
                  ? "neon-button bg-primary text-primary-foreground"
                  : "glass-card text-primary"
              }`}
            >
              {step.number}
            </div>
            <h3 className="font-medium">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
