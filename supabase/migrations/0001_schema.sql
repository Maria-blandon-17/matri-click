-- Esquema base: tipos ENUM y tablas del dominio académico.
create extension if not exists "pgcrypto";

create type nivel_educativo as enum ('Primaria','Bachillerato');
create type estado_profesor as enum ('Activo','Inactivo');
create type tipo_doc_acudiente as enum ('TI','CC','CE','Pasaporte');
create type parentesco as enum ('Padre','Madre','Tutor','Otro');
create type tipo_doc_estudiante as enum ('TI','RC','CE','Pasaporte');
create type genero as enum ('Masculino','Femenino','Otro');
create type estado_estudiante as enum ('Activo','Retirado','Graduado');
create type estado_periodo as enum ('Activo','Finalizado','Planeado');
create type estado_matricula as enum ('Activa','Cancelada','Finalizada');

create table sedes (
  id_sede uuid primary key default gen_random_uuid(),
  nombre_sede text not null,
  direccion text,
  telefono text,
  created_at timestamptz not null default now()
);

create table profesores (
  id_profesor uuid primary key default gen_random_uuid(),
  documento text not null unique,
  nombres text not null,
  apellidos text not null,
  telefono text,
  correo_electronico text unique,
  estado_profesor estado_profesor not null default 'Activo',
  created_at timestamptz not null default now()
);

create table grados (
  id_grado uuid primary key default gen_random_uuid(),
  nombre_grado text not null,
  nivel_educativo nivel_educativo not null
);

create table grupos (
  id_grupo uuid primary key default gen_random_uuid(),
  id_grado uuid not null references grados(id_grado),
  id_sede uuid not null references sedes(id_sede),
  nombre_grupo text not null,
  cupo_maximo int not null default 30,
  id_director_grupo uuid references profesores(id_profesor)
);

create table periodos_academicos (
  id_periodo uuid primary key default gen_random_uuid(),
  nombre_periodo text not null,
  fecha_inicio date not null,
  fecha_fin date not null,
  estado estado_periodo not null default 'Planeado'
);

create table acudientes (
  id_acudiente uuid primary key default gen_random_uuid(),
  tipo_documento tipo_doc_acudiente not null,
  documento text not null,
  nombres text not null,
  apellidos text not null,
  telefono text,
  correo_electronico text unique,
  direccion text,
  parentesco parentesco not null,
  created_at timestamptz not null default now(),
  unique (tipo_documento, documento)
);

create table estudiantes (
  id_estudiante uuid primary key default gen_random_uuid(),
  tipo_documento tipo_doc_estudiante not null,
  documento text not null,
  nombres text not null,
  apellidos text not null,
  fecha_nacimiento date not null,
  genero genero not null,
  id_acudiente uuid references acudientes(id_acudiente),
  fecha_registro timestamptz not null default now(),
  estado_estudiante estado_estudiante not null default 'Activo',
  unique (tipo_documento, documento)
);

create table matriculas (
  id_matricula uuid primary key default gen_random_uuid(),
  codigo_matricula text not null unique,
  id_estudiante uuid not null references estudiantes(id_estudiante),
  id_periodo uuid not null references periodos_academicos(id_periodo),
  id_grupo uuid not null references grupos(id_grupo),
  fecha_matricula timestamptz not null default now(),
  estado_matricula estado_matricula not null default 'Activa',
  observaciones text
);

create index idx_grupos_id_grado on grupos(id_grado);
create index idx_grupos_id_sede on grupos(id_sede);
create index idx_estudiantes_id_acudiente on estudiantes(id_acudiente);
create index idx_matriculas_id_estudiante on matriculas(id_estudiante);
create index idx_matriculas_id_periodo on matriculas(id_periodo);
create index idx_matriculas_id_grupo on matriculas(id_grupo);
