-- Row Level Security: admin acceso total, profesor limitado a sus grupos,
-- acudiente/estudiante limitados a su propio estudiante y sus matrículas.
alter table sedes enable row level security;
alter table profesores enable row level security;
alter table grados enable row level security;
alter table grupos enable row level security;
alter table periodos_academicos enable row level security;
alter table acudientes enable row level security;
alter table estudiantes enable row level security;
alter table matriculas enable row level security;
alter table perfiles enable row level security;

-- perfiles: cada usuario ve y actualiza solo su propio perfil; admin ve todos.
create policy "perfiles_select_propio_o_admin" on perfiles
  for select using (id = auth.uid() or rol_actual() = 'admin');

create policy "perfiles_update_propio" on perfiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "perfiles_admin_all" on perfiles
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');

-- Catálogos: lectura abierta a cualquier autenticado, escritura solo admin.
create policy "sedes_select_authenticated" on sedes
  for select using (auth.role() = 'authenticated');
create policy "sedes_admin_write" on sedes
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');

create policy "grados_select_authenticated" on grados
  for select using (auth.role() = 'authenticated');
create policy "grados_admin_write" on grados
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');

create policy "periodos_select_authenticated" on periodos_academicos
  for select using (auth.role() = 'authenticated');
create policy "periodos_admin_write" on periodos_academicos
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');

-- Profesores: lectura abierta a autenticados (para selects de director de grupo), solo admin escribe.
create policy "profesores_select_authenticated" on profesores
  for select using (auth.role() = 'authenticated');
create policy "profesores_admin_write" on profesores
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');

-- Grupos: admin todo; profesor ve solo los grupos que dirige.
create policy "grupos_admin_all" on grupos
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');
create policy "grupos_select_profesor" on grupos
  for select using (
    rol_actual() = 'profesor'
    and id_director_grupo = (perfil_actual()).id_profesor
  );

-- Acudientes: admin todo; el propio acudiente ve su registro.
create policy "acudientes_admin_all" on acudientes
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');
create policy "acudientes_select_propio" on acudientes
  for select using (id_acudiente = (perfil_actual()).id_acudiente);

-- Estudiantes: admin todo; acudiente ve a su(s) estudiante(s); estudiante ve su propio registro;
-- profesor ve los estudiantes matriculados en los grupos que dirige.
create policy "estudiantes_admin_all" on estudiantes
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');
create policy "estudiantes_select_acudiente" on estudiantes
  for select using (id_acudiente = (perfil_actual()).id_acudiente);
create policy "estudiantes_select_propio" on estudiantes
  for select using (id_estudiante = (perfil_actual()).id_estudiante);
-- security definer: evalúa matriculas/grupos sin pasar por sus políticas RLS,
-- para evitar la recursión que se produce si estudiantes_select_profesor consultara
-- esas tablas directamente (matriculas_select_acudiente ya consulta estudiantes).
create function public.estudiante_ids_de_profesor()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select m.id_estudiante from matriculas m
  join grupos g on g.id_grupo = m.id_grupo
  where g.id_director_grupo = (perfil_actual()).id_profesor
$$;

create policy "estudiantes_select_profesor" on estudiantes
  for select using (
    rol_actual() = 'profesor'
    and id_estudiante in (select estudiante_ids_de_profesor())
  );

-- Matrículas: admin todo; acudiente/estudiante ven las de su estudiante; profesor ve las de sus grupos.
create policy "matriculas_admin_all" on matriculas
  for all using (rol_actual() = 'admin') with check (rol_actual() = 'admin');
create policy "matriculas_select_acudiente" on matriculas
  for select using (
    id_estudiante in (
      select id_estudiante from estudiantes where id_acudiente = (perfil_actual()).id_acudiente
    )
  );
create policy "matriculas_select_propio_estudiante" on matriculas
  for select using (id_estudiante = (perfil_actual()).id_estudiante);
create policy "matriculas_select_profesor" on matriculas
  for select using (
    rol_actual() = 'profesor'
    and id_grupo in (
      select id_grupo from grupos where id_director_grupo = (perfil_actual()).id_profesor
    )
  );
