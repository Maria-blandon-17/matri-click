# Roadmap

Notas de producto y seguridad que fueron surgiendo en conversación. Todo lo marcado ✅ ya está
implementado y verificado (`tsc` + `eslint` + `next build` limpios); lo marcado ⏳ requiere una
acción externa al código (pago, cuenta de terceros) y queda bloqueado hasta que se resuelva
afuera; lo marcado 💡 es aspiracional a futuro, sin fecha.

## Errores de "Eliminar" no llegaban al usuario (✅ resuelto)

Al intentar borrar un profesor que dirige un grupo (o cualquier registro referenciado por otra
tabla — un grado con grupos, un estudiante con matrículas, etc.), en producción aparecía un
"Minified React error #441" sin sentido en vez del motivo real. Causa raíz: las 8 funciones
`eliminarX` (`lib/actions/{grados,sedes,grupos,periodos,profesores,acudientes,estudiantes,
matriculas}.ts`) usaban `throw new Error(error.message)` dentro de una Server Action — Next.js
**redacta el mensaje de cualquier error que se lance (`throw`) desde una Server Action en
producción**, por seguridad (para no filtrar detalles internos por accidente), y lo reemplaza por
ese mensaje genérico con un "digest". En local (`next dev`) nunca se notaba porque ahí sí se ve
el mensaje completo — el bug solo existía en producción.

Arreglo: cambiar el patrón de "lanzar" a "retornar" el error, igual que ya hacían
`crearX`/`actualizarX` (`return { message: error.message }`) desde el principio — un valor de
retorno normal nunca se redacta, solo las excepciones. `DeleteButton`
(`components/dashboard/crud/delete-button.tsx`) ahora espera `Promise<DeleteResult>`
(`{ error?: string } | undefined`) en vez de confiar en un `catch`. Mismo arreglo aplicado a
`aceptarCuenta`/`rechazarCuenta`/`descartarCuenta` (`lib/actions/cuentas-pendientes.ts`), que
tenían el mismo problema.

De paso, `mensajeErrorEliminar()` (`lib/actions/types.ts`) traduce el código `23503`
(foreign_key_violation) de Postgres a un mensaje en español que nombra qué lo está bloqueando
("No se puede eliminar: todavía hay grupos que dependen de esto..."), en vez de mostrar el
mensaje técnico de Postgres tal cual.

También se corrigió el contraste del botón "Eliminar" del diálogo de confirmación: usaba
`bg-destructive` (`#ffb4ab`, un salmón claro pensado como *color de texto* sobre fondo oscuro,
no como relleno de botón — así lo usa correctamente `EstadoMatriculaBadge` en "Cancelada") con
texto blanco encima, ilegible. Ahora usa `bg-red-600`/`hover:bg-red-500` con texto blanco.

## Autoregistro con profesor + "Cuentas pendientes" (✅ resuelto)

Antes, solo admin y profesores se creaban a mano vía API, y el auto-vínculo por documento
dependía de que el admin ya hubiera creado la ficha académica con el documento **exacto** de
antemano (frágil: un dígito distinto y nunca vinculaba). Se dio vuelta el flujo:

- `/registro` ahora tiene 3 opciones (Acudiente/Estudiante/**Profesor**) — `lib/validations/auth.ts`,
  `lib/actions/auth.ts`. El registro público de profesor es intencional: la ficha de `profesores`
  no exige datos que el formulario de registro no pida (a diferencia de acudiente/estudiante), así
  que no hace falta nada provisional para ese rol.
- `perfiles` gana columna `documento` (migración `0008_cuentas_pendientes.sql`) — se guarda
  siempre al registrarse, haya o no coincidencia con una ficha existente. Sin esto, un documento
  sin match se perdía para siempre.
- Pantalla nueva **`/dashboard/administracion/cuentas-pendientes`** (admin) + badge ámbar en el
  sidebar (mecanismo genérico `badges: Record<href, count>` en `sidebar.tsx`, ya no específico a
  matrículas). Junta acudiente/profesor/estudiante sin ficha en una sola lista
  (`lib/actions/cuentas-pendientes.ts`).
- Tres acciones por fila: **Aceptar** (crea la ficha con nombre/documento/correo ya conocidos;
  para acudiente/estudiante, los campos obligatorios que el registro no pregunta —tipo de
  documento, parentesco, fecha de nacimiento, género— quedan con un valor provisional para que la
  persona los corrija ella misma después), **Rechazar** (marca `perfiles.rechazado = true`, la
  cuenta sigue existiendo pero desaparece de la lista y nunca se le crea ficha), **Descartar**
  (borra la cuenta por completo — perfil + usuario de auth).
- **"Mi perfil" ahora permite autoedición** de la ficha vinculada (antes 100% solo lectura):
  `components/dashboard/cuenta/ficha-{profesor,acudiente,estudiante}-form.tsx` +
  `actualizarMiFicha{Profesor,Acudiente,Estudiante}` en `lib/actions/mi-perfil.ts`. El documento
  nunca es editable ahí — lo protege un trigger de Postgres
  (`bloquear_campos_protegidos_{profesor,acudiente,estudiante}`, migración `0008`) que rechaza el
  cambio de documento/estado/id salvo que `rol_actual() = 'admin'`. Necesario porque RLS solo
  filtra filas, no columnas, y admin usa el mismo rol de Postgres `authenticated` que todos los
  demás — la única forma de dejar "documento intocable salvo por admin" es a nivel de trigger, no
  de GRANT de columna (un `REVOKE`/`GRANT` de columna afectaría a admin también, porque
  Postgres no distingue nuestro `rol` de aplicación).
- Migración `0008` sin aplicar todavía en producción — correrla en el SQL Editor de Supabase (esta
  sí puede ir completa en un solo `Run`, a diferencia de la `0007`/`0007b`, porque no agrega
  ningún valor de enum).

## Solicitud de matrícula por el acudiente (✅ resuelto)

Antes solo el admin podía crear matrículas. Ahora el acudiente también puede, desde
`/dashboard/matriculas/nueva` (mismo formulario, `NuevaMatriculaForm` con prop `modoSolicitud`),
pero queda en un estado nuevo `"Pendiente"` (agregado al enum `estado_matricula` en
`supabase/migrations/0007_solicitudes_matricula.sql`) hasta que un admin la aprueba o la rechaza
desde el mismo selector de estado que ya existía en `/dashboard/matriculas`
(`EstadoMatriculaSelect`).

- `lib/actions/matriculas.ts`: `crearSolicitudMatricula` (sin validar cupo al crear — el cupo se
  valida recién al aprobar, dentro de `actualizarEstadoMatricula`, para no bloquear a un acudiente
  solo porque otro llegó primero). `getMatriculasPendientesCount()` alimenta un badge ámbar en el
  sidebar/topbar visible solo para admin.
- RLS nueva: `grupos_select_acudiente` (el acudiente necesita ver el catálogo de grupos para
  elegir uno) y `matriculas_insert_acudiente` (solo puede insertar en estado `"Pendiente"` — no
  puede auto-aprobarse).
- **Actualización (2026-10-15, decisión explícita del usuario):** al principio
  `matriculas_insert_acudiente` y `estudiantes_select_acudiente` restringían todo a "su(s) propio(s)
  estudiante(s)" (`id_acudiente` del estudiante = el suyo). Se amplió a propósito en
  `supabase/migrations/0012_matricula_acudiente_cualquier_estudiante.sql`: el selector de
  "Solicitar matrícula" debía mostrar y permitir elegir **cualquier** estudiante registrado en la
  plataforma, con buscador — no solo los vinculados a esa cuenta. El admin sigue siendo quien
  aprueba/rechaza cada solicitud, así que nadie queda matriculado automáticamente. Efecto
  colateral documentado en `CLAUDE.md`: como RLS es por fila y no por pantalla, el acudiente
  también ve ahora el listado completo de `/dashboard/estudiantes`, no solo su(s) hijo(s).
- **Seguimiento (mismo día):** con el cambio de arriba, `/dashboard/inicio` del acudiente (que
  antes listaba sus estudiantes vinculados por `getEstudiantes()`) habría empezado a mostrar
  **todos** los estudiantes de la plataforma — `getEstudiantes()` ya no filtra nada por su cuenta
  propia, porque la política de SELECT se amplió. Se agregó
  `getEstudiantesDeAcudiente(idAcudiente)` (`lib/actions/estudiantes.ts`) con un `.eq("id_acudiente",
  …)` explícito en la query (un filtro de aplicación no depende de qué tan ancho sea RLS) para
  volver a acotar esa pantalla a "sus" estudiantes — pero ahora unida con las matrículas que él
  mismo solicitó (vía la columna nueva `id_acudiente_solicitante`, migración `0013`), para que un
  estudiante que registró sin estar formalmente vinculado también aparezca. Ver
  `components/dashboard/inicio-personal.tsx` (`construirRegistros`) y
  `supabase/migrations/0013_solicitante_matricula.sql`. De paso se corrigió un bug: "Solicitada
  por" en `/dashboard/matriculas` (`matriculas-registro-table.tsx`) asumía que el solicitante
  era siempre el acudiente vinculado al estudiante — ya no es cierto, ahora usa la columna nueva.
- **Validación de identidad al aprobar (2026-10-15, decisión explícita del usuario):** si el
  estudiante de la solicitud YA tiene un acudiente vinculado distinto de quien la pidió,
  `actualizarEstadoMatricula` **bloquea** el cambio a `"Activa"` con un mensaje explícito — el
  admin tiene que resolver el conflicto a mano desde Estudiantes/Acudientes antes de poder
  aprobar. Si el estudiante no tiene acudiente todavía, o si ya es el mismo que solicitó, no hay
  bloqueo (y, a propósito, aprobar tampoco vincula automáticamente — eso sigue siendo una acción
  manual aparte). El estado de ese vínculo se ve de antemano en un badge
  (`components/dashboard/matriculas/vinculo-solicitud-badge.tsx`, usado en
  `matriculas-registro-table.tsx` y `atencion-panel.tsx`): "Sin acudiente asignado" / "Es su
  acudiente registrado" / "Vinculado a otro acudiente" (este último es el que bloquea). La lógica
  de comparación vive en `lib/matriculas-vinculo.ts` — **no** en `lib/actions/matriculas.ts`,
  porque ese archivo lleva `"use server"` y Next.js exige que todo lo que exporte sea una función
  async (Server Action); una función síncrona ahí rompe el build.
- **Motivo opcional al rechazar/cancelar (mismo día, misma decisión):** `EstadoMatriculaSelect`
  abre un diálogo (`components/ui/dialog.tsx`) con un `Textarea` opcional cuando el admin elige
  `"Rechazada"` o `"Cancelada"` — para cualquier otro estado se aplica directo, sin diálogo. Se
  guarda en `matriculas.motivo_estado` (migración `0014_motivo_estado_matricula.sql`, columna
  aparte de `observaciones` para no mezclar la nota de la solicitud original con el motivo del
  rechazo) y se limpia solo si el estado vuelve a cambiar a otra cosa. Visible para el admin
  (`matriculas-registro-table.tsx`, debajo del selector de estado) y para el acudiente
  (`inicio-personal.tsx`, dentro de la tarjeta de su estudiante).
- Notificación elegida: **badge en el dashboard**, no correo — evita depender del SMTP propio que
  sigue pendiente más abajo en este archivo.
- Migración en dos archivos por una limitación de Postgres (`unsafe use of new value... New
  enum values must be committed before they can be used`): `ALTER TYPE ... ADD VALUE` no puede
  usarse en la misma transacción en la que se agrega. Correr en el SQL Editor de Supabase
  **`0007_solicitudes_matricula.sql` primero, esperar a que confirme, y solo después**
  `0007b_solicitudes_matricula_policies.sql` (no pegar los dos juntos en un mismo "Run").

## Paginación en tablas de catálogo (✅ resuelto)

Las 8 tablas de listado (Sedes, Grados, Grupos, Periodos, Profesores, Acudientes, Estudiantes,
Matrículas) no tenían paginación — mostraban todas las filas siempre. Se agregó
`components/dashboard/data-table.tsx` (`DataTable`, client component genérico) con selector de
filas por página (10/25/50, empieza en 10) y controles ◀ ▶ abajo a la derecha. Cada tabla ahora
vive en su propio componente cliente (`grados-table.tsx`, `estudiantes-table.tsx`, etc.) que le
pasa a `DataTable` el header y una función `renderRow` — la paginación es del lado del cliente
(se trae toda la data del servidor como siempre, se pagina en memoria), suficiente para el volumen
de datos de un colegio; si esto crece mucho, migrar a paginación real con `.range()` en Supabase.

**Primera idea (descartada):** una tabla aparte "Matrículas pendientes" debajo del registro
normal. Se descartó por duplicar información — en vez de eso, las filas con
`estado_matricula: "Pendiente"` se resaltan dentro del mismo registro (borde ámbar a la
izquierda, ícono de reloj junto al nombre, y "Solicitada por [acudiente]" bajo el código) — ver
`components/dashboard/matriculas/matriculas-registro-table.tsx`.

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
- **Recuperación de contraseña — falta config de Supabase para que llegue el correo**: el flujo
  ya está implementado en código (2026-09-10): `/recuperar` (pide correo →
  `solicitarRecuperacion` → `resetPasswordForEmail`), `/auth/callback/route.ts` (canjea `code` o
  `token_hash` y crea la sesión), `/actualizar-password` (server-guard por sesión +
  `actualizarPassword` → `updateUser`). Link "¿Olvidaste tu contraseña?" en `/login`. Para que
  funcione end-to-end en Supabase:
  1. **Authentication → URL Configuration → Redirect URLs**: agregar `http://localhost:3000/**` y
     `https://matri-click.vercel.app/**` (sin esto Supabase ignora el `redirectTo` y el enlace
     del correo no vuelve a la app).
  2. **SMTP propio** (mismo pendiente que "Confirmación de email" de arriba) — con el correo
     compartido de Supabase el envío del enlace de recuperación choca con el mismo rate limit.
  3. Opcional (recomendado para que el enlace sirva desde otro dispositivo): personalizar la
     plantilla **Reset Password** para usar
     `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&next=/actualizar-password`.
     El callback ya soporta ese formato; sin personalizar, usa el flujo PKCE `?code=` que solo
     funciona en el mismo navegador que pidió el reset.
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

## Términos y condiciones (✅ implementado, ⏳ 2 pendientes)

`/terminos` + checkbox obligatorio en `/registro` + columnas `perfiles.terminos_aceptados_at` /
`terminos_version` (migración `0011_aceptacion_terminos.sql`). Pendientes:
- **Aplicar la migración 0011** en el SQL Editor de Supabase (hasta entonces la aceptación no se
  guarda; el registro igual funciona).
- **Revisión legal del texto** de `/terminos` (es un borrador genérico) y, si el usuario puede
  editar su propio `perfiles` por RLS, proteger esas dos columnas con un trigger (mismo patrón que
  `documento`) para que la prueba de aceptación no sea manipulable.
