/**
 * Fondo de la landing.
 *
 * Server Component. Dos capas estáticas en z-0, detrás del contenido
 * (que vive en un wrapper con z-10) y detrás del Navbar (transparente):
 *
 *  1. `.hero-aura` — imagen a sangre completa (public/assets/fondo.webp,
 *     generada en Recraft y recortada al arco; fuente sin comprimir en
 *     public/assets/fondo1.png). Solo cubre el hero (altura acotada).
 *  2. `.landing-ambient` — ambiente cobalto suave para el resto de la
 *     página (Módulos, Cómo funciona, Planes, CTA), arranca por debajo
 *     del hero.
 *
 * Todo el trabajo lo hace CSS (`app/globals.css`): sin next/image, sin
 * máscara, sin `mix-blend-mode`, sin animación y sin `filter: blur()`
 * — a propósito, para que la landing no repinte por frame al hacer
 * scroll. Los únicos degradados son el de empalme inferior del hero con
 * --background y los tres radiales de baja opacidad del ambiente.
 *
 * Va como primer hijo del contenedor de app/(marketing)/layout.tsx.
 */
export function HeroBackground() {
  return (
    <>
      <div className="hero-aura" aria-hidden="true">
        <div className="hero-aura__fade" />
      </div>
      <div className="landing-ambient" aria-hidden="true" />
    </>
  )
}
