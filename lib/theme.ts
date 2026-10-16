export const THEME_STORAGE_KEY = "matriclick-theme"
export type Theme = "light" | "dark"

/**
 * Las pantallas de auth (`/login`, `/registro`, `/recuperar`,
 * `/actualizar-password`) siguen forzadas a oscuro — son de viewport fijo,
 * con el panel de imagen/ondas pensado solo para ese fondo (ver
 * CLAUDE.md "Pantallas de auth"). El resto del sitio (landing y
 * `/dashboard/**`) sí responde a la preferencia guardada.
 */
const FORCED_DARK_PATHS = ["/login", "/registro", "/recuperar", "/actualizar-password"]

function esRutaForzadaOscura(pathname: string): boolean {
  return FORCED_DARK_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

export function applyTheme(pathname: string): Theme {
  const theme: Theme = esRutaForzadaOscura(pathname) ? "dark" : getStoredTheme()
  document.documentElement.classList.toggle("dark", theme === "dark")
  return theme
}

/**
 * Script crudo (sin build) inyectado en `<head>` por `app/layout.tsx` para
 * fijar `dark` en `<html>` ANTES del primer paint — evita el flash de
 * contenido oscuro-a-claro al cargar con el tema claro guardado.
 * `ThemeManager` hace lo mismo pero para navegación client-side (donde no
 * hay full reload, así que este script no vuelve a correr).
 */
export const NO_FLASH_THEME_SCRIPT = `(function(){try{var p=location.pathname;var forced=["/login","/registro","/recuperar","/actualizar-password"].some(function(x){return p===x||p.indexOf(x+"/")===0});var dark=true;if(!forced){dark=localStorage.getItem("${THEME_STORAGE_KEY}")!=="light";}var c=document.documentElement.classList;if(dark){c.add("dark")}else{c.remove("dark")}}catch(e){}})();`
