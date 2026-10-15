"use client"

import { useEffect, useRef } from "react"

type WaveLayer = {
  startY: number
  endY: number
  speed: number
  amplitude: number
  freq: number
  phase: number
  blur: number
  strokeWidth: number
  colors: { stop: number; color: string }[]
}

/**
 * Cintas de luz orgánicas, adaptadas de una referencia de Stitch pero
 * recoloreadas a la paleta de marca (azul #2b66ff / índigo / cian
 * sutil) en vez del morado original — mismo criterio que el resto de
 * las propuestas de Stitch: se adapta, no se pega tal cual.
 *
 * UN solo set para TODA la landing (hero + Módulos + Cómo funciona +
 * Planes + CTA + Footer), con la misma intensidad en todas partes —
 * antes eran dos sets (uno para el hero, otro más suave para el
 * cuerpo) en dos `<canvas>` separados, pero la costura entre ambos se
 * notaba como una línea donde terminaba uno y empezaba el otro (grilla
 * de puntos desalineada). Un solo `<canvas>` que cubre toda la página
 * (montado en app/(marketing)/layout.tsx) elimina esa costura y de
 * paso cubre el footer, que antes se quedaba sin ondas/puntos.
 *
 * `startY`/`endY` son fracciones (0–1) de la altura TOTAL de la
 * página, no de una sección — por eso estos valores quedan repartidos
 * parejo de arriba a abajo en vez de agrupados cerca de 0 o 1.
 *
 * Las primeras 5 capas son LA MISMA composición que tenía el hero
 * original (mismos colores/blur/amplitud) — solo reescalada para
 * caer en el primer ~16% de la página en vez del primer 900px — para
 * no perder ese look al unificar todo en un solo canvas.
 */
export const LANDING_WAVE_LAYERS: WaveLayer[] = [
  {
    startY: 0.133,
    endY: 0.09,
    speed: 0.0006,
    amplitude: 70,
    freq: 0.0016,
    phase: 0.2,
    blur: 55,
    strokeWidth: 150,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0.65)" },
      { stop: 0.45, color: "rgba(99, 102, 241, 0.55)" },
      { stop: 0.85, color: "rgba(56, 189, 248, 0.3)" },
      { stop: 1, color: "rgba(43, 102, 255, 0)" },
    ],
  },
  {
    startY: 0.115,
    endY: 0.101,
    speed: 0.0009,
    amplitude: 50,
    freq: 0.0022,
    phase: 1.8,
    blur: 38,
    strokeWidth: 90,
    colors: [
      { stop: 0, color: "rgba(79, 70, 229, 0.7)" },
      { stop: 0.5, color: "rgba(43, 102, 255, 0.6)" },
      { stop: 1, color: "rgba(56, 189, 248, 0)" },
    ],
  },
  {
    startY: 0.144,
    endY: 0.079,
    speed: 0.00075,
    amplitude: 75,
    freq: 0.0019,
    phase: 3.4,
    blur: 46,
    strokeWidth: 130,
    colors: [
      { stop: 0, color: "rgba(79, 70, 229, 0)" },
      { stop: 0.3, color: "rgba(43, 102, 255, 0.45)" },
      { stop: 0.7, color: "rgba(34, 211, 238, 0.7)" },
      { stop: 1, color: "rgba(103, 232, 249, 0.8)" },
    ],
  },
  {
    startY: 0.151,
    endY: 0.076,
    speed: 0.0011,
    amplitude: 42,
    freq: 0.0026,
    phase: 4.8,
    blur: 26,
    strokeWidth: 46,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0)" },
      { stop: 0.5, color: "rgba(34, 211, 238, 0.6)" },
      { stop: 1, color: "rgba(224, 247, 255, 0.8)" },
    ],
  },
  {
    startY: 0.162,
    endY: 0.144,
    speed: 0.00045,
    amplitude: 30,
    freq: 0.0014,
    phase: 1.2,
    blur: 65,
    strokeWidth: 200,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0.3)" },
      { stop: 0.5, color: "rgba(99, 102, 241, 0.25)" },
      { stop: 1, color: "rgba(4, 7, 17, 0)" },
    ],
  },
  {
    startY: 0.3,
    endY: 0.4,
    speed: 0.00075,
    amplitude: 65,
    freq: 0.0019,
    phase: 3.4,
    blur: 46,
    strokeWidth: 130,
    colors: [
      { stop: 0, color: "rgba(79, 70, 229, 0)" },
      { stop: 0.3, color: "rgba(43, 102, 255, 0.5)" },
      { stop: 0.7, color: "rgba(34, 211, 238, 0.55)" },
      { stop: 1, color: "rgba(103, 232, 249, 0.3)" },
    ],
  },
  {
    startY: 0.44,
    endY: 0.52,
    speed: 0.0011,
    amplitude: 42,
    freq: 0.0026,
    phase: 4.8,
    blur: 30,
    strokeWidth: 70,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0)" },
      { stop: 0.5, color: "rgba(34, 211, 238, 0.55)" },
      { stop: 1, color: "rgba(224, 247, 255, 0.35)" },
    ],
  },
  {
    startY: 0.58,
    endY: 0.68,
    speed: 0.00045,
    amplitude: 60,
    freq: 0.0014,
    phase: 1.2,
    blur: 48,
    strokeWidth: 140,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0.5)" },
      { stop: 0.5, color: "rgba(99, 102, 241, 0.45)" },
      { stop: 1, color: "rgba(43, 102, 255, 0)" },
    ],
  },
  {
    startY: 0.72,
    endY: 0.82,
    speed: 0.0008,
    amplitude: 55,
    freq: 0.0018,
    phase: 2.6,
    blur: 44,
    strokeWidth: 125,
    colors: [
      { stop: 0, color: "rgba(99, 102, 241, 0)" },
      { stop: 0.4, color: "rgba(43, 102, 255, 0.5)" },
      { stop: 0.8, color: "rgba(34, 211, 238, 0.5)" },
      { stop: 1, color: "rgba(103, 232, 249, 0.25)" },
    ],
  },
  {
    startY: 0.86,
    endY: 0.94,
    speed: 0.0006,
    amplitude: 50,
    freq: 0.0017,
    phase: 3.9,
    blur: 40,
    strokeWidth: 110,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0)" },
      { stop: 0.5, color: "rgba(99, 102, 241, 0.5)" },
      { stop: 1, color: "rgba(56, 189, 248, 0.3)" },
    ],
  },
  {
    startY: 0.94,
    endY: 1,
    speed: 0.00045,
    amplitude: 35,
    freq: 0.0012,
    phase: 5.2,
    blur: 55,
    strokeWidth: 170,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0.4)" },
      { stop: 0.5, color: "rgba(99, 102, 241, 0.4)" },
      { stop: 1, color: "rgba(43, 102, 255, 0.15)" },
    ],
  },
]

/**
 * Para el panel de login/registro (`AuthFlow`/`AuthVisual`) — ese panel
 * mide casi lo mismo que el hero (alto de viewport completo, sin
 * scroll), así que usa la composición ORIGINAL del hero (fracciones de
 * 0 a 1 relativas a ese panel, sin el reescalado que sufrieron en
 * `LANDING_WAVE_LAYERS` para caber en el primer ~16% de una página
 * mucho más alta).
 */
export const AUTH_WAVE_LAYERS: WaveLayer[] = [
  {
    startY: 0.74,
    endY: 0.5,
    speed: 0.0006,
    amplitude: 70,
    freq: 0.0016,
    phase: 0.2,
    blur: 55,
    strokeWidth: 150,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0.65)" },
      { stop: 0.45, color: "rgba(99, 102, 241, 0.55)" },
      { stop: 0.85, color: "rgba(56, 189, 248, 0.3)" },
      { stop: 1, color: "rgba(43, 102, 255, 0)" },
    ],
  },
  {
    startY: 0.64,
    endY: 0.56,
    speed: 0.0009,
    amplitude: 50,
    freq: 0.0022,
    phase: 1.8,
    blur: 38,
    strokeWidth: 90,
    colors: [
      { stop: 0, color: "rgba(79, 70, 229, 0.7)" },
      { stop: 0.5, color: "rgba(43, 102, 255, 0.6)" },
      { stop: 1, color: "rgba(56, 189, 248, 0)" },
    ],
  },
  {
    startY: 0.8,
    endY: 0.44,
    speed: 0.00075,
    amplitude: 75,
    freq: 0.0019,
    phase: 3.4,
    blur: 46,
    strokeWidth: 130,
    colors: [
      { stop: 0, color: "rgba(79, 70, 229, 0)" },
      { stop: 0.3, color: "rgba(43, 102, 255, 0.45)" },
      { stop: 0.7, color: "rgba(34, 211, 238, 0.7)" },
      { stop: 1, color: "rgba(103, 232, 249, 0.8)" },
    ],
  },
  {
    startY: 0.84,
    endY: 0.42,
    speed: 0.0011,
    amplitude: 42,
    freq: 0.0026,
    phase: 4.8,
    blur: 26,
    strokeWidth: 46,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0)" },
      { stop: 0.5, color: "rgba(34, 211, 238, 0.6)" },
      { stop: 1, color: "rgba(224, 247, 255, 0.8)" },
    ],
  },
  {
    startY: 0.9,
    endY: 0.8,
    speed: 0.00045,
    amplitude: 30,
    freq: 0.0014,
    phase: 1.2,
    blur: 65,
    strokeWidth: 200,
    colors: [
      { stop: 0, color: "rgba(43, 102, 255, 0.3)" },
      { stop: 0.5, color: "rgba(99, 102, 241, 0.25)" },
      { stop: 1, color: "rgba(4, 7, 17, 0)" },
    ],
  },
]

const GRID_SPACING = 28
const BASE_RADIUS = 1
const MAX_RADIUS = 3.6
const INTERACTION_RADIUS = 160
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS

/** Cintas con blur se redibujan a ~24fps — se mueven lento, no se nota, y le
 *  deja presupuesto de frame a la grilla de puntos (ver nota en el componente). */
const WAVE_REDRAW_INTERVAL_MS = 42
/** Suavizado del punto que sigue al cursor. Antes el blur de las cintas bajaba
 *  el fps real del loop y con eso el lerp (aunque el número era el mismo) se
 *  sentía como si la grilla "persiguiera" el cursor con rezago. Al separar el
 *  redibujo de las cintas del de los puntos, este valor ya alcanza casi
 *  instantáneo en frames reales a 60fps. */
const MOUSE_LERP = 0.35

/**
 * Cintas de luz animadas (+ opcionalmente grilla de puntos reactiva
 * al cursor) dibujadas en dos <canvas> apilados, acotados al tamaño
 * de su contenedor (lo mide con `getBoundingClientRect` del propio
 * canvas, así que sirve igual para el hero de 900px que para un
 * bloque de secciones mucho más alto):
 *
 *  - canvas de cintas: lo más caro de pintar (`filter: blur()`) se
 *    redibuja cada ~42ms (~24fps) porque las cintas se mueven lento y
 *    no se nota la diferencia.
 *  - canvas de puntos (opcional, `showDots`): sin blur, se redibuja
 *    en *cada* frame de `requestAnimationFrame` (~60fps), así que
 *    sigue al cursor sin rezago. Se usa tanto en el hero como en el
 *    cuerpo de la página (ambos con `showDots`) — queda opcional por
 *    si algún uso futuro no lo necesita.
 *
 * Pausa ambos loops cuando el contenedor sale de vista
 * (`IntersectionObserver`) o la pestaña está oculta, y respeta
 * `prefers-reduced-motion` (un solo frame estático, sin loop).
 */
export function WaveCanvas({
  layers,
  showDots = false,
}: {
  layers: WaveLayer[]
  showDots?: boolean
}) {
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const dotCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const waveCanvas = waveCanvasRef.current
    const waveCtx = waveCanvas?.getContext("2d")
    const dotCanvas = showDots ? dotCanvasRef.current : null
    const dotCtx = dotCanvas?.getContext("2d") ?? null
    if (!waveCanvas || !waveCtx) return
    if (showDots && (!dotCanvas || !dotCtx)) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let waveRaf = 0
    let dotRaf = 0
    let running = false
    let lastWaveDrawTime = 0

    const mouse = { x: -3000, y: -3000, targetX: -3000, targetY: -3000 }

    function resize() {
      const rect = waveCanvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const targets: [HTMLCanvasElement, CanvasRenderingContext2D][] = [[waveCanvas!, waveCtx!]]
      if (dotCanvas && dotCtx) targets.push([dotCanvas, dotCtx])
      for (const [canvas, ctx] of targets) {
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!dotCanvas) return
      const rect = dotCanvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    function onMouseLeave() {
      mouse.targetX = -3000
      mouse.targetY = -3000
    }

    function drawWaves(time: number) {
      waveCtx!.clearRect(0, 0, width, height)
      waveCtx!.save()
      waveCtx!.globalCompositeOperation = "screen"

      for (const wave of layers) {
        waveCtx!.beginPath()
        const startY = height * wave.startY
        const endY = height * wave.endY
        const step = 24

        waveCtx!.moveTo(-40, startY)
        for (let x = -40; x <= width + 40; x += step) {
          const progress = x / width
          const baseY = startY + (endY - startY) * progress
          const offset1 = Math.sin(x * wave.freq + time * wave.speed + wave.phase) * wave.amplitude
          const offset2 =
            Math.cos(x * (wave.freq * 0.7) - time * (wave.speed * 0.6) + wave.phase) *
            (wave.amplitude * 0.4)
          waveCtx!.lineTo(x, baseY + offset1 + offset2)
        }

        const gradient = waveCtx!.createLinearGradient(0, startY, width, endY)
        wave.colors.forEach((c) => gradient.addColorStop(c.stop, c.color))

        waveCtx!.strokeStyle = gradient
        waveCtx!.lineWidth = wave.strokeWidth
        waveCtx!.lineCap = "round"
        waveCtx!.lineJoin = "round"
        waveCtx!.filter = `blur(${wave.blur}px)`
        waveCtx!.stroke()
      }

      waveCtx!.restore()
    }

    function drawDotGrid() {
      if (!dotCtx) return
      dotCtx.clearRect(0, 0, width, height)
      const cols = Math.ceil(width / GRID_SPACING) + 1
      const rows = Math.ceil(height / GRID_SPACING) + 1

      for (let i = 0; i < cols; i++) {
        const x = i * GRID_SPACING
        for (let j = 0; j < rows; j++) {
          const y = j * GRID_SPACING
          const dx = x - mouse.x
          const dy = y - mouse.y
          const distSq = dx * dx + dy * dy

          let radius = BASE_RADIUS
          let alpha = 0.12

          if (distSq < INTERACTION_RADIUS_SQ) {
            const dist = Math.sqrt(distSq)
            const norm = 1 - dist / INTERACTION_RADIUS
            const ease = norm * norm * (3 - 2 * norm)
            radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * ease
            alpha = 0.12 + (0.65 - 0.12) * ease
          }

          dotCtx.beginPath()
          dotCtx.arc(x, y, radius, 0, Math.PI * 2)
          dotCtx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`
          dotCtx.fill()
        }
      }
    }

    function waveFrame(time: number) {
      if (!running) return
      if (time - lastWaveDrawTime >= WAVE_REDRAW_INTERVAL_MS) {
        lastWaveDrawTime = time
        drawWaves(time)
      }
      waveRaf = requestAnimationFrame(waveFrame)
    }

    function dotFrame() {
      if (!running) return
      mouse.x += (mouse.targetX - mouse.x) * MOUSE_LERP
      mouse.y += (mouse.targetY - mouse.y) * MOUSE_LERP
      drawDotGrid()
      dotRaf = requestAnimationFrame(dotFrame)
    }

    function start() {
      if (running || prefersReducedMotion) return
      running = true
      waveRaf = requestAnimationFrame(waveFrame)
      if (dotCtx) dotRaf = requestAnimationFrame(dotFrame)
    }

    function stop() {
      running = false
      cancelAnimationFrame(waveRaf)
      cancelAnimationFrame(dotRaf)
    }

    resize()
    if (prefersReducedMotion) {
      drawWaves(0)
      drawDotGrid()
    } else {
      start()
    }

    function onVisibilityChange() {
      if (document.hidden) stop()
      else start()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else stop()
      },
      { threshold: 0 }
    )
    io.observe(waveCanvas)

    window.addEventListener("resize", resize)
    if (dotCanvas) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseleave", onMouseLeave)
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener("resize", resize)
      if (dotCanvas) {
        window.removeEventListener("mousemove", onMouseMove)
        window.removeEventListener("mouseleave", onMouseLeave)
      }
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [layers, showDots])

  return (
    <>
      <canvas ref={waveCanvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {showDots && (
        <canvas ref={dotCanvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      )}
    </>
  )
}
