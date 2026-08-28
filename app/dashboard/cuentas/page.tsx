import type { LucideIcon } from "lucide-react"
import { TriangleAlert, IdCard } from "lucide-react"

import { getPerfilActual, getRegistroVinculado } from "@/lib/actions/perfil"
import { PerfilNombreForm } from "@/components/dashboard/cuenta/perfil-nombre-form"
import { CambiarPasswordDialog } from "@/components/dashboard/cuenta/cambiar-password-dialog"
import { FichaProfesorForm } from "@/components/dashboard/cuenta/ficha-profesor-form"
import { FichaAcudienteForm } from "@/components/dashboard/cuenta/ficha-acudiente-form"
import { FichaEstudianteForm } from "@/components/dashboard/cuenta/ficha-estudiante-form"
import type { RolUsuario } from "@/lib/types/database.types"

function iniciales(nombre: string | null) {
  if (!nombre) return "U"
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("")
}

const ROL_LABEL: Record<RolUsuario, string> = {
  admin: "Administrador",
  profesor: "Profesor",
  acudiente: "Acudiente",
  estudiante: "Estudiante",
}

const ROL_BADGE: Record<RolUsuario, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  profesor: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  acudiente: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  estudiante: "bg-violet-400/10 text-violet-300 border-violet-400/20",
}

function CampoSoloLectura({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="space-y-2">
      <p className="font-label-mono text-[11px] text-muted-foreground uppercase">{label}</p>
      <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/20 px-4 py-3">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-sm">{value}</span>
      </div>
    </div>
  )
}

export default async function CuentasPage() {
  const perfil = await getPerfilActual()

  if (!perfil) return null

  const registro = await getRegistroVinculado(perfil.rol, {
    id_profesor: perfil.id_profesor,
    id_acudiente: perfil.id_acudiente,
    id_estudiante: perfil.id_estudiante,
  })

  const requiereVinculo = perfil.rol !== "admin"
  const vinculado = !requiereVinculo || registro !== null

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mi perfil</h1>
        <p className="text-sm text-muted-foreground">
          Administra tus datos personales y credenciales de acceso.
        </p>
      </div>

      {!vinculado && (
        <div className="glass-card flex items-start gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-400" />
          <div>
            <h3 className="font-semibold text-amber-400">Cuenta pendiente de vinculación</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tu cuenta aún no está vinculada a un registro académico. Contacta al administrador
              de tu institución para completar la vinculación.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="glass-card relative overflow-hidden rounded-2xl p-8">
            <div className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-card text-2xl font-bold text-primary">
                {iniciales(perfil.nombre_completo)}
              </div>
              <div className="w-full flex-1 space-y-4 text-center sm:text-left">
                <PerfilNombreForm nombreCompleto={perfil.nombre_completo} />
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <span className="font-label-mono text-xs text-muted-foreground">
                    {perfil.email ?? "Sin correo"}
                  </span>
                  <span
                    className={`font-label-mono inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase ${ROL_BADGE[perfil.rol]}`}
                  >
                    {ROL_LABEL[perfil.rol]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {registro && (
            <div className="glass-card rounded-2xl p-8">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
                <IdCard className="size-5 text-muted-foreground" />
                Datos académicos
              </h3>
              <div className="mb-6 max-w-md">
                <CampoSoloLectura icon={IdCard} label="Documento" value={registro.documento} />
              </div>

              {registro.tipo === "profesor" && (
                <FichaProfesorForm
                  nombres={registro.nombres}
                  apellidos={registro.apellidos}
                  telefono={registro.telefono}
                  correoElectronico={registro.correo_electronico}
                />
              )}

              {registro.tipo === "acudiente" && (
                <FichaAcudienteForm
                  tipoDocumento={registro.tipo_documento}
                  nombres={registro.nombres}
                  apellidos={registro.apellidos}
                  telefono={registro.telefono}
                  correoElectronico={registro.correo_electronico}
                  direccion={registro.direccion}
                  parentesco={registro.parentesco}
                />
              )}

              {registro.tipo === "estudiante" && (
                <FichaEstudianteForm
                  tipoDocumento={registro.tipo_documento}
                  nombres={registro.nombres}
                  apellidos={registro.apellidos}
                  fechaNacimiento={registro.fecha_nacimiento}
                  genero={registro.genero}
                />
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                El documento no se puede cambiar aquí — si está mal, contacta al administrador.
                El resto de estos datos puedes corregirlos tú mismo cuando quieras.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-2 text-lg font-medium">Seguridad de acceso</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Actualiza tu contraseña regularmente para mantener tu cuenta segura.
            </p>
            <CambiarPasswordDialog />
          </div>
        </div>
      </div>
    </div>
  )
}
