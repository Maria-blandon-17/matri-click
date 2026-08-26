-- Paso 1 de 2. Ejecutar este archivo SOLO (dar "Run" en el SQL Editor) y esperar a que
-- termine ANTES de correr 0007b_solicitudes_matricula_policies.sql.
-- Postgres no permite usar un valor de enum nuevo en la misma transacción en la que se
-- agrega ("unsafe use of new value ... New enum values must be committed before they can
-- be used") — por eso el ADD VALUE va en un archivo separado del que ya lo usa.

alter type estado_matricula add value if not exists 'Pendiente';
