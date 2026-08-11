-- Roles de usuario, tabla de perfiles vinculada a auth.users y trigger de alta automática.
create type rol_usuario as enum ('admin','profesor','acudiente','estudiante');

create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  rol rol_usuario not null,
  nombre_completo text,
  id_profesor uuid references profesores(id_profesor),
  id_acudiente uuid references acudientes(id_acudiente),
  id_estudiante uuid references estudiantes(id_estudiante),
  created_at timestamptz not null default now(),
  constraint chk_rol_vinculo check (
    (rol = 'admin') or
    (rol = 'profesor') or
    (rol = 'acudiente') or
    (rol = 'estudiante')
  )
);

-- Crea el perfil automáticamente al registrarse. El rol viene de raw_user_meta_data
-- (ver lib/actions/auth.ts -> supabase.auth.signUp options.data). El registro público
-- solo permite 'acudiente'/'estudiante'; 'admin'/'profesor' se crean desde el dashboard.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, rol, nombre_completo)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'rol')::rol_usuario, 'acudiente'),
    new.raw_user_meta_data->>'nombre_completo'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lee el rol del usuario autenticado actual. security definer + search_path fijo
-- evita recursión de RLS al consultarse desde las propias políticas de "perfiles".
create function public.rol_actual()
returns rol_usuario
language sql stable security definer set search_path = public as $$
  select rol from perfiles where id = auth.uid()
$$;

create function public.perfil_actual()
returns perfiles
language sql stable security definer set search_path = public as $$
  select * from perfiles where id = auth.uid()
$$;
