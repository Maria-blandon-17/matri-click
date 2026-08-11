# Roadmap

Notas de producto y seguridad que fueron surgiendo en conversación. Todo lo marcado ✅ ya está
implementado y verificado (`tsc` + `eslint` + `next build` limpios); lo marcado ⏳ requiere una
acción externa al código (pago, cuenta de terceros) y queda bloqueado hasta que se resuelva
afuera; lo marcado 💡 es aspiracional a futuro, sin fecha.

## Filtro por periodo en Inicio (✅ resuelto)

`/dashboard/inicio` (admin/profesor) tenía KPIs, ocupación y "Últimas matrículas" siempre
globales — nunca se filtraban por periodo académico, aunque `matriculas` sí tiene `id_periodo`.
Se agregó un selector de periodo (`components/dashboard/inicio-filtro-periodo.tsx`).

**Primera versión** (descartada): usaba `router.push` con query param `?periodo=`, lo que
disparaba una navegación de página completa — se sentía lento y apagaba/difuminaba toda la
pantalla mientras cargaba (visible el indicador "Rendering..." de Next.js). No era lo que se
buscaba.

**Versión actual**: `lib/actions/dashboard.ts` pasó de `import "server-only"` a `"use server"`
(Server Action) y expone `getInicioDashboardData(idPeriodo?)`, que el componente cliente llama
**directo** (sin navegar de página) dentro de un `useTransition`, actualizando solo el estado
local — mucho más rápido, sin recargar el layout completo. La animación vive en los datos
mismos, no en un overlay de toda la pantalla:
- `components/dashboard/animated-number.tsx` — nuevo, hace un "conteo" suave (easeOutCubic,
  `requestAnimationFrame`, sin librería) de cada número cuando cambia. Se usa en `KpiCard`,
  `OcupacionGauge` y `AiInsightCard`.
- El arco del gauge de ocupación transiciona su `stroke-dashoffset` con CSS
  (`transition-[stroke-dashoffset] duration-700`).
- La tabla de "Últimas matrículas" hace un fade-in corto (`animate-in fade-in`, de
  `tw-animate-css`, ya instalado) cada vez que cambian las filas.

Nota de schema: "Estudiantes" y "Grupos" no cambian con el filtro a propósito — esas tablas no
están ligadas a un periodo, solo `matriculas` lo está.

## Control de acceso por rol (✅ resuelto)

- `components/dashboard/sidebar.tsx` / `topbar.tsx` filtran menú y acciones por `perfil.rol`.
  Agrupación: Académico (admin+profesor) · Administración (admin-only, salvo Matrículas que se
  abre a todos) · Comunidad (Profesores/Acudientes admin-only, Estudiantes también a
  profesor/acudiente) · Sistema (admin-only en el nav, salvo "Mi perfil" vía el avatar).
- Todas las pantallas CRUD (`Estudiantes`, `Matrículas`, `Académico/*`, `Administración/*`)
  ocultan crear/editar/eliminar si `perfil.rol !== "admin"`.
- `app/dashboard/inicio/page.tsx` bifurca por rol: admin/profesor ven KPIs globales;
  acudiente/estudiante ven `InicioPersonal` (aviso de vinculación pendiente, o el estado de
  matrícula de su(s) estudiante(s)).
- **Protección a nivel de ruta** en `lib/supabase/middleware.ts`: navegar directo por URL a
  `/dashboard/administracion/*` o `/dashboard/reportes` sin ser admin redirige a
  `/dashboard/inicio` antes de renderizar (antes solo se ocultaban los botones en la UI).

## Vinculación de cuentas (✅ resuelto)

- Bug de raíz corregido: el autoregistro por documento nunca vinculaba a nadie porque la
  búsqueda usaba el cliente con RLS, y no hay política que permita a una cuenta sin vincular leer
  `acudientes`/`estudiantes`. Ahora usa `createAdminClient()` solo para esa búsqueda puntual
  (`lib/actions/auth.ts`).
- Vinculación manual desde el dashboard: columna "Cuenta" en `Estudiantes`/`Administración →
  Acudientes`/`Administración → Profesores` (`components/dashboard/cuenta-vinculo-cell.tsx`,
  `lib/actions/cuentas.ts`) — el admin conecta una cuenta ya registrada pero sin vincular.

## "Mi perfil" (✅ resuelto)

`/dashboard/cuentas` — nombre editable, correo de solo lectura, badge de rol, datos vinculados
según el rol, cambiar contraseña, aviso si la cuenta no está vinculada. Accesible desde el
dropdown del avatar ("Mi perfil" + "Cerrar sesión" juntos ahí; se quitó el logout suelto que
había en el sidebar).

## Selectores con buscador (✅ resuelto)

Los 9 selectores del proyecto migraron de `components/ui/select.tsx` a
`components/ui/combobox.tsx` (sobre `@base-ui/react/combobox`, sin librería nueva) — todos con
filtro de texto integrado.

## Seguridad de base de datos (✅ resuelto)

`supabase/migrations/0006_endurecer_permisos_funciones.sql` — corrida en producción el
2026-08-11. Revoca `EXECUTE` de `public`/`anon` sobre las 4 funciones `SECURITY DEFINER`
(`handle_new_user`, `rol_actual`, `perfil_actual`, `estudiante_ids_de_profesor`); las 3 últimas
mantienen `EXECUTE` para `authenticated` porque las usan las políticas RLS. Cierra 5 de los 9
avisos del Security Advisor de Supabase; los otros 3 ("Signed-In Users Can Execute" sobre esas
3 funciones) son esperados y no se pueden quitar sin romper RLS.

## Landing: sección "Planes" (✅ resuelto)

`components/landing/planes.tsx` (`#planes`) — comparación Gratis (disponible hoy, tarjeta
destacada/elevada) vs Pro (ribbon "Próximamente", botón deshabilitado, sin precio inventado).
Se quitó la sección `Features` por duplicar contenido con `Modules`. El CTA final ya no dice
"Activar MatriClick Pro" (implicaba que ya existía) — dice "Comienza gratis" y apunta a
`/registro`. Nav/footer actualizados: Módulos · Cómo funciona · Planes.

## Bloqueados por plan/cuenta externa (⏳ pendiente)

- **Confirmación de email**: desactivada temporalmente el 2026-08-11 (el servicio de correo
  compartido de Supabase golpeó su límite de envíos durante las pruebas). Antes de un
  lanzamiento real: configurar SMTP propio (Resend/SendGrid/Postmark, Project Settings → Auth →
  SMTP Settings) y reactivar "Confirm email" en Sign In / Providers → Email. Sin esto cualquiera
  se registra con un correo ajeno sin verificarlo.
- **"Prevent use of leaked passwords"** (Authentication → Attack Protection): confirmado en el
  dashboard — solo disponible en plan Pro. Activar al hacer upgrade.
- **Captcha (hCaptcha/Turnstile)**: se probó por error activarlo sin el `Captcha secret` ni el
  widget integrado en `/login`/`/registro` — ya quedó desactivado de nuevo (confirmado
  2026-08-11). Para implementarlo de verdad más adelante: cuenta en hCaptcha o Turnstile +
  widget en los formularios de auth + enviar el token en el `POST` de signUp/signIn. No
  reactivar el toggle en Supabase sin haber hecho antes esa parte del frontend.

## MatriClick Pro — tier pagado (💡 aspiracional, sin fecha)

La landing ahora tiene una sección real "Planes" (`components/landing/planes.tsx`, `#planes`)
que compara Gratis (disponible hoy) vs Pro (marcado "Próximamente", sin botón de acción — no se
puede activar todavía). El CTA final ya no promete Pro, apunta al registro gratuito. Candidatos
para cuando Pro se construya de verdad:

- **Reportes** (hoy `PlaceholderPage`): exportar a Excel/PDF, tendencias históricas,
  comparativas entre sedes/periodos, ocupación por grado. Ya hay toda la data transaccional real
  en Supabase para alimentarlo.
- **Analítica predictiva real**: proyección de cupos, alertas de deserción con un modelo de
  verdad (no el que se descartó del bento de `Features` por no tener backend).
- **Notificaciones automáticas** (email/WhatsApp) a acudientes sobre estado de matrícula.

### Límite del plan gratuito: 1 sede (⏳ solo copy, falta la lógica)

Decidido el eje de diferenciación Free/Pro: **número de sedes** (1 sede gratis, ilimitadas en
Pro) — no matrículas ni admins, porque un colegio de una sola sede es el usuario gratuito
natural, y una red multi-sede es quien realmente necesita pagar. Ya está reflejado en el copy de
`components/landing/planes.tsx`. **Falta implementar el límite de verdad**: hoy
`crearSede()` (`lib/actions/sedes.ts`) no valida nada — cualquier admin puede crear sedes
ilimitadas aunque la landing diga "1 sede" en el plan gratuito. Antes de que esta promesa sea
cierta hay que: 1) agregar un concepto de "plan" a la institución/cuenta (no existe hoy en el
schema), 2) validar en `crearSede()` que no se exceda el límite del plan activo.

## Landing: honestidad del Hero y DashboardPreview (✅ resuelto)

El card "AI Insights" del Hero decía "Tus matrículas activas han aumentado un 8% este mes" — un
dato hardcodeado en segunda persona que sonaba a un resultado personal real. Se reemplazó por
"Ocupación de cupos: 82% este periodo" (tercera persona/neutro) + una barra de progreso, y un
badge explícito "VISTA PREVIA" junto al de "AI Insights" (`components/landing/hero.tsx`).
`DashboardPreview.tsx` ganó un encabezado "VISTA PREVIA DEL PANEL" con acento, para que todo el
bloque de widgets quede enmarcado como ejemplo desde el principio. Diseño basado en un prompt de
Stitch, adaptado: se mantuvo el titular de marca ya establecido ("Precisión sin fricción...", el
mismo del footer) en vez del que propuso Stitch, y no se copiaron las columnas de tabla
inventadas por Stitch ("Programa", estilo universidad) — nuestro modelo real es colegio
(Grado/Grupo), y `dashboard-preview.tsx` ya las tenía correctas.

## Landing: `DashboardPreview` ahora es fiel a `/dashboard/inicio` (✅ resuelto)

La vista previa del panel en la landing era una maqueta genérica desconectada del producto real
(un gauge "Completado 58%"/"Actual-Meta" que no existe, un gráfico de tendencia semanal
inventado, tabla con solo 4 columnas). Se reconstruyó `components/landing/dashboard-preview.tsx`
para **reutilizar directamente los componentes reales** del dashboard —
`components/dashboard/{kpi-card,ai-insight-card,ocupacion-gauge,matriculas-table}.tsx` — con
datos de ejemplo con la misma forma que los tipos reales (`UltimaMatricula`, etc.). Así la
landing nunca puede desincronizarse visualmente del dashboard real: si el diseño de esos
componentes cambia, la vista previa cambia con ellos automáticamente. Unificaron también los
encabezados de sección (Vista previa del panel / Módulos / Cómo funciona / Planes) en un mismo
patrón: eyebrow gris pequeño + título blanco centrado + barra de acento azul + subtítulo.
