/**
 * Fondo del hero de la landing — imagen estática a sangre completa
 * (public/assets/fondo.webp, generada en Recraft y recortada al arco;
 * fuente sin comprimir en public/assets/fondo1.png).
 *
 * Server Component. Todo el trabajo lo hace CSS (`.hero-aura*` en
 * app/globals.css): `background-image` con `cover` en un contenedor de
 * altura acotada, sin next/image, sin máscara, sin animación y sin
 * `filter: blur()` — a propósito, para que la landing no repinte por
 * frame. El único degradado es el de empalme inferior con --background.
 *
 * Va como primer hijo del contenedor de app/(marketing)/layout.tsx,
 * detrás del contenido (que vive en un wrapper con z-10) y también
 * detrás del Navbar (transparente), para que el top sea una sola
 * superficie continua.
 */
export function HeroBackground() {
  return (
    <div className="hero-aura" aria-hidden="true">
      <div className="hero-aura__fade" />
    </div>
  )
}
