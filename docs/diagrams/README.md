# Diagramas de MatriClick

Cuatro archivos HTML autocontenidos (fuentes por Google Fonts, diagramas por Mermaid vía CDN
`cdn.jsdelivr.net/npm/mermaid`) — se abren directo con doble clic / `open archivo.html`, sin
servidor ni build.

- **`esquema-clases.html`** — las 9 entidades del esquema (`lib/types/database.types.ts`)
  dibujadas con notación de diagrama de clases (cajas con atributos, flechas "1"/"0..\*"). Incluye
  la tabla entidad → archivo de Server Actions.
- **`modelo-entidad-relacion.html`** — las mismas 9 entidades en notación pata de gallina
  (crow's foot), la que se usa realmente en diseño de bases de datos. Incluye guía de lectura de
  cardinalidades.
- **`casos-de-uso.html`** — diagrama UML de casos de uso (actores Admin/Profesor/Acudiente/
  Estudiante/Visitante y qué puede hacer cada uno), dibujado a mano en SVG porque Mermaid no
  tiene un tipo de diagrama de casos de uso.
- **`flujo-informacion.html`** — cómo viaja un dato entre navegador, servidor Next.js y Supabase
  (el patrón general de cualquier Server Action) + el ejemplo real de una solicitud de matrícula
  de principio a fin. Los otros tres diagramas describen estructura y permisos; este describe el
  recorrido en el tiempo.

## Cuándo actualizarlos

Solo cuando cambie el **modelo de datos** o **quién puede hacer qué** — no por cambios de UI
(estilos, paginación, textos). Ejemplos que sí ameritan actualizar:

- Se agrega/quita una tabla o columna en `supabase/migrations/`.
- Se agrega/quita un valor de un enum (como pasó con `estado_matricula: "Pendiente"`).
- Cambia una relación entre tablas (una FK nueva, una FK que deja de ser opcional, etc.).
- Un rol gana o pierde una capacidad (una política RLS nueva, una pantalla que se abre a un rol
  que antes no la tenía).

Estos archivos se generaron y mantienen manualmente (no hay script que los regenere desde el
schema) — si tocas el modelo de datos o los permisos por rol, edítalos a mano igual que
`lib/types/database.types.ts`.
