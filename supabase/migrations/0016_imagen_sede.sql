-- Agrega una imagen de portada opcional por sede, para el nuevo diseño de tarjetas
-- en /dashboard/administracion/sedes.
alter table sedes
  add column imagen_url text;
