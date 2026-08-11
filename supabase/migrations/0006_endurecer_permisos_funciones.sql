-- Cierra los avisos del Security Advisor de Supabase sobre las funciones SECURITY DEFINER:
-- por defecto Postgres les da EXECUTE a "public" (incluye usuarios anónimos sin sesión), aunque
-- solo deban invocarse desde un trigger o desde dentro de una política RLS ya autenticada.

-- handle_new_user: solo la dispara el trigger on_auth_user_created (0002_roles_y_perfiles.sql).
-- Nadie necesita invocarla directamente.
revoke execute on function public.handle_new_user() from public;

-- rol_actual / perfil_actual / estudiante_ids_de_profesor: las usan las políticas RLS
-- (0003_rls_policies.sql) evaluadas como el usuario autenticado que hace la consulta, así que
-- "authenticated" sí necesita poder ejecutarlas. "anon"/"public" no.
revoke execute on function public.rol_actual() from public;
grant execute on function public.rol_actual() to authenticated;

revoke execute on function public.perfil_actual() from public;
grant execute on function public.perfil_actual() to authenticated;

revoke execute on function public.estudiante_ids_de_profesor() from public;
grant execute on function public.estudiante_ids_de_profesor() to authenticated;
