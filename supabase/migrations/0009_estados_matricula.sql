-- Amplía el ciclo de vida de la matrícula de 4 a 7 estados.
--
-- Antes: Activa, Cancelada, Finalizada (0001_schema.sql) + Pendiente (0007_solicitudes_matricula.sql).
-- Nuevos:
--   'En revisión' — un admin está revisando la solicitud.
--   'Rechazada'   — un admin la denegó (distinta de 'Cancelada' = anulada tras estar activa).
--   'Expirada'    — solicitud que quedó sin atender; hoy la pone el admin a mano (no hay
--                   mecanismo automático de expiración).
--
-- Postgres no permite usar un valor de enum nuevo en la misma transacción en la que se agrega
-- ("unsafe use of new value ... New enum values must be committed before they can be used").
-- Este archivo SOLO agrega los valores: ningún default, política o función los referencia, así
-- que no hace falta un paso 2 (los usa el código de la app en runtime, no el SQL).
-- La política `matriculas_insert_acudiente` (0007b) sigue forzando 'Pendiente' en el insert del
-- acudiente — correcto, no se toca.

alter type estado_matricula add value if not exists 'En revisión';
alter type estado_matricula add value if not exists 'Rechazada';
alter type estado_matricula add value if not exists 'Expirada';
