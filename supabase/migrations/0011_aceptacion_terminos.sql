-- Registro de la aceptación de términos y condiciones por cuenta.
-- `terminos_version` guarda qué versión de /terminos aceptó (para poder pedir
-- re-aceptación si el texto cambia). Cuentas anteriores quedan en NULL.
alter table perfiles
  add column terminos_aceptados_at timestamptz,
  add column terminos_version text;
