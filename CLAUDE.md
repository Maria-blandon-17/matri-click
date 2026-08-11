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

## Modelo de datos y roles

Tablas: `sedes, grados, grupos, periodos_academicos, profesores, acudientes, estudiantes,
matriculas, perfiles`. `perfiles` vincula `auth.users` con un `rol` (`admin | profesor |
acudiente | estudiante`) y opcionalmente con `id_profesor`/`id_acudiente`/`id_estudiante`.

- Registro público (`/registro`) solo permite rol `acudiente` o `estudiante`. Admin y profesores
  se crean a mano vía Supabase Admin API (no hay UI para esto todavía — ver
  `ROADMAP.md`).
- **Vinculación automática por documento (bug ya corregido):** al registrarse, se busca el
  documento ingresado en `estudiantes`/`acudientes` para conectar la cuenta nueva con el registro
  existente. Esta búsqueda vivía originalmente en `lib/actions/auth.ts` usando el cliente
  normal (con RLS) — **nunca funcionaba para nadie**, porque no existe ninguna política RLS que
  permita a una cuenta recién creada (aún sin vincular) leer `acudientes`/`estudiantes` — problema
  de huevo y gallina. Se corrigió usando `createAdminClient()` (service role) solo para esa
  búsqueda puntual y el update del propio perfil recién creado. Si se toca ese flujo de nuevo,
  no volver a cambiarlo al cliente con RLS.
- **Vinculación manual desde el dashboard:** además del autoregistro, el admin puede vincular una
  cuenta ya registrada (pero sin vincular) directamente desde las pantallas de
  `Estudiantes`/`Administración → Acudientes`/`Administración → Profesores` — columna "Cuenta"
  (`components/dashboard/cuenta-vinculo-cell.tsx`, acciones en `lib/actions/cuentas.ts`). Sirve
  para el caso en que alguien se registró antes de que el admin creara su registro académico.
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

Secciones, en orden: `Hero` → `DashboardPreview` → `Modules` (`#modules`, "Los módulos que ya
puedes usar hoy": Estudiantes, Matrículas, Académico, Administración) → `HowItWorks`
(`#how-it-works`) → `Planes` (`#planes`, comparación Gratis/Pro) → `Cta`. Se eliminó
`Features` (duplicaba literalmente 2 de sus 3 tarjetas con `Modules`) — si se necesita un
diferenciador que no sea "módulo", agregarlo como copy dentro de `Modules`/`Planes`, no revivir
una sección `Features` aparte.

Regla general: todo el copy debe corresponder a algo que **de verdad funciona hoy** en
`/dashboard` — antes de agregar contenido nuevo, verificar contra el código real, no inventar
features. La sección `Planes` es la única que menciona explícitamente cosas que no existen
todavía (columna "Pro"), y lo hace con un badge "Próximamente" a propósito — mantener esa
honestidad si se edita: nunca presentar algo de `ROADMAP.md` como si ya funcionara. El CTA final
ya no dice "Activar MatriClick Pro" (esa frase implicaba que Pro ya existía) — dice "Comienza
gratis" y apunta a `/registro`, coherente con que Pro está marcado "Próximamente" justo arriba.
Mismo principio en `Hero`: la tarjeta de ejemplo del panel usa lenguaje neutro ("Ocupación de
cupos: 82% este periodo" + badge "Vista previa"), nunca en segunda persona tipo "tus matrículas
aumentaron X%" — eso se leía como un resultado real y personal del visitante, cuando es un dato
de ejemplo fijo. Si se edita ese card, mantener el tono neutro/de ejemplo.

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

`components/landing/dashboard-preview.tsx` reutiliza **directamente** los componentes reales del
dashboard (`components/dashboard/{kpi-card,ai-insight-card,ocupacion-gauge,matriculas-table}.tsx`)
con datos de ejemplo con la misma forma que los tipos reales — no es un mockup aparte. Si el
diseño de esos componentes cambia, la landing cambia sola con ellos. Mantener este patrón: nunca
recrear una versión "aparte" de un widget del dashboard para la landing.

## Diseño / marca

Todo el sitio (landing, auth, dashboard) usa un tema oscuro "neon-glass" generado a partir de
diseños hechos en **Google Stitch** e implementados a mano en el código real (no hay Stitch
conectado al repo, fue un flujo manual de prompt → HTML de Stitch → traducción a componentes).

- Paleta y utilidades (`glass-card`, `glass-modal`, `neon-button`, `bg-hero-glow`,
  `bg-grid-pattern`, `font-label-mono`) están en `app/globals.css`, dentro del bloque `.dark`.
  El `:root` (tema claro, índigo) quedó definido pero **no se usa en ningún lado actualmente** —
  si se pide un modo claro/toggle de tema en el futuro, ahí ya hay una base.
- Tipografías: `Hanken Grotesk` (`--font-hanken-grotesk`) para texto general, `JetBrains Mono`
  (`--font-jetbrains-mono`, clase `.font-label-mono`) para labels/mono-data — ambas cargadas una
  sola vez en `app/layout.tsx` y aplicadas vía `style={{ fontFamily: ... }}` en cada layout con
  `dark`, no en `:root`/body global.
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
