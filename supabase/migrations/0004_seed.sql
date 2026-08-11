-- Datos de demostración para probar el dashboard sin depender de registros manuales.
-- No crea usuarios de auth; solo catálogo académico base.
insert into sedes (nombre_sede, direccion, telefono) values
  ('Sede Principal', 'Cra 10 # 20-30', '3001234567'),
  ('Sede Norte', 'Calle 80 # 15-40', '3007654321');

insert into grados (nombre_grado, nivel_educativo) values
  ('Quinto', 'Primaria'),
  ('Sexto', 'Bachillerato'),
  ('Séptimo', 'Bachillerato');

insert into periodos_academicos (nombre_periodo, fecha_inicio, fecha_fin, estado) values
  ('2024', '2024-01-15', '2024-11-29', 'Activo');

insert into grupos (id_grado, id_sede, nombre_grupo, cupo_maximo)
select g.id_grado, s.id_sede, '5-A', 30
from grados g, sedes s
where g.nombre_grado = 'Quinto' and s.nombre_sede = 'Sede Principal';
