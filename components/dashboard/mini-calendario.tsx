/**
 * Mini-calendario del mes actual — decorativo (sin navegación de meses).
 * Resalta el día de hoy. Server Component: `new Date()` en el servidor.
 */
const DIAS = ["D", "L", "M", "M", "J", "V", "S"]

export function MiniCalendario() {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = hoy.getMonth()
  const diaHoy = hoy.getDate()

  const primerDiaSemana = new Date(anio, mes, 1).getDay() // 0 = domingo
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()

  // Celdas: huecos iniciales (null) + días del mes.
  const celdas: (number | null)[] = [
    ...Array.from({ length: primerDiaSemana }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ]

  const tituloMes = hoy
    .toLocaleDateString("es-CO", { month: "long", year: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="mb-3 text-center text-sm font-semibold">{tituloMes}</p>

      <div className="mb-2 grid grid-cols-7 text-center">
        {DIAS.map((d, i) => (
          <span key={i} className="font-label-mono text-[10px] text-muted-foreground/70">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[12px]">
        {celdas.map((dia, i) => (
          <div key={i} className="flex items-center justify-center py-0.5">
            {dia === null ? (
              <span />
            ) : dia === diaHoy ? (
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-[0_0_10px_rgba(43,102,255,0.4)]">
                {dia}
              </span>
            ) : (
              <span className="text-foreground/80">{dia}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
