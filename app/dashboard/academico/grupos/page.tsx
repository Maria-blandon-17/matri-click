import { getGrupos, eliminarGrupo } from "@/lib/actions/grupos"
import { getGrados } from "@/lib/actions/grados"
import { getSedes } from "@/lib/actions/sedes"
import { getProfesores } from "@/lib/actions/profesores"
import { GrupoFormDialog } from "@/components/dashboard/academico/grupo-form-dialog"
import { DeleteButton } from "@/components/dashboard/crud/delete-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function GruposPage() {
  const [grupos, grados, sedes, profesores] = await Promise.all([
    getGrupos(),
    getGrados(),
    getSedes(),
    getProfesores(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Grupos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los grupos por grado, sede y director.
          </p>
        </div>
        <GrupoFormDialog grados={grados} sedes={sedes} profesores={profesores} />
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Grupos registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {grupos.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              Aún no hay grupos registrados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Grupo</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Cupo</TableHead>
                  <TableHead>Director</TableHead>
                  <TableHead className="w-20 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grupos.map((grupo) => (
                  <TableRow key={grupo.id_grupo} className="group border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-medium">{grupo.nombre_grupo}</TableCell>
                    <TableCell>{grupo.grados?.nombre_grado ?? "—"}</TableCell>
                    <TableCell>{grupo.sedes?.nombre_sede ?? "—"}</TableCell>
                    <TableCell>{grupo.cupo_maximo}</TableCell>
                    <TableCell>
                      {grupo.profesores
                        ? `${grupo.profesores.nombres} ${grupo.profesores.apellidos}`
                        : "Sin asignar"}
                    </TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <GrupoFormDialog
                        grupo={grupo}
                        grados={grados}
                        sedes={sedes}
                        profesores={profesores}
                      />
                      <DeleteButton
                        itemLabel={`el grupo "${grupo.nombre_grupo}"`}
                        action={eliminarGrupo.bind(null, grupo.id_grupo)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
