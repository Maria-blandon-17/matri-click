import { getSedesConEstadisticas } from "@/lib/actions/sedes"
import { getPerfilActual } from "@/lib/actions/perfil"
import { SedesCards } from "@/components/dashboard/sedes/sedes-cards"

export default async function SedesPage() {
  const [sedes, perfil] = await Promise.all([
    getSedesConEstadisticas(),
    getPerfilActual(),
  ])
  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          Sedes
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {sedes.length} registrada{sedes.length === 1 ? "" : "s"}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Supervisa la infraestructura, los cupos y los datos de contacto de cada sede.
        </p>
      </div>

      <SedesCards sedes={sedes} esAdmin={esAdmin} />
    </div>
  )
}
