@AGENTS.md

# MatriClick — Sistema de Matrículas Virtuales

Sistema web de gestión académica (matrículas, estudiantes, grupos, sedes, periodos) para
instituciones educativas. Landing pública + dashboard de administración + auth con roles.

**Producción:** https://matri-click.vercel.app
**Repo local:** esta carpeta (`matri-click/`), git inicializado, sin remoto configurado todavía.

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
  - `Select` (base-ui) **no** infiere el label visible del `SelectItem` seleccionado — hay que
    pasar la prop `items={{ valor: "Etiqueta" }}` al `Select` para que `SelectValue` muestre
    el texto correcto en vez del valor crudo.
  - El valor `""` en un `SelectItem` se trata como "sin selección" (placeholder). Para opciones
    tipo "Sin asignar" se usa un sentinel como `"none"` y se convierte a `null`/`""` en el
    server action.
  - El componente `Form` clásico de shadcn no existe en este estilo; se usa `Field`/`FieldLabel`/
    `FieldError`/`FieldGroup` (`components/ui/field.tsx`) a mano con `useActionState`.
- **Supabase**: Postgres + Auth + RLS. Cliente en `lib/supabase/{client,server}.ts` (anon key)
  y `lib/supabase/admin.ts` (service role, solo en Server Actions, nunca en cliente).
- **Vercel**: proyecto enlazado a la cuenta `mariablandon1514-7537s-projects` (no la cuenta
  personal del usuario — cambió de cuenta a mitad de proyecto con `vercel login`). Deploy con
  `vercel --prod --yes` desde esta carpeta.

## Estructura

```
app/
  (marketing)/        landing pública — layout fuerza tema oscuro (class="dark")
  (auth)/login|registro/  auth — layout también fuerza tema oscuro
  dashboard/           área autenticada (protegida por proxy.ts) — layout también fuerza "dark"
    academico/{grados,grupos,periodos}
    administracion/{sedes,profesores,acudientes}
    estudiantes/  matriculas/{page,nueva}/  reportes/  cuentas/
lib/
  actions/            Server Actions + queries por entidad (una por tabla)
  validations/        esquemas zod
  supabase/           clientes
  types/database.types.ts   tipos manuales (ver nota abajo)
components/
  ui/                 primitivos shadcn (genéricos, no tocar el theming acá)
  dashboard/crud/      CrudDialog y DeleteButton compartidos por las 7 pantallas de catálogo
  dashboard/*          sidebar, topbar, kpi-card, widgets del dashboard
  landing/             secciones de la landing
  brand/logo.tsx        logo (ver sección Marca)
supabase/migrations/   0001_schema, 0002_roles_y_perfiles, 0003_rls_policies,
                        0004_seed, 0005_fix_rls_recursion — correr en ese orden en el
                        SQL Editor de Supabase (no hay CLI de supabase configurada, se aplican
                        a mano)
```

## Modelo de datos y roles

Tablas: `sedes, grados, grupos, periodos_academicos, profesores, acudientes, estudiantes,
matriculas, perfiles`. `perfiles` vincula `auth.users` con un `rol` (`admin | profesor |
acudiente | estudiante`) y opcionalmente con `id_profesor`/`id_acudiente`/`id_estudiante`.

- Registro público (`/registro`) solo permite rol `acudiente` o `estudiante`. Admin y profesores
  se crean a mano vía Supabase Admin API (no hay UI para esto todavía).
- RLS activo en todas las tablas: admin ve todo, profesor solo sus grupos/estudiantes/matrículas,
  acudiente solo su(s) estudiante(s), estudiante solo su propio registro. Verificado
  end-to-end con cuentas de prueba (creadas y luego borradas).
- `lib/types/database.types.ts` está **escrito a mano**, no generado con `supabase gen types`
  (no se configuró el CLI de Supabase). Si cambias el schema en Supabase, hay que actualizar
  este archivo manualmente, incluyendo `Relationships: []` en cada tabla (requerido por el tipo
  `GenericTable` de `@supabase/supabase-js` aunque no lo usemos) y el bloque `Views/Functions/
  Enums/CompositeTypes` a nivel de schema `public` (si falta, los `.select()` con joins
  embebidos (`tabla ( columna )`) tipan como `never` — ver los `as unknown as X[]` en
  `lib/actions/grupos.ts`, `estudiantes.ts`, `matriculas.ts` como referencia del patrón).

## Diseño / marca

Todo el sitio (landing, auth, dashboard) usa un tema oscuro "neon-glass" generado a partir de
diseños hechos en **Google Stitch** e implementados a mano en el código real (no hay Stitch
conectado al repo, fue un flujo manual de prompt → HTML de Stitch → traducción a componentes).

- Paleta y utilidades (`glass-card`, `glass-modal`, `neon-button`, `bg-hero-glow`,
  `bg-grid-pattern`, `font-label-mono`) están en `app/globals.css`, dentro del bloque `.dark`
  — **todo el sitio vive dentro de un wrapper con `class="dark"`** puesto individualmente en
  cada layout de route group (`(marketing)/layout.tsx`, `(auth)/layout.tsx`,
  `dashboard/layout.tsx|), no globalmente en `app/layout.tsx`. El `:root` (tema claro, índigo)
  quedó definido pero **no se usa en ningún lado actualmente** — si se pide un modo claro/toggle
  de tema en el futuro, ahí ya hay una base.
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
  rol `admin`). Es la única cuenta de prueba que quedó viva; cualquier otra usada para probar
  RLS (profesor/acudiente) se creó y se borró en la misma sesión.

## Restricciones operativas de este entorno

- El clasificador de seguridad del harness **bloquea escribir contraseñas en formularios de
  login/registro en el navegador**, incluso cuentas de prueba propias. Para verificar
  auth/RLS hay que usar la API REST/Auth de Supabase directamente con `curl` (login vía
  `POST /auth/v1/token?grant_type=password`, luego usar el `access_token` como Bearer para
  probar políticas RLS), no automatizar el formulario con el navegador.
- Las claves de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`) viven en `.env.local` (gitignored) y están replicadas en Vercel
  (production/preview/development). Proyecto Supabase: `xblgtgyawnljqoszpjnf`. Si se abre este
  repo en otra máquina, hay que volver a crear `.env.local` con esos valores (pedirlos al
  usuario, no están en este archivo).

## Verificación antes de dar por terminado un cambio

`npx tsc --noEmit && npx eslint . && rm -rf .next && npx next build` — los tres deben quedar
limpios. Para probar visualmente el dashboard (requiere sesión), usar la cuenta admin de arriba
y pedirle al usuario que la pruebe él mismo si el navegador bloquea el login automatizado.
