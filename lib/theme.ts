export const THEME_STORAGE_KEY = "matriclick-theme"
export type Theme = "light" | "dark"

/**
 * El modo claro/oscuro solo aplica a `/dashboard/**` (el resto del sitio
 * — landing, auth — sigue forzado a oscuro, es parte del diseño). Por
 * eso la preferencia guardada solo se lee/aplica cuando la ruta actual
 * empieza por `/dashboard`.
 */
export function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

export function applyTheme(pathname: string): Theme {
  const isDashboard = pathname.startsWith("/dashboard")
  const theme: Theme = isDashboard ? getStoredTheme() : "dark"
  document.documentElement.classList.toggle("dark", theme === "dark")
  return theme
}

/**
 * Script crudo (sin build) inyectado en `<head>` por `app/layout.tsx` para
 * fijar `dark` en `<html>` ANTES del primer paint — evita el flash de
 * contenido oscuro-a-claro al cargar `/dashboard` con el tema claro
 * guardado. `ThemeManager` hace lo mismo pero para navegación client-side
 * (donde no hay full reload, así que este script no vuelve a correr).
 */
export const NO_FLASH_THEME_SCRIPT = `(function(){try{var p=location.pathname;var isDash=p.indexOf("/dashboard")===0;var dark=true;if(isDash){dark=localStorage.getItem("${THEME_STORAGE_KEY}")!=="light";}var c=document.documentElement.classList;if(dark){c.add("dark")}else{c.remove("dark")}}catch(e){}})();`
