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
const MAX_RADIUS = 3.6
const INTERACTION_RADIUS = 160
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS
const MOUSE_LERP = 0.35

/** Las cintas son puro blur: dibujarlas a baja resolución y que el CSS las escale no se
 *  nota, y el costo del blur es proporcional a los píxeles del lienzo. */
const WAVE_RES_DESKTOP = 0.35
const WAVE_RES_MOBILE = 0.22
const WAVE_INTERVAL_DESKTOP_MS = 42
const WAVE_INTERVAL_MOBILE_MS = 70

/** Grilla de puntos estática como fondo CSS (cero costo por frame). El canvas solo pinta
 *  los puntos resaltados alrededor del cursor, encima de esta grilla. */
const DOT_PATTERN_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at center, rgba(255, 255, 255, 0.12) 1px, transparent 1.6px)",
  backgroundSize: `${GRID_SPACING}px ${GRID_SPACING}px`,
  backgroundPosition: `-${GRID_SPACING / 2}px -${GRID_SPACING / 2}px`,
}

/**
 * Cintas de luz animadas + (opcional) grilla de puntos reactiva al cursor, del tamaño de su
 * contenedor (que debe ser `position: relative`). Pensado para correr bien en celular aunque
 * el contenedor sea toda la landing (~8000 px de alto en móvil):
 *
 *  - Cintas: un `<canvas>` a resolución reducida (0.35, o 0.22 en táctil) escalado por CSS.
 *    Antes era a devicePixelRatio ×2 sobre toda la página — lienzos de decenas de MB y blur
 *    sobre millones de píxeles cada 42 ms, lo que hacía la landing muy lenta en celular.
 *  - Puntos: la grilla base es un fondo CSS estático. Los resaltados del cursor van en un
 *    `<canvas>` `fixed` del tamaño del viewport que solo dibuja los ~130 puntos cercanos al
 *    cursor (recortado al rectángulo del contenedor). Solo se activa con puntero fino
 *    (mouse); en táctil no hay cursor y no corre nada.
 *  - Tamaño con `ResizeObserver` del contenedor, no `window.resize` — en celular la barra de
 *    direcciones dispara `resize` al hacer scroll y antes eso recreaba los lienzos enteros.
 *  - Pausa con `IntersectionObserver` / pestaña oculta; `prefers-reduced-motion` dibuja un
 *    solo frame estático.
 */
export function WaveCanvas({
  layers,
  showDots = false,
}: {
  layers: WaveLayer[]
  showDots?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const dotCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const waveCanvas = waveCanvasRef.current
    const waveCtx = waveCanvas?.getContext("2d")
    if (!container || !waveCanvas || !waveCtx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const waveRes = finePointer ? WAVE_RES_DESKTOP : WAVE_RES_MOBILE
    const waveInterval = finePointer ? WAVE_INTERVAL_DESKTOP_MS : WAVE_INTERVAL_MOBILE_MS

    const dotCanvas = showDots && finePointer && !reducedMotion ? dotCanvasRef.current : null
    const dotCtx = dotCanvas?.getContext("2d") ?? null

    let width = 0
    let height = 0
    let running = false
    let waveRaf = 0
    let dotRaf = 0
    let lastWaveDraw = -Infinity
    let lastTime = 0
    let dotsDirty = false

    const mouse = { x: -3000, y: -3000, targetX: -3000, targetY: -3000, inside: false }

    function drawWaves(time: number) {
      waveCtx!.setTransform(1, 0, 0, 1, 0, 0)
      waveCtx!.clearRect(0, 0, waveCanvas!.width, waveCanvas!.height)
      waveCtx!.setTransform(waveRes, 0, 0, waveRes, 0, 0)
      waveCtx!.globalCompositeOperation = "screen"

      for (const wave of layers) {
        const startY = height * wave.startY
        const endY = height * wave.endY
        waveCtx!.beginPath()
        waveCtx!.moveTo(-40, startY)
        for (let x = -40; x <= width + 40; x += 24) {
          const baseY = startY + (endY - startY) * (x / width)
          const o1 = Math.sin(x * wave.freq + time * wave.speed + wave.phase) * wave.amplitude
          const o2 =
            Math.cos(x * (wave.freq * 0.7) - time * (wave.speed * 0.6) + wave.phase) *
            (wave.amplitude * 0.4)
          waveCtx!.lineTo(x, baseY + o1 + o2)
        }
        const gradient = waveCtx!.createLinearGradient(0, startY, width, endY)
        for (const c of wave.colors) gradient.addColorStop(c.stop, c.color)
        waveCtx!.strokeStyle = gradient
        waveCtx!.lineWidth = wave.strokeWidth
        waveCtx!.lineCap = "round"
        waveCtx!.lineJoin = "round"
        // El blur de ctx.filter va en píxeles del lienzo (no lo escala el transform).
        waveCtx!.filter = `blur(${wave.blur * waveRes}px)`
        waveCtx!.stroke()
      }
      waveCtx!.filter = "none"
      waveCtx!.globalCompositeOperation = "source-over"
    }

    function resizeWaves() {
      const rect = container!.getBoundingClientRect()
      if (rect.width === width && rect.height === height) return
      width = rect.width
      height = rect.height
      waveCanvas!.width = Math.max(1, Math.ceil(width * waveRes))
      waveCanvas!.height = Math.max(1, Math.ceil(height * waveRes))
      drawWaves(lastTime)
    }

    function resizeDots() {
      if (!dotCanvas || !dotCtx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dotCanvas.width = Math.ceil(window.innerWidth * dpr)
      dotCanvas.height = Math.ceil(window.innerHeight * dpr)
      dotCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dotsDirty = true
    }

    function drawDots() {
      if (!dotCanvas || !dotCtx) return
      dotCtx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      if (!mouse.inside) return

      const rect = container!.getBoundingClientRect()
      dotCtx.save()
      dotCtx.beginPath()
      dotCtx.rect(rect.left, rect.top, rect.width, rect.height)
      dotCtx.clip()

      const iMin = Math.max(0, Math.floor((mouse.x - INTERACTION_RADIUS - rect.left) / GRID_SPACING))
      const iMax = Math.ceil((mouse.x + INTERACTION_RADIUS - rect.left) / GRID_SPACING)
      const jMin = Math.max(0, Math.floor((mouse.y - INTERACTION_RADIUS - rect.top) / GRID_SPACING))
      const jMax = Math.ceil((mouse.y + INTERACTION_RADIUS - rect.top) / GRID_SPACING)

      for (let i = iMin; i <= iMax; i++) {
        const x = rect.left + i * GRID_SPACING
        for (let j = jMin; j <= jMax; j++) {
          const y = rect.top + j * GRID_SPACING
          const dx = x - mouse.x
          const dy = y - mouse.y
          const distSq = dx * dx + dy * dy
          if (distSq >= INTERACTION_RADIUS_SQ) continue
          const norm = 1 - Math.sqrt(distSq) / INTERACTION_RADIUS
          const ease = norm * norm * (3 - 2 * norm)
          dotCtx.beginPath()
          dotCtx.arc(x, y, 1 + (MAX_RADIUS - 1) * ease, 0, Math.PI * 2)
          dotCtx.fillStyle = `rgba(255, 255, 255, ${(0.53 * ease).toFixed(3)})`
          dotCtx.fill()
        }
      }
      dotCtx.restore()
    }

    function waveFrame(time: number) {
      if (!running) return
      lastTime = time
      if (time - lastWaveDraw >= waveInterval) {
        lastWaveDraw = time
        drawWaves(time)
      }
      waveRaf = requestAnimationFrame(waveFrame)
    }

    function dotFrame() {
      if (!running) return
      const dx = mouse.targetX - mouse.x
      const dy = mouse.targetY - mouse.y
      if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3 || dotsDirty) {
        mouse.x += dx * MOUSE_LERP
        mouse.y += dy * MOUSE_LERP
        dotsDirty = false
        drawDots()
      }
      dotRaf = requestAnimationFrame(dotFrame)
    }

    function start() {
      if (running || reducedMotion) return
      running = true
      waveRaf = requestAnimationFrame(waveFrame)
      if (dotCtx) dotRaf = requestAnimationFrame(dotFrame)
    }

    function stop() {
      running = false
      cancelAnimationFrame(waveRaf)
      cancelAnimationFrame(dotRaf)
    }

    function onMouseMove(e: MouseEvent) {
      if (!mouse.inside) {
        mouse.x = e.clientX
        mouse.y = e.clientY
      }
      mouse.inside = true
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
    }
    function onMouseLeave() {
      mouse.inside = false
      dotsDirty = true
    }
    function onScroll() {
      dotsDirty = true
    }
    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    const ro = new ResizeObserver(resizeWaves)
    ro.observe(container)
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(container)

    resizeWaves()
    drawWaves(0)
    if (dotCanvas) {
      resizeDots()
      window.addEventListener("resize", resizeDots)
      window.addEventListener("mousemove", onMouseMove, { passive: true })
      document.documentElement.addEventListener("mouseleave", onMouseLeave)
      window.addEventListener("scroll", onScroll, { passive: true })
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener("resize", resizeDots)
      window.removeEventListener("mousemove", onMouseMove)
      document.documentElement.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [layers, showDots])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <canvas ref={waveCanvasRef} className="absolute inset-0 h-full w-full" />
      {showDots && (
        <>
          <div className="absolute inset-0" style={DOT_PATTERN_STYLE} />
          <canvas ref={dotCanvasRef} className="fixed inset-0 h-full w-full" />
        </>
      )}
    </div>
  )
}
