import { getGrupos } from "@/lib/actions/grupos"
import { getGrados } from "@/lib/actions/grados"
import { getSedes } from "@/lib/actions/sedes"
import { getProfesores } from "@/lib/actions/profesores"
import { getPerfilActual } from "@/lib/actions/perfil"
import { GrupoFormDialog } from "@/components/dashboard/academico/grupo-form-dialog"
import { GruposTable } from "@/components/dashboard/academico/grupos-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function GruposPage() {
  const [grupos, grados, sedes, profesores, perfil] = await Promise.all([
    getGrupos(),
    getGrados(),
    getSedes(),
    getProfesores(),
    getPerfilActual(),
  ])
  const esAdmin = perfil?.rol === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Grupos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los grupos por grado, sede y director.
          </p>
        </div>
        {esAdmin && <GrupoFormDialog grados={grados} sedes={sedes} profesores={profesores} />}
      </div>

      <Card className="glass-card border-0 py-0">
        <CardHeader className="pt-6">
          <CardTitle>Grupos registrados</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <GruposTable
            grupos={grupos}
            grados={grados}
            sedes={sedes}
            profesores={profesores}
            esAdmin={esAdmin}
          />
        </CardContent>
      </Card>
    </div>
  )
}
