# Roadmap

Notas de producto y seguridad que fueron surgiendo en conversación. Todo lo marcado ✅ ya está
implementado y verificado (`tsc` + `eslint` + `next build` limpios); lo marcado ⏳ requiere una
acción externa al código (pago, cuenta de terceros) y queda bloqueado hasta que se resuelva
afuera; lo marcado 💡 es aspiracional a futuro, sin fecha.

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

El CTA final de la landing ("Activar MatriClick Pro") no tiene tier real detrás todavía — lleva
al mismo `/registro` gratuito, a propósito. Candidatos para cuando se construya:

- **Reportes** (hoy `PlaceholderPage`): exportar a Excel/PDF, tendencias históricas,
  comparativas entre sedes/periodos, ocupación por grado. Ya hay toda la data transaccional real
  en Supabase para alimentarlo.
- **Analítica predictiva real**: proyección de cupos, alertas de deserción con un modelo de
  verdad (no el que se descartó del bento de `Features` por no tener backend).
- **Límites de plan**: sedes/usuarios ilimitados en Pro, límite en el gratuito.
- **Notificaciones automáticas** (email/WhatsApp) a acudientes sobre estado de matrícula.
