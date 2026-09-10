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
  (auth)/login|registro/  auth — layout también fuerza tema oscuro
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
supabase/migrations/   0001_schema, 0002_roles_y_perfiles, 0003_rls_policies,
                        0004_seed, 0005_fix_rls_recursion, 0006_endurecer_permisos_funciones
                        — correr en ese orden en el SQL Editor de Supabase (no hay CLI de
                        supabase configurada, se aplican a mano)
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

## `/dashboard/inicio`: filtro por periodo, sin navegar de página

`app/dashboard/inicio/page.tsx` (admin/profesor) hace el fetch inicial en el servidor y le pasa
los datos a `components/dashboard/inicio-filtro-periodo.tsx` (client), que es quien realmente
renderiza los KPIs/gauge/tabla y posee el estado. Al cambiar el selector de periodo, **no** se
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

## Landing pública

Secciones, en orden: `Hero` → `Modules` (`#modules`, "Los módulos que ya
puedes usar hoy": Estudiantes, Matrículas, Académico, Administración) → `HowItWorks`
(`#how-it-works`) → `Planes` (`#planes`, comparación Gratis/Pro) → `Cta`. Se eliminó
`Features` (duplicaba literalmente 2 de sus 3 tarjetas con `Modules`) — si se necesita un
diferenciador que no sea "módulo", agregarlo como copy dentro de `Modules`/`Planes`, no revivir
una sección `Features` aparte. También se eliminó `DashboardPreview` ("Vista previa del panel"):
el `Hero` es ahora una sola columna centrada (badge + titular + subtítulo + 2 CTA) con fondo
`<HeroBackground>` (imagen a sangre completa, `.hero-aura*` en `globals.css`), sin la tarjeta
de ejemplo del panel.

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

Todo el sitio (landing, auth, dashboard) usa un **tema oscuro tipo Neuraxis**: fondo casi
negro con un punto de azul (`#040711`), superficies `#0d131f`/`#0b101c`, borde blanco al 8 %,
texto slate (`#e2e8f0` / `#94a3b8`) y un azul vivo `#2b66ff` como acento/CTA. El "ambiente"
azul lo dan los `radial-gradient` de cada layout, **no** el color base. Reemplazó al viejo
"neon-glass" gris+azul-eléctrico (`#0c0f0f` / `#0066ff`) que venía de Google Stitch. Todos los
tokens viven en el bloque `.dark` de `app/globals.css`.

- Al cambiar la paleta hay que tocar, además del bloque `.dark`: las utilidades de
  `app/globals.css` (`glass-card`, `glass-modal`, `neon-button`, `bg-hero-glow` — tienen rgba
  hardcodeados), el fallback de `.hero-aura`, y los `radial-gradient` inline de
  `app/dashboard/layout.tsx` y `app/(auth)/layout.tsx`. Los `shadow-[...]`/`stroke` con azul
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
- Fondo del hero de la landing: `<HeroBackground>` (`components/landing/hero-background.tsx`)
  es un `<div>` cuyo fondo lo pone `.hero-aura` en `app/globals.css` con
  `background: #040711 url(/assets/fondo.webp) center 70% / cover` a sangre completa. La imagen
  (horizonte oscuro + arco de luz azul) se generó en **Recraft** y se usa **tal cual** (solo
  PNG→WebP por peso): fuente sin comprimir en `public/assets/fondo1.png`, servida
  `public/assets/fondo.webp` (~45 KB). Claves:
  - **`cover` a ancho completo** — nunca deja franjas a los lados. En desktop la imagen queda
    más alta que el contenedor, así que `background-position-y` (hoy `70%`) ajusta a qué altura
    cae el arco; en móvil (`@media (max-width: 640px)`) no hay holgura vertical, manda `height`.
    Si se cambia la imagen hay que re-tunear `height` + `background-position` mirando el
    resultado en desktop y a 390 px.
  - **Sin animación, sin `filter: blur()`, sin `mask-image`, sin `next/image`** — todo eso se
    probó y hacía la landing lenta (repintados por frame). La imagen ya se funde a negro en
    sus bordes; solo hay un degradado inferior de empalme (`.hero-aura__fade`).
  - Si la imagen se ve borrosa es reescalado (1344 px de ancho estirados a la pantalla). El
    arreglo real es subir una versión con Upscale de Recraft (~2700-4000 px) y regenerar el
    webp; no toquetear CSS.
  - El **`Navbar` es transparente** (`sticky top-0 z-50` y nada más), **no** `.glass-card`: el
    `backdrop-filter` de un header sticky sobre la imagen se re-desenfocaba cada frame de
    scroll, y además dejaba una línea divisoria fea. Ahora el top es una sola superficie
    continua con el fondo del hero por detrás.
  - `app/(marketing)/layout.tsx` incluye un `<link rel="preload" as="image">` del webp (LCP).
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
