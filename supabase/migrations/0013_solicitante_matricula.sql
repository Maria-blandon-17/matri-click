-- La migración 0012 dejó que un acudiente solicite matrícula para CUALQUIER estudiante, no solo
-- el suyo — pero no había ninguna columna que registrara quién hizo la solicitud; el código
-- (`matriculas-registro-table.tsx`) asumía que el solicitante era el acudiente vinculado al
-- estudiante, supuesto que dejó de ser cierto. Esta migración agrega esa columna y la usa en RLS
-- para que el acudiente pueda ver sus propias solicitudes aunque el estudiante no sea suyo.
--
-- `default (perfil_actual()).id_acudiente`: se resuelve en el servidor a partir de la sesión
-- autenticada en el momento del insert, no de un valor que mande el cliente — ninguna de las
-- dos acciones (`crearMatricula`, `crearSolicitudMatricula`) necesita tocarse para poblarla.
-- Para un admin, `perfil_actual().id_acudiente` es null, así que las matrículas creadas
-- directamente por admin quedan con `id_acudiente_solicitante = null`, como corresponde (no las
-- "solicitó" ningún acudiente).
alter table matriculas
  add column id_acudiente_solicitante uuid references acudientes(id_acudiente)
  default (perfil_actual()).id_acudiente;

-- Insert: además de lo que ya exigía 0012 (rol acudiente, estado Pendiente), ahora valida que la
-- columna quede en el propio acudiente — defensivo: el default ya hace esto, pero si algún
-- cliente llegara a mandar la columna explícita, esto evita que un acudiente se atribuya una
-- solicitud a nombre de otro.
drop policy if exists "matriculas_insert_acudiente" on matriculas;
create policy "matriculas_insert_acudiente" on matriculas
  for insert
  with check (
    rol_actual() = 'acudiente'
    and estado_matricula = 'Pendiente'
    and id_acudiente_solicitante = (perfil_actual()).id_acudiente
  );

-- Select: antes solo veía matrículas de SU(S) estudiante(s) vinculado(s). Ahora también ve las
-- que él mismo solicitó, sin importar si el estudiante está vinculado a su cuenta o no.
drop policy if exists "matriculas_select_acudiente" on matriculas;
create policy "matriculas_select_acudiente" on matriculas
  for select using (
    id_estudiante in (
      select id_estudiante from estudiantes where id_acudiente = (perfil_actual()).id_acudiente
    )
    or id_acudiente_solicitante = (perfil_actual()).id_acudiente
  );
