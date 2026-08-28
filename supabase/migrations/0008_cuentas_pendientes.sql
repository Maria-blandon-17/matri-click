-- Cuentas pendientes: guarda el documento ingresado al registrarse (aunque no haya
-- coincidencia con ninguna ficha existente) y marca cuentas rechazadas por el admin.
alter table perfiles add column if not exists documento text;
alter table perfiles add column if not exists rechazado boolean not null default false;

-- Autoedición de la propia ficha académica: cada rol puede completar/corregir SOLO los
-- campos que le corresponden a él mismo (nunca su documento, ni su estado, ni su id) —
-- lo hace cumplir un trigger, porque RLS por sí sola filtra filas, no columnas, y admin
-- usa el mismo rol de Postgres "authenticated" que todos los demás.

create or replace function public.bloquear_campos_protegidos_profesor()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if rol_actual() <> 'admin' then
    if new.documento is distinct from old.documento
       or new.estado_profesor is distinct from old.estado_profesor
       or new.id_profesor is distinct from old.id_profesor then
      raise exception 'No tienes permiso para modificar ese campo.';
    end if;
  end if;
  return new;
end;
$$;
revoke execute on function public.bloquear_campos_protegidos_profesor() from public, anon;

drop trigger if exists trg_profesores_bloquear_campos on profesores;
create trigger trg_profesores_bloquear_campos
  before update on profesores
  for each row execute function public.bloquear_campos_protegidos_profesor();

create policy "profesores_update_propio" on profesores
  for update using (id_profesor = (perfil_actual()).id_profesor)
  with check (id_profesor = (perfil_actual()).id_profesor);

create or replace function public.bloquear_campos_protegidos_acudiente()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if rol_actual() <> 'admin' then
    if new.documento is distinct from old.documento
       or new.id_acudiente is distinct from old.id_acudiente then
      raise exception 'No tienes permiso para modificar ese campo.';
    end if;
  end if;
  return new;
end;
$$;
revoke execute on function public.bloquear_campos_protegidos_acudiente() from public, anon;

drop trigger if exists trg_acudientes_bloquear_campos on acudientes;
create trigger trg_acudientes_bloquear_campos
  before update on acudientes
  for each row execute function public.bloquear_campos_protegidos_acudiente();

create policy "acudientes_update_propio" on acudientes
  for update using (id_acudiente = (perfil_actual()).id_acudiente)
  with check (id_acudiente = (perfil_actual()).id_acudiente);

create or replace function public.bloquear_campos_protegidos_estudiante()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if rol_actual() <> 'admin' then
    if new.documento is distinct from old.documento
       or new.estado_estudiante is distinct from old.estado_estudiante
       or new.id_acudiente is distinct from old.id_acudiente
       or new.id_estudiante is distinct from old.id_estudiante then
      raise exception 'No tienes permiso para modificar ese campo.';
    end if;
  end if;
  return new;
end;
$$;
revoke execute on function public.bloquear_campos_protegidos_estudiante() from public, anon;

drop trigger if exists trg_estudiantes_bloquear_campos on estudiantes;
create trigger trg_estudiantes_bloquear_campos
  before update on estudiantes
  for each row execute function public.bloquear_campos_protegidos_estudiante();

create policy "estudiantes_update_propio" on estudiantes
  for update using (id_estudiante = (perfil_actual()).id_estudiante)
  with check (id_estudiante = (perfil_actual()).id_estudiante);
