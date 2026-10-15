@AGENTS.md

# MatriClick — Sistema de Matrículas Virtuales

Sistema web de gestión académica (matrículas, estudiantes, grupos, sedes, periodos) para
instituciones educativas. Landing pública + dashboard de administración + auth con roles.

**Producción:** https://matri-click.vercel.app
**Repo local:** esta carpeta (`matri-click/`), git inicializado, remoto en
`https://github.com/Maria-blandon-17/matri-click.git`.

Antes de arrancar una tarea nueva, revisa `ROADMAP.md` en la raíz del repo — ahí se anotan
pendientes de producto y de seguridad que fueron surgiendo en conversación pero no se han
implementado todavía (evita reproponerlos desde cero).

## Stack

- **Next.js 16** (App Router, Turbopack). ⚠️ Rompe con lo que sabes de versiones anteriores:
  `proxy.ts` reemplaza a `middleware.ts` (función exportada se llama `proxy`, no `middleware`),
  `params`/`searchParams` son `Promise` y deben `await`earse. Antes de tocar código de
  routing/caching, lee `node_modules/next/dist/docs/` — ver detalle en `AGENTS.md`.
- **React 19**, **Tailwind CSS v4**, **shadcn/ui** (estilo `base-nova`, construido sobre
  `@base-ui/react`, NO Radix). Diferencias clave de base-ui vs Radix:
  - `Button`/`DialogTrigger`/etc. usan prop `render={<OtroElemento />}` en vez de `asChild`.
  - Si `render` apunta a algo que no es un `<button>` nativo (ej. `<Link>`), hay que pasar
    `nativeButton={false}` o React tira warning de accesibilidad.
  - `Select` (base-ui) **ya no se usa en este proyecto** — se reemplazó por completo por
    `components/ui/combobox.tsx` (ver sección "Selectores" abajo). No reintroducir `Select`.
  - El componente `Form` clásico de shadcn no existe en este estilo; se usa `Field`/`FieldLabel`/
    `FieldError`/`FieldGroup` (`components/ui/field.tsx`) a mano con `useActionState`.
- **Supabase**: Postgres + Auth + RLS. Cliente en `lib/supabase/{client,server}.ts` (anon key)
  y `lib/supabase/admin.ts` (service role, solo en Server Actions, nunca en cliente — ver
  ejemplo de uso legítimo en `lib/actions/auth.ts` y `lib/actions/cuentas.ts`).
- **Vercel**: proyecto enlazado a la cuenta `mariablandon1514-7537s-projects` (no la cuenta
  personal del usuario — cambió de cuenta a mitad de proyecto con `vercel login`). Deploy con
  `vercel --prod --yes` desde esta carpeta.

## Selectores: `Combobox`, no `Select`

Todo el proyecto usa `components/ui/combobox.tsx` (envuelve `@base-ui/react/combobox`, ya
instalado — no es una librería nueva) en vez de `components/ui/select.tsx`. Se migraron los 9
selectores que existían (tipo documento, género, estado, acudiente, grado, sede, director de
grupo, estudiante/periodo/grupo en matrícula, vinculación de cuentas) porque el `Select` viejo
no tenía buscador y con listas largas era inutilizable.

API pensada para ser casi un drop-in del `Select` viejo:

```tsx
<Combobox name="tipoDocumento" defaultValue="TI" items={{ TI: "TI", CC: "CC" }}>
  <ComboboxTrigger id="tipoDocumento" className="w-full">
    <ComboboxValue placeholder="Selecciona..." />
  </ComboboxTrigger>
  <ComboboxContent searchPlaceholder="Buscar..." />
</Combobox>
```

`items` sigue siendo `Record<valor, etiqueta>` (igual que antes). `ComboboxContent` **no** recibe
hijos — genera la lista automáticamente a partir de `items` con buscador integrado, así que no
hay que repetir un `<ComboboxItem>` por opción como antes con `SelectItem`.

## Estructura

```
app/
  (marketing)/        landing pública — layout fuerza tema oscuro (class="dark")
  (auth)/{login,registro,recuperar,actualizar-password}/  auth (ver "Pantallas de auth" abajo)
  auth/callback/     route handler: aterrizaje de los enlaces de correo de Supabase
  dashboard/           área autenticada (protegida por proxy.ts) — layout también fuerza "dark"
    academico/{grados,grupos,periodos}
    administracion/{sedes,profesores,acudientes}
    estudiantes/  matriculas/{page,nueva}/  reportes/  cuentas/ (= "Mi perfil", ver abajo)
lib/
  actions/            Server Actions + queries por entidad (una por tabla), más:
                       perfil.ts (getPerfilActual con email, getRegistroVinculado),
                       mi-perfil.ts (actualizarNombrePerfil, cambiarPassword),
                       cuentas.ts (vincular cuentas de acceso a registros académicos)
  validations/        esquemas zod
  supabase/           clientes
  types/database.types.ts   tipos manuales (ver nota abajo)
components/
  ui/                 primitivos shadcn (genéricos, no tocar el theming acá) + combobox.tsx
  dashboard/crud/      CrudDialog y DeleteButton compartidos por las pantallas de catálogo
  dashboard/cuenta/    formulario de nombre y diálogo de cambiar contraseña de "Mi perfil"
  dashboard/*          sidebar, topbar, kpi-card, widgets del dashboard, cuenta-vinculo-cell
  landing/             secciones de la landing (incluye modules.tsx: "módulos que ya existen")
  brand/logo.tsx        logo (ver sección Marca)
supabase/migrations/   0001_schema … 0006_endurecer_permisos_funciones,
                        0007_solicitudes_matricula (+ 0007b_..._policies), 0008_cuentas_pendientes,
                        0009_estados_matricula (agrega 'En revisión'/'Rechazada'/'Expirada' al
                        enum estado_matricula), 0010_expirar_matriculas (pg_cron: job diario que
                        pasa a 'Expirada' — habilitar la extensión pg_cron en el dashboard antes),
                        0011_aceptacion_terminos (perfiles.terminos_aceptados_at/terminos_version)
                        — correr en ese orden en el SQL Editor de Supabase
                        (no hay CLI de supabase configurada, se aplican a mano). Agregar valores a
                        un enum: un archivo con solo los `ADD VALUE` (Postgres no deja usarlos en
                        la misma transacción); si algún default/policy/función los referencia, va
                        en un archivo aparte que corre después (patrón 0007 + 0007b).
```

## Diagramas del proyecto

`docs/diagrams/` tiene 4 HTML autocontenidos (abrir directo en el navegador, sin build):
esquema de clases, modelo entidad-relación (pata de gallina), casos de uso por rol, y flujo de
información (cómo viaja un dato entre navegador/servidor/Supabase, con el ejemplo de una
solicitud de matrícula). Actualizarlos a mano cuando cambie el modelo de datos, los permisos por
rol, o el patrón de request/response — no por cambios de UI. Detalle en `docs/diagrams/README.md`.

## Modelo de datos y roles

Tablas: `sedes, grados, grupos, periodos_academicos, profesores, acudientes, estudiantes,
matriculas, perfiles`. `perfiles` vincula `auth.users` con un `rol` (`admin | profesor |
acudiente | estudiante`) y opcionalmente con `id_profesor`/`id_acudiente`/`id_estudiante`.

**Estados** (enums de Postgres):
- `estado_matricula` (7): `Pendiente` → `En revisión` → `Activa` | `Rechazada` · `Cancelada`
  (anulada tras estar activa) · `Finalizada` (periodo cerrado) · `Expirada`. El admin cambia el
  estado con un selector libre (sin reglas de flujo) en `/dashboard/matriculas`; el chequeo de
  cupo en `actualizarEstadoMatricula` solo aplica al pasar a `Activa`. **`Expirada` es
  automática**: un job de pg_cron (`expirar_matriculas_pendientes`, migración `0010`) corre a
  diario y pasa a `Expirada` toda matrícula en `Pendiente`/`En revisión` con >30 días o cuyo
  periodo ya terminó (`fecha_fin < hoy` — no `fecha_inicio`: se aceptan matrículas tardías
  mientras el periodo esté en curso); el admin igual puede ponerla a mano. Orden canónico
  + mapa a color/ícono: `ESTADOS_MATRICULA` y `VARIANT_BY_ESTADO` en
  `components/dashboard/estado-matricula-badge.tsx`.
- `estado_estudiante` (3): `Activo | Retirado | Graduado`. `estado_periodo` (3): `Planeado |
  Activo | Finalizado`.
- Badge de estado compartido: `components/dashboard/status-badge.tsx` (`<StatusBadge variant
  label>`, pill con ícono + fondo suave). Lo usan matrículas, estudiantes, periodos y las filas
  de "Cuentas pendientes". Cada entidad tiene su mapa `estado → StatusVariant`.

- Registro público (`/registro`) permite los 3 roles no-admin: `acudiente`, `estudiante` y
  `profesor`. Admin sigue creándose a mano vía Supabase Admin API (no hay UI para esto — ver
  `ROADMAP.md`).
- **Vinculación automática por documento:** al registrarse, se busca el documento ingresado en
  `estudiantes`/`acudientes`/`profesores` (según el rol elegido) para conectar la cuenta nueva con
  el registro existente. Esta búsqueda usa `createAdminClient()` (service role) a propósito: una
  cuenta recién creada y aún sin vincular no tiene ninguna política RLS que le permita leer esas
  tablas — problema de huevo y gallina. Si no hay coincidencia, el documento igual queda guardado
  en `perfiles.documento` (no se pierde) para que el admin lo revise después en "Cuentas
  pendientes". No volver a cambiar esa búsqueda al cliente con RLS.
- **"Cuentas pendientes" (admin, `/dashboard/administracion/cuentas-pendientes`):** lista todas
  las cuentas sin vincular (acudiente/profesor/estudiante juntos), con badge en el sidebar
  (`lib/actions/cuentas-pendientes.ts`). Tres acciones por fila: **Aceptar** (crea la ficha
  académica con lo ya conocido — nombre/documento/correo — y la vincula; para acudiente/estudiante
  rellena con un valor provisional los campos obligatorios que el registro no pregunta, y la
  persona los corrige después desde "Mi perfil"), **Rechazar** (`perfiles.rechazado = true`, no se
  le crea ficha nunca), **Descartar** (borra la cuenta por completo). Ver detalle completo en
  `ROADMAP.md`.
- **Vinculación manual desde el dashboard:** alternativa a "Cuentas pendientes" cuando el admin ya
  creó la ficha académica de antemano — vincula una cuenta ya registrada directamente desde las
  pantallas de `Estudiantes`/`Administración → Acudientes`/`Administración → Profesores` — columna
  "Cuenta" (`components/dashboard/cuenta-vinculo-cell.tsx`, acciones en `lib/actions/cuentas.ts`).
- **Autoedición de la propia ficha:** desde "Mi perfil" (`/dashboard/cuentas`), cada rol vinculado
  puede corregir sus propios datos académicos (nombres, apellidos, teléfono, tipo de documento,
  parentesco, fecha de nacimiento, género según el rol) — nunca su `documento`, que solo admin
  puede cambiar (forzado por un trigger de Postgres, no por RLS — ver `ROADMAP.md` para el porqué).
- RLS activo en todas las tablas: admin ve todo, profesor solo sus grupos/estudiantes/matrículas
  (y sin permiso de escritura en ninguna tabla salvo lo que RLS le explicite — hoy solo lectura),
  acudiente solo su(s) estudiante(s) (sin escritura), estudiante solo su propio registro (sin
  escritura). Verificado end-to-end con cuentas de prueba.
- **Control de acceso también en la UI del dashboard, no solo en RLS:** cada página bajo
  `app/dashboard/**` que tiene botones de crear/editar/eliminar hace
  `getPerfilActual()` y solo los renderiza si `perfil.rol === "admin"` (RLS ya lo bloqueaba a
  nivel de datos, pero antes los botones quedaban visibles igual para todos, lo cual era
  confuso). El menú lateral (`components/dashboard/sidebar.tsx`) filtra secciones **e ítems
  individuales** por rol — cada ítem de nav puede traer su propio `roles` que sobreescribe el de
  la sección (necesario porque, p.ej., dentro de "Comunidad", Estudiantes y Matrículas tienen
  distinta visibilidad por rol). Agrupación actual del sidebar: Académico (Grados/Grupos/
  Periodos, admin+profesor) · Administración (Sedes/Matrículas, admin-only salvo Matrículas que
  se abre a todos) · Comunidad (Profesores/Acudientes admin-only, Estudiantes abierto también a
  profesor/acudiente) · Sistema (Reportes/Cuentas, admin-only en el nav — pero "Mi perfil" sigue
  siendo accesible a cualquier rol vía el dropdown del avatar, ver abajo).
- **Guard también a nivel de ruta**, no solo ocultando botones: `lib/supabase/middleware.ts`
  (`ADMIN_ONLY_PREFIXES`) redirige a `/dashboard/inicio` a cualquier usuario autenticado que no
  sea admin y navegue directo por URL a `/dashboard/administracion/*` o `/dashboard/reportes`.
  Si se agrega una sección admin-only nueva al sidebar, agregar también su prefijo ahí.
- `lib/types/database.types.ts` está **escrito a mano**, no generado con `supabase gen types`
  (no se configuró el CLI de Supabase). Si cambias el schema en Supabase, hay que actualizar
  este archivo manualmente, incluyendo `Relationships: []` en cada tabla (requerido por el tipo
  `GenericTable` de `@supabase/supabase-js` aunque no lo usemos) y el bloque `Views/Functions/
  Enums/CompositeTypes` a nivel de schema `public` (si falta, los `.select()` con joins
  embebidos (`tabla ( columna )`) tipan como `never` — ver los `as unknown as X[]` en
  `lib/actions/grupos.ts`, `estudiantes.ts`, `matriculas.ts` como referencia del patrón).

## "Mi perfil" (`/dashboard/cuentas`)

Ya no es un placeholder. Cualquier rol puede editar su propio `nombre_completo`
(`lib/actions/mi-perfil.ts` → `actualizarNombrePerfil`) y cambiar su contraseña
(`cambiarPassword`, usa `supabase.auth.updateUser` con la sesión propia — nunca el cliente
admin para esto). Muestra también, de solo lectura, los datos del registro académico vinculado
según el rol (`getRegistroVinculado` en `lib/actions/perfil.ts`, devuelve una unión discriminada
por `tipo: "profesor" | "acudiente" | "estudiante"`), y un aviso ámbar si la cuenta todavía no
está vinculada a ningún registro. Se accede desde el dropdown del avatar en el topbar
("Mi perfil" + "Cerrar sesión" juntos ahí — el botón de logout suelto que había en el sidebar se
quitó para no duplicar la acción).

## Shell del dashboard (layout tipo "Eduplex")

`app/dashboard/layout.tsx` = `<Sidebar>` (panel fijo a la izquierda: `sticky h-svh`, borde
derecho, `bg-#111827`, sin redondeo ni margen — se colapsa a `MobileSidebar`/Sheet en `< md`) +
columna de contenido (`max-w-[1600px]`, padding normal) sobre un canvas `#0a0f19` con
`radial-gradient` cobalto. **Sin tarjeta flotante ni gutter** — va a sangre.

**Header** (`components/dashboard/dashboard-header.tsx` → `DashboardHeader` + `DashboardGreeting`):
solo menú móvil + saludo. No lleva buscador (un search de estudiantes no encajaba en un panel de
métricas agregadas; el filtrado real del dashboard lo hace el selector de periodo). El menú del
avatar (Mi perfil / Cerrar sesión) vive **al pie del sidebar** (`SidebarProfile` en `sidebar.tsx`:
avatar + nombre + correo → `DropdownMenu`), no en el header — así también queda accesible desde
el `MobileSidebar` (Sheet). `Sidebar`/`SidebarContent`/`MobileSidebar` reciben `nombre`/`correo`.
`components/dashboard/topbar.tsx` es un wrapper cliente que monta `DashboardHeader` a lo ancho
completo **en todas las páginas menos `/dashboard/inicio`** (ahí devuelve `null` vía
`usePathname`). En `/inicio`, `page.tsx` pasa el `DashboardHeader` como prop `header` a
`InicioFiltroPeriodo` / `InicioPersonal`. En `InicioFiltroPeriodo` el `header` + el selector de
periodo van en una fila a lo ancho completo arriba; debajo empieza el split de 2 columnas, así
la columna derecha arranca alineada con la fila de tarjetas (no con el saludo). Las páginas CRUD
no cambiaron. Paleta: superficies subidas en `globals.css` (`--card #151d2c`, `.glass-card`
`rgba(23,31,46,.92)`, `--border` 10 %) para que el dashboard no se sienta tan oscuro.

## `/dashboard/inicio`: filtro por periodo, sin navegar de página

`app/dashboard/inicio/page.tsx` (admin/profesor) hace el fetch inicial en el servidor y le pasa
los datos a `components/dashboard/inicio-filtro-periodo.tsx` (client), que arma el layout de 2
columnas de Inicio (inspirado en el mockup "Eduplex", con la paleta oscura del proyecto):

- **Fila superior (ancho completo)**: `header` (saludo) + selector de periodo.
- **Centro**: `ResumenCards` (3 tarjetas de dominio — Comunidad / Matrículas / Académico — cada
  una con un número grande + 2 sub-stats en el pie, enlaza a su sección) · grid 2-col
  [`OcupacionGradoChart` (barras: % de cupos ocupados por grado) + `GruposLista` (lista tipo
  agenda, top 5)] · grid 3-col [`AiInsightCard` + `OcupacionGauge`] · card "Últimas matrículas"
  (`MatriculasTable`).
- **`<aside>` derecha** (`xl:w-[300px]`): `ProBanner` ("MatriClick Pro · Próximamente",
  honesto — Pro no existe, enlaza a `/#planes`) · `MiniCalendario` (mes actual, marca hoy,
  decorativo) · `PendientesPanel` (matrículas y cuentas pendientes, top 4 + enlace).

Datos nuevos en `lib/actions/dashboard.ts`: `getResumenDominios` (contadores por dominio) y
`getOcupacionPorGrado` (matriculados/cupo agregado por grado) — ambos entran a
`getInicioDashboardData` y se refiltran al cambiar el periodo. `getGrupos()` (de
`lib/actions/grupos.ts`) y los pendientes los trae `page.tsx`: los pendientes solo para
`rol === "admin"` (`getMatriculas({ estado: "Pendiente" })` + `getCuentasPendientes()`);
profesor recibe `[]` y no ve `PendientesPanel`.

Búsqueda de estudiantes: vive en `/dashboard/estudiantes` (input propio en el header de la
página, `<form method="get">`). `page.tsx` lee `?q=` (Promise, Next 16) y filtra en el servidor
por nombre + documento. No hay buscador global en el dashboard.

Al cambiar el selector de periodo, **no** se
navega ni se usa `router.push`/query params — se llama directo a la Server Action
`getInicioDashboardData(idPeriodo?)` (`lib/actions/dashboard.ts`, que por eso es `"use server"` y
no `"server-only"`) dentro de un `useTransition`, y se actualiza solo el estado local. Se probó
primero con navegación por URL y se sintió lento (apagaba toda la pantalla mientras esperaba el
RSC); el patrón de Server Action llamada directo desde cliente es preferible para cualquier
filtro similar que se agregue después (ej. por sede).

La animación va en los datos, no en un overlay de carga:
- `components/dashboard/animated-number.tsx` — anima cualquier número que cambie (conteo con
  easing, `requestAnimationFrame`, sin librería). Ya está integrado en `KpiCard`,
  `OcupacionGauge` y `AiInsightCard` — si se agrega un widget nuevo con un número que pueda
  cambiar en caliente, envolverlo en `<AnimatedNumber value={...} />` en vez de renderizarlo
  crudo.
- El arco de `OcupacionGauge` transiciona con `transition-[stroke-dashoffset]` en CSS.
- Listas/tablas que se reemplazan completas (como `MatriculasTable` en Inicio) usan
  `key={...datos...}` + `animate-in fade-in` (de `tw-animate-css`, ya importado en
  `globals.css`) para un fade corto en vez de un salto brusco.

## Tema oscuro y Portals (gotcha importante)

Todo el sitio vive dentro de un `class="dark"` que hoy está puesto en **`<html>`**
(`app/layout.tsx`), no solo en los `<div>` internos de cada layout de route group. Esto es
crítico: `Dialog`, `Select`/`Combobox`, `DropdownMenu`, `Sheet` y `AlertDialog` usan `Portal` de
React (montan su contenido en `document.body` por defecto). Si `dark` solo estuviera en un
`<div>` interno (como estaba originalmente), todo lo que se abre en un portal cae **fuera** de
ese wrapper y renderiza con el tema claro (`:root`, nunca usado en ningún otro lado) — se ve
roto/genérico. Si se vuelve a tocar el theming, **no quitar `dark` de `<html>`** aunque parezca
redundante con los `<div class="dark">` de cada layout — esos son inofensivos pero no son
suficientes por sí solos.

También: los inputs autocompletados por el navegador (usuario/contraseña guardados) fuerzan un
fondo claro que Chrome no deja overridear con CSS normal — hay una regla en `app/globals.css`
(`input:-webkit-autofill`) con el truco del `box-shadow` inset para forzar el tema oscuro ahí
también. No borrarla pensando que es CSS muerto.

## Pantallas de auth

Login y registro viven en **una sola pantalla a pantalla completa con transición deslizante**
(`components/auth/auth-flow.tsx`, `<AuthFlow>`): panel de imagen a un lado, formulario al otro.
Al pasar de login a registro el panel de imagen se desliza al lado contrario (y el formulario
al suyo) con `transition-transform` / `transition-[margin]` `duration-700`; el contenido del
formulario hace un fundido corto (`animate-in fade-in`, key por modo). Cada modo sigue siendo
una **ruta real** (`/login`, `/registro`) — `app/(auth)/{login,registro}/page.tsx` solo hacen
`<AuthFlow initialMode="…" />`. El botón "Regístrate"/"Inicia sesión" **no navega**: cambia el
estado y actualiza la URL con `history.replaceState`, para no remontar nada durante la
animación (un refresh o visita directa cargan la ruta correcta). En `< lg` no hay panel de
imagen: solo el formulario con el fundido. Respeta `prefers-reduced-motion`.

Piezas compartidas en `components/auth/`:
- `auth-visual.tsx` (`<AuthVisual className>`, client) — panel de imagen: **carrusel** de 3 fotos
  (`public/assets/auth-carousel/slide-{1,2,3}.webp`, fundido por opacity cada 5 s + puntos
  clicables) + capa `.auth-wave` (2 manchas CSS que laten, solo transform/opacity) + degradado +
  marca que enlaza a `/` + claim. Es el mismo componente en login y registro, así que el carrusel
  es el mismo al deslizarse. El alto, el padding y el `rounded-*` los pone
  cada consumidor por `className` (en `AuthFlow` va con `p-3` en el wrapper + `rounded-[28px]`
  para que las esquinas del lado interno se vean redondeadas en ambos lados).
- `login-form.tsx`, `registro-form.tsx` — los formularios (client, `useActionState`), con prop
  `onSwitch`. Labels `sr-only` + placeholder, inputs `h-12 rounded-xl auth-field` (clase en
  `globals.css`: fondo `--card` sólido + borde blanco, ambos `!important`: el `<Input>` base trae
  `dark:bg-input/30` y las utilidades `!bg-*` de Tailwind v4 no le ganaban de forma fiable — un
  fondo translúcido dejaba pasar el brillo del canvas y "lavaba" los campos). Textos sueltos sobre
  el fondo animado van en `text-white` / `text-white/70`, **sin `text-shadow`** (se veía borroso).
- El panel del formulario de `AuthFlow` es una tarjeta `rounded-[28px]` (`isolate` + `overflow-hidden`)
  con un `<WaveCanvas layers={AUTH_WAVE_LAYERS} showDots />` detrás (`-z-20`; el degradado
  translúcido va en `-z-10`). **`isolate` es obligatorio**: sin él los z-index negativos se escapan
  detrás del `bg` de la propia tarjeta y el canvas dibuja pero no se ve.
- `registro-form.tsx` tiene checkbox obligatorio `terminos` (enlaza a `/terminos`). Se valida en
  `registroSchema` (`z.literal("on")`) y la acción guarda `terminos_aceptados_at` +
  `terminos_version` (`TERMINOS_VERSION` en `lib/validations/auth.ts`; subirla si cambia el texto)
  en `perfiles` con un `update` **aparte** del de documento/vinculación, para que si la migración
  0011 no está aplicada no se pierda la vinculación (solo hace `console.error`).
- `auth-shell.tsx` (`<AuthShell>`) — cascarón split SIN slide, para `/recuperar` y
  `/actualizar-password`.

`app/(auth)/layout.tsx` quedó mínimo (solo `dark` + fuente + `min-h-svh`). Cada página aporta su
propio fondo: `AuthShell`/`AuthFlow` traen el suyo; `registro` ya no depende del layout para eso.

### Recuperación de contraseña

Flujo implementado (2026-09-10), **pendiente de config en Supabase para que el correo llegue —
ver `ROADMAP.md`** (Redirect URLs allowlist + SMTP propio):
- `/recuperar` → acción `solicitarRecuperacion` (`lib/actions/auth.ts`) → `resetPasswordForEmail`
  con `redirectTo` = `<origin>/auth/callback?next=/actualizar-password` (el `origin` se saca de
  `headers()`, no hay `NEXT_PUBLIC_SITE_URL`). Respuesta neutra: no revela si el correo existe.
- `app/auth/callback/route.ts` — canjea `?code=` (PKCE, correo por defecto) **o**
  `?token_hash=&type=` (si se personaliza la plantilla) → crea la sesión → redirige a `?next=`.
  Sin token válido → `/login?error=enlace_invalido`.
- `/actualizar-password` — `page.tsx` es Server Component con guard: sin sesión → `/recuperar`.
  `form.tsx` (client) → acción `actualizarPassword` → `updateUser({ password })` → dashboard.
- Esquemas nuevos en `lib/validations/auth.ts`: `recuperarSchema`, `nuevaPasswordSchema`.

## Landing pública

Secciones, en orden: `Hero` → `Modules` (`#modules`, "Los módulos que ya
puedes usar hoy": Estudiantes, Matrículas, Académico, Administración) → `HowItWorks`
(`#how-it-works`) → `Planes` (`#planes`, comparación Gratis/Pro) → `Cta`. Se eliminó
`Features` (duplicaba literalmente 2 de sus 3 tarjetas con `Modules`) — si se necesita un
diferenciador que no sea "módulo", agregarlo como copy dentro de `Modules`/`Planes`, no revivir
una sección `Features` aparte. También se eliminó `DashboardPreview` ("Vista previa del panel"):
el `Hero` es ahora una sola columna centrada (badge + titular + subtítulo + 2 CTA), sin la tarjeta
de ejemplo del panel.

**Fondo de TODA la landing**: un único `<WaveCanvas layers={LANDING_WAVE_LAYERS} showDots />`
(`components/landing/wave-canvas.tsx`, client) montado en `app/(marketing)/layout.tsx` detrás de
Navbar + `<main>` + Footer (los tres tienen `z-10`/`z-50` explícito para quedar encima). Dibuja con
`<canvas>` cintas de luz con `filter: blur()` (azul/índigo/cian de marca, adaptadas de una
referencia de Stitch) + grilla de puntos reactiva al cursor. Decisiones que costaron varias
iteraciones:
- **Un solo canvas, no uno por sección**: con dos (hero + cuerpo) la grilla de puntos de cada uno
  empezaba en su borde y se veía una costura. `startY/endY` son fracciones de la altura TOTAL de la
  página; las 5 primeras capas son la composición original del hero reescalada al primer ~16 %.
- **Dos `<canvas>` apilados**: cintas (caras por el blur, se redibujan cada ~42 ms) y puntos
  (baratos, cada frame). Antes iban juntos y el blur bajaba el fps → los puntos "perseguían" el
  cursor con rezago. `MOUSE_LERP = 0.35`.
- Pausa con `IntersectionObserver` + `visibilitychange`; con `prefers-reduced-motion` dibuja un solo
  frame estático. El usuario aceptó explícitamente el costo de performance de animar la landing
  (antes era estática por un intento viejo con blur que sí repintaba al hacer scroll) — si en algún
  dispositivo va lenta, bajar `blur`/capas en `LANDING_WAVE_LAYERS` antes que quitar el canvas.
- `AUTH_WAVE_LAYERS` (mismo archivo) es la composición original del hero sin reescalar, para el
  panel del formulario de login/registro. La foto `fondo.webp` y las clases `.hero-aura*` /
  `.landing-ambient` ya no existen.

El `Footer` (`components/landing/footer.tsx`) es de 4 columnas (marca + claim · Navegación
`#modules`/`#how-it-works`/`#planes` · Cuenta `/login`/`/registro` · Legal `/terminos`) + barra
inferior con copyright. Junto al logo de MatriClick van el de la institución
(`public/assets/institucion-logo.jpeg`, 180 px, en círculo blanco) y el del SENA
(`public/assets/sena-logo.png`, fondo negro quitado). **Sin borde superior** (`border-t` quitado a
propósito: se veía como una línea separando secciones). Solo enlaza a rutas/anclas que existen — no
hay iconos sociales porque no hay cuentas sociales. `/terminos` (`app/(marketing)/terminos`) es un
**borrador genérico escrito por IA, sin revisión legal** (cita Ley 1581 de 2012).

Regla general: todo el copy debe corresponder a algo que **de verdad funciona hoy** en
`/dashboard` — antes de agregar contenido nuevo, verificar contra el código real, no inventar
features. La sección `Planes` es la única que menciona explícitamente cosas que no existen
todavía (columna "Pro"), y lo hace con un badge "Próximamente" a propósito — mantener esa
honestidad si se edita: nunca presentar algo de `ROADMAP.md` como si ya funcionara. El CTA final
ya no dice "Activar MatriClick Pro" (esa frase implicaba que Pro ya existía) — dice "Comienza
gratis" y apunta a `/registro`, coherente con que Pro está marcado "Próximamente" justo arriba.

Flujo de trabajo para pedirle diseños a Google Stitch: se genera un prompt describiendo el
sistema de tokens exacto (colores, tipografía, radios — copiarlos literales de
`app/globals.css`) más la regla de honestidad de arriba, Stitch devuelve HTML/Tailwind, y ese
HTML se **adapta** al código real (nunca se pega tal cual) — Stitch tiende a inventar copy,
límites o columnas de tabla que no corresponden al modelo de datos real (ej. propuso "Programa"
tipo universidad cuando este es un sistema de colegio con Grado/Grupo, e inventó límites como
"50 matrículas por semestre" que no existen). También suele agregar fotos de personas generadas
por IA (URLs `lh3.googleusercontent.com` con prompts de retrato) y frases de analítica
predictiva inventada (ej. "podrías necesitar abrir 1 grupo más") — nunca copiar ninguna de las
dos cosas. Revisar cada propuesta de Stitch contra el schema real antes de traerla al código.

Si en el futuro se vuelve a mostrar una vista previa del panel en la landing, reutilizar
**directamente** los componentes reales del dashboard
(`components/dashboard/{kpi-card,ai-insight-card,ocupacion-gauge,matriculas-table}.tsx`) con
datos de ejemplo con la misma forma que los tipos reales — nunca recrear una versión "aparte"
de un widget del dashboard para la landing (así la landing cambia sola cuando cambia el panel).

## Diseño / marca

Todo el sitio (landing, auth, dashboard) usa un **tema oscuro tipo Neuraxis**: fondo muy oscuro
(`--background #080d17`; el canvas del dashboard va un punto más claro, `#0a0f19`), superficies
`--card #151d2c` / `--popover #141b28` (subidas desde `#0d131f`/`#0b101c` para que el dashboard
no se sienta tan apagado), borde blanco al 10 %, texto slate (`#e8edf5` / `#a6b2c4`) y un azul
vivo `#2b66ff` como acento/CTA. El "ambiente" azul lo dan los `radial-gradient` de cada layout,
**no** el color base. La landing/auth conservan sus degradados sobre `#040711` (contexto propio). Reemplazó al viejo
"neon-glass" gris+azul-eléctrico (`#0c0f0f` / `#0066ff`) que venía de Google Stitch. Todos los
tokens viven en el bloque `.dark` de `app/globals.css`.

- Al cambiar la paleta hay que tocar, además del bloque `.dark`: las utilidades de
  `app/globals.css` (`glass-card`, `glass-modal`, `neon-button`, `bg-hero-glow` — tienen rgba
  hardcodeados), los colores de `LANDING_WAVE_LAYERS`/`AUTH_WAVE_LAYERS` (`wave-canvas.tsx`) y `.auth-wave`, el `radial-gradient` inline de
  `app/dashboard/layout.tsx`, y los `radial-gradient` / degradados `#040711` inline de
  `components/auth/{auth-shell,auth-flow,auth-visual}.tsx` (`app/(auth)/layout.tsx` ya no tiene
  fondo). Los `shadow-[...]`/`stroke` con azul
  hardcodeado en componentes se migran con sed sobre `--include=*.tsx` (última:
  `rgba(…)`→`rgba(43,102,255,…)`, `#…`→`#2b66ff`). Ojo: en `shadow-[…]` de Tailwind el rgba
  **no puede llevar espacios**. Quedan muchos `bg-white/5` · `border-white/10` sueltos —
  funcionan, pero pulirlos sería pasarlos a `border-white/[0.08]` como en Neuraxis.
- `components/landing/planes.tsx` ("Elige tu plan") está rehecho al estilo de tarjetas de
  Neuraxis: grid de 2, `rounded-[32px]`, Gratis = tarjeta destacada (gradiente
  `from-[#18346e]`, borde `blue-400/40`, glow `shadow-[0_0_50px_-12px_…]`, `md:-translate-y-1`
  y highlight superior), Pro = tarjeta plana `#0b101c/80` con la cinta diagonal "Próximamente".
  Checks en círculo azul (`bg-primary`) para Gratis, gris para Pro. El copy sigue la regla de
  honestidad (Pro = "Por definir" + "Próximamente", sin CTA activo).
- El `:root` (tema claro, índigo) sigue definido pero **no se usa** — base para un modo claro
  futuro.
- Tipografías: `Hanken Grotesk` (`--font-hanken-grotesk`) para texto general, `JetBrains Mono`
  (`--font-jetbrains-mono`, clase `.font-label-mono`) para labels/mono-data — ambas cargadas una
  sola vez en `app/layout.tsx` y aplicadas vía `style={{ fontFamily: ... }}` en cada layout con
  `dark`, no en `:root`/body global.
- Fondo de la landing: ver "Fondo de TODA la landing" arriba (canvas). El **`Navbar` es
  transparente** (`sticky top-0 z-50` y nada más), **no** `.glass-card`: el `backdrop-filter` de un
  header sticky sobre el fondo se re-desenfocaba cada frame de scroll y dejaba una línea divisoria.
- Logo: `components/brand/logo.tsx`, usa `public/assets/logo-icon.png` (recorte cuadrado del
  ícono, fondo blanco opaco — el intento de fondo transparente dejó "agujeros" en el papel
  blanco del propio diseño, así que se usa opaco dentro de una placa blanca redondeada). También
  existe `public/assets/logo-full.jpg` (lockup completo con texto, sin usar todavía — sirve para
  og:image o materiales de marca futuros). Favicon en `app/favicon.ico`, generado con PIL
  (⚠️ ImageMagick con `-define icon:auto-resize` genera un .ico que Next.js/Turbopack no puede
  procesar — "PNG is not in RGBA format"; regenerar siempre con PIL `Image.save(..., sizes=[...])`
  si hace falta tocarlo).
- Patrón CRUD (Sedes, Grados, Grupos, Periodos, Profesores, Acudientes, Estudiantes): comparten
  `CrudDialog` + `DeleteButton` (`components/dashboard/crud/`). Para cambiar el look de los
  modales/formularios de **todas** las pantallas de catálogo a la vez, edita esos dos archivos
  en vez de cada página.
- Paginación: las 8 tablas de listado (las de arriba + Matrículas) usan
  `components/dashboard/data-table.tsx` (`DataTable`, client component genérico con
  `header`/`renderRow`) — filas por página configurable (10/25/50), controles abajo a la derecha.
  Cada entidad tiene su propio wrapper cliente (`<entidad>-table.tsx`) que le pasa el render de
  fila; el `page.tsx` de cada pantalla sigue siendo Server Component y solo hace fetch + pasa la
  data cruda (no se puede pasar una función `renderRow` desde un Server Component directo a
  `DataTable`, por eso existe la capa intermedia de wrappers cliente).

## Cuentas de prueba

- Admin: `admin@matriclick.test` / `AdminMatri2024!` (creada a mano vía Supabase Admin API,
  rol `admin`).
- `profesor.prueba@matriclick.test` / `ProfesorTest2026!` (rol `profesor`, vinculada a un
  registro "Test Profesor" documento `3003334444`) — creada durante pruebas de control de acceso
  por rol, sigue viva.
- Cuenta de acudiente vinculada a un estudiante "Test Estudiante" (documento `3002223333`),
  registrada por autoregistro público — creada durante las mismas pruebas.
- Cualquier otra cuenta usada para probar RLS/roles que no aparezca aquí se creó y se borró en la
  misma sesión.

## Restricciones operativas de este entorno

- El clasificador de seguridad del harness **bloquea escribir contraseñas en formularios de
  login/registro en el navegador**, incluso cuentas de prueba propias. Para verificar
  auth/RLS hay que usar la API REST/Auth de Supabase directamente con `curl` (login vía
  `POST /auth/v1/token?grant_type=password`, crear usuarios vía
  `POST /auth/v1/admin/users` con la service role key, luego usar el `access_token` como Bearer
  para probar políticas RLS), no automatizar el formulario con el navegador. Tampoco hay forma
  de iniciar sesión con Chrome-in-the-loop para verificar visualmente cambios del dashboard —
  hay que pedirle al usuario que confirme visualmente con su propia sesión.
- **Confirmación de email desactivada temporalmente** (Supabase → Authentication → Sign In /
  Providers → Email → "Confirm email" está apagado desde el 2026-08-11) porque el servicio de
  correo compartido por defecto de Supabase tiene un límite muy bajo de envíos/hora y bloqueaba
  las pruebas de `/registro` con `email rate limit exceeded`. **Antes de producción real hay que
  reactivarlo y configurar un SMTP propio** (Resend/SendGrid/Postmark) — detalle completo en
  `ROADMAP.md`. Sin esto cualquiera puede registrarse con un correo ajeno sin verificarlo.
- **No activar el toggle de Captcha en Supabase** (Authentication → Attack Protection) sin haber
  integrado antes el widget de hCaptcha/Turnstile en `/login` y `/registro` y sin tener el
  `Captcha secret` configurado — se probó por accidente el 2026-08-11 y de haberse guardado así
  habría roto login y registro en producción (Supabase empieza a exigir un `captcha_token` que
  el frontend nunca envía). Quedó desactivado; ver `ROADMAP.md` para implementarlo bien.
- **"Prevent use of leaked passwords"** (misma pantalla de Attack Protection) está bloqueado en
  el plan Free de Supabase — el dashboard lo marca "Only available on Pro plan and above". No
  perder tiempo intentando activarlo sin upgrade.
- **`supabase/migrations/0006_endurecer_permisos_funciones.sql`** ya se corrió en producción
  (2026-08-11) — revoca `EXECUTE` de `public`/`anon` sobre las funciones `SECURITY DEFINER`.
  Si se crea una función `SECURITY DEFINER` nueva, replicar el mismo patrón (revocar de
  `public`, otorgar solo a `authenticated` si la usa alguna política RLS) para no reabrir el
  mismo aviso en el Security Advisor de Supabase.
- Las claves de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`) viven en `.env.local` (gitignored) y están replicadas en Vercel
  (production/preview/development). Proyecto Supabase: `xblgtgyawnljqoszpjnf`. Si se abre este
  repo en otra máquina, hay que volver a crear `.env.local` con esos valores (pedirlos al
  usuario, no están en este archivo). No hay cadena de conexión directa a Postgres disponible en
  el entorno — solo API REST/Auth, así que cambios de DDL (funciones, grants, políticas) se
  redactan como migración en `supabase/migrations/` pero el usuario los aplica a mano en el SQL
  Editor del dashboard de Supabase.

## Verificación antes de dar por terminado un cambio

`npx tsc --noEmit && npx eslint . && rm -rf .next && npx next build` — los tres deben quedar
limpios. Para probar visualmente el dashboard (requiere sesión), usar la cuenta admin de arriba
y pedirle al usuario que la pruebe él mismo si el navegador bloquea el login automatizado.
