-- Corrige recursión infinita entre las políticas RLS de estudiantes y matriculas:
-- estudiantes_select_profesor consultaba matriculas (RLS), y matriculas_select_acudiente
-- consulta estudiantes (RLS), formando un ciclo. Se reemplaza por una función
-- security definer que bypassea RLS al resolver los estudiantes de un profesor.
create function public.estudiante_ids_de_profesor()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select m.id_estudiante from matriculas m
  join grupos g on g.id_grupo = m.id_grupo
  where g.id_director_grupo = (perfil_actual()).id_profesor
$$;

drop policy if exists "estudiantes_select_profesor" on estudiantes;

create policy "estudiantes_select_profesor" on estudiantes
  for select using (
    rol_actual() = 'profesor'
    and id_estudiante in (select estudiante_ids_de_profesor())
  );
