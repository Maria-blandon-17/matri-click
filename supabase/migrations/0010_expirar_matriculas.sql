-- Expiración automática de matrículas pendientes.
--
-- Regla ("lo que ocurra primero"): una matrícula en 'Pendiente' o 'En revisión' pasa a
-- 'Expirada' cuando lleva >30 días desde fecha_matricula, O cuando el periodo académico de esa
-- matrícula ya terminó (fecha_fin < hoy). Se usa fecha_fin (no fecha_inicio) a propósito: se
-- aceptan matrículas tardías mientras el periodo esté en curso; solo se descartan cuando el
-- periodo ya cerró. El estado 'Expirada' se agregó en 0009.
--
-- Corre vía pg_cron (job diario), no desde la app. Sin costo: la extensión es gratis en el
-- plan Free de Supabase y el UPDATE es liviano.
--
-- ⚠️ Antes de correr este archivo: habilitar la extensión "pg_cron" en el dashboard de Supabase
--    (Database → Extensions). El `create extension` de abajo también la habilita si el rol tiene
--    permiso, pero el toggle del dashboard es la vía canónica en Supabase.

create extension if not exists pg_cron;

create or replace function public.expirar_matriculas_pendientes()
returns void
language sql
security definer
set search_path = public
as $$
  update matriculas m
  set estado_matricula = 'Expirada'
  from periodos_academicos p
  where m.id_periodo = p.id_periodo
    and m.estado_matricula in ('Pendiente', 'En revisión')
    and (
      m.fecha_matricula < now() - interval '30 days'
      or p.fecha_fin < current_date
    );
$$;

-- Solo la usa el cron. Ninguna ruta/rol de la app la llama (mismo criterio que 0006).
revoke all on function public.expirar_matriculas_pendientes() from public;

-- (Re)programa el job diario a las 03:00 UTC. unschedule previo para que este archivo sea
-- idempotente si se vuelve a correr.
select cron.unschedule('expirar-matriculas')
where exists (select 1 from cron.job where jobname = 'expirar-matriculas');

select cron.schedule(
  'expirar-matriculas',
  '0 3 * * *',
  $$select public.expirar_matriculas_pendientes()$$
);
