-- Antes, un acudiente solo podía ver y solicitar matrícula para SU(S) propio(s)
-- estudiante(s) vinculado(s) (estudiantes.id_acudiente = su perfil). Pedido explícito
-- del usuario (2026-10-15): la pantalla "Solicitar matrícula" debe dejar elegir entre
-- TODOS los estudiantes registrados en la plataforma, con buscador — no solo los
-- vinculados a su cuenta (ej. puede estar solicitando por un estudiante que todavía no
-- tiene acudiente asignado, o apoyando a otra familia). El admin sigue aprobando o
-- rechazando cada solicitud igual que antes, así que esto no matricula a nadie
-- automáticamente — solo amplía quién puede *solicitarlo* y para quién.
--
-- Efecto colateral a tener en cuenta: RLS es por fila, no por pantalla — esta misma
-- política también amplía lo que un acudiente ve en /dashboard/estudiantes (antes solo
-- su(s) hijo(s), ahora el listado completo), porque ambas pantallas leen la misma tabla.

drop policy if exists "estudiantes_select_acudiente" on estudiantes;
create policy "estudiantes_select_acudiente" on estudiantes
  for select using (rol_actual() = 'acudiente');

drop policy if exists "matriculas_insert_acudiente" on matriculas;
create policy "matriculas_insert_acudiente" on matriculas
  for insert
  with check (
    rol_actual() = 'acudiente'
    and estado_matricula = 'Pendiente'
  );
