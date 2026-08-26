-- Paso 2 de 2. Ejecutar después de que 0007_solicitudes_matricula.sql haya corrido y
-- confirmado (commit) por separado.
-- Permite que un acudiente solicite la matrícula de su(s) estudiante(s) desde su casa,
-- quedando en estado "Pendiente" hasta que un admin la apruebe o la rechace.

-- El acudiente necesita ver el catálogo de grupos para elegir uno al solicitar
-- (antes solo admin y el profesor director de cada grupo podían leer esta tabla).
create policy "grupos_select_acudiente" on grupos
  for select using (rol_actual() = 'acudiente');

-- Insert restringido: solo puede crear matrículas "Pendiente" para su(s) propio(s)
-- estudiante(s). No puede insertar directamente en estado "Activa" — eso lo decide un admin.
create policy "matriculas_insert_acudiente" on matriculas
  for insert
  with check (
    rol_actual() = 'acudiente'
    and estado_matricula = 'Pendiente'
    and id_estudiante in (
      select id_estudiante from estudiantes where id_acudiente = (perfil_actual()).id_acudiente
    )
  );
