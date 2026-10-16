-- Dos arreglos encontrados en auditoría de control de acceso (2026-10-15):

-- 1) CRÍTICO: "perfiles_update_propio" (0003_rls_policies.sql) deja que cada usuario edite su
--    propia fila de `perfiles` sin restricción de columnas — solo exige que la fila sea la
--    suya. Cualquier cuenta autenticada podía auto-asignarse `rol = 'admin'`, o cambiar
--    `id_acudiente`/`id_estudiante`/`id_profesor` para vincularse a la ficha de OTRA persona
--    (viendo sus datos), con una llamada directa a la API REST de Supabase — no hacía falta
--    pasar por la UI. Mismo patrón de trigger que ya protege profesores/acudientes/estudiantes
--    desde 0008_cuentas_pendientes.sql, aplicado acá a la tabla más sensible de todas.
create or replace function public.bloquear_campos_protegidos_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if rol_actual() <> 'admin' then
    if new.rol is distinct from old.rol
       or new.id_profesor is distinct from old.id_profesor
       or new.id_acudiente is distinct from old.id_acudiente
       or new.id_estudiante is distinct from old.id_estudiante
       or new.rechazado is distinct from old.rechazado then
      raise exception 'No tienes permiso para modificar ese campo.';
    end if;
  end if;
  return new;
end;
$$;
revoke execute on function public.bloquear_campos_protegidos_perfil() from public, anon;

drop trigger if exists trg_perfiles_bloquear_campos on perfiles;
create trigger trg_perfiles_bloquear_campos
  before update on perfiles
  for each row execute function public.bloquear_campos_protegidos_perfil();

-- 2) Bug funcional (no de seguridad): no existía ninguna política que dejara al rol
--    `estudiante` leer `grupos` (sí existía para acudiente/admin/profesor-director) — un
--    estudiante viendo su propia matrícula en Inicio o en /dashboard/matriculas veía el grupo y
--    el grado en blanco, porque el embed de `grupos` devolvía null al no tener permiso de
--    lectura.
create policy "grupos_select_estudiante" on grupos
  for select using (rol_actual() = 'estudiante');
