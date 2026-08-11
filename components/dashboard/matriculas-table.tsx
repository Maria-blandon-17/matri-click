import type { UltimaMatricula } from "@/lib/actions/dashboard"
import { EstadoMatriculaBadge } from "@/components/dashboard/estado-matricula-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function MatriculasTable({ matriculas }: { matriculas: UltimaMatricula[] }) {
  if (matriculas.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        Aún no hay matrículas registradas.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead className="font-label-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Estudiante
          </TableHead>
          <TableHead className="font-label-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Grupo
          </TableHead>
          <TableHead className="font-label-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Grado
          </TableHead>
          <TableHead className="font-label-mono hidden text-[11px] tracking-wider text-muted-foreground uppercase md:table-cell">
            Periodo
          </TableHead>
          <TableHead className="font-label-mono hidden text-[11px] tracking-wider text-muted-foreground uppercase lg:table-cell">
            Fecha
          </TableHead>
          <TableHead className="font-label-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Estado
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matriculas.map((matricula) => (
          <TableRow key={matricula.id_matricula} className="border-white/5 hover:bg-white/[0.03]">
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[12px] font-bold text-primary/80">
                  {iniciales(matricula.estudiante)}
                </div>
                <div>
                  <p className="font-medium">{matricula.estudiante}</p>
                  <p className="font-label-mono text-[11px] text-muted-foreground">
                    {matricula.codigo_matricula}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{matricula.grupo}</TableCell>
            <TableCell className="text-muted-foreground">{matricula.grado}</TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">
              {matricula.periodo}
            </TableCell>
            <TableCell className="font-label-mono hidden text-[12px] text-muted-foreground lg:table-cell">
              {new Date(matricula.fecha_matricula).toLocaleDateString("es-CO")}
            </TableCell>
            <TableCell>
              <EstadoMatriculaBadge estado={matricula.estado_matricula} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
