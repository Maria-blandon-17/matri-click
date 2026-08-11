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
      <h2 className="mb-16 text-3xl font-bold">Cómo funciona</h2>
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
