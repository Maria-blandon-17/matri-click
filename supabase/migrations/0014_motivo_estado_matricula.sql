-- El admin puede dejar un motivo opcional al rechazar o cancelar una matrícula (decisión
-- explícita del usuario, 2026-10-15) — visible tanto para el admin como para el acudiente que
-- la solicitó. Se guarda en una columna aparte de `observaciones` (que ya se usa para la nota
-- que el acudiente/admin deja al CREAR la matrícula) para no mezclar ambos propósitos.
alter table matriculas add column motivo_estado text;
