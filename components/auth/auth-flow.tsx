"use client"

import Link from "next/link"
import { useState } from "react"

import { Logo } from "@/components/brand/logo"
import { AuthVisual } from "@/components/auth/auth-visual"
import { LoginForm } from "@/components/auth/login-form"
import { RegistroForm } from "@/components/auth/registro-form"
import { AUTH_WAVE_LAYERS, WaveCanvas } from "@/components/landing/wave-canvas"

type Mode = "login" | "registro"

/**
 * Login + registro en una sola pantalla con transición deslizante.
 *
 * En login: imagen a la izquierda, formulario a la derecha.
 * Al pasar a registro, el panel de imagen se desliza a la derecha y el
 * formulario a la izquierda (y al revés al volver a login).
 *
 * Cada uno sigue siendo una ruta real (`/login`, `/registro`) — al
 * cambiar de modo se actualiza la URL con `history.replaceState` sin
 * navegar, para que la transición no remonte nada. Un refresh o una
 * visita directa cargan la ruta correcta.
 *
 * En móvil (`< lg`) no hay panel de imagen: solo el formulario, y el
 * cambio es un fundido corto.
 */
export function AuthFlow({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const isRegistro = mode === "registro"

  function switchTo(next: Mode) {
    if (next === mode) return
    setMode(next)
    window.history.replaceState(window.history.state, "", `/${next}`)
  }

  return (
    <div className="relative flex min-h-svh w-full overflow-hidden bg-[#040711]">
      {/* Panel de imagen — se desliza de un lado al otro (solo desktop) */}
      <div
        className={`absolute inset-y-0 left-0 z-20 hidden w-1/2 p-3 transition-transform duration-700 ease-in-out motion-reduce:transition-none lg:block ${
          isRegistro ? "translate-x-full" : "translate-x-0"
        }`}
        aria-hidden="true"
      >
        <AuthVisual className="rounded-[28px] p-10" />
      </div>

      {/* Columna del formulario — cede el lado contrario al panel de imagen */}
      <div
        className={`relative z-10 flex min-h-svh w-full flex-col transition-[margin] duration-700 ease-in-out motion-reduce:transition-none lg:w-1/2 lg:p-3 ${
          isRegistro ? "lg:ml-0" : "lg:ml-[50%]"
        }`}
      >
        {/* Tarjeta — mismos bordes redondeados que el panel de imagen (solo desktop).
            `isolate` le da su propio contexto de apilamiento: sin esto, los z-index
            negativos de abajo se "escapan" detrás del `bg-[#0d131f]` de esta misma
            tarjeta en vez de quedar solo detrás de su contenido (se vio en pantalla:
            el canvas sí dibujaba, pero el fondo opaco de la tarjeta lo tapaba). */}
        <div className="relative isolate flex h-full w-full flex-col overflow-hidden lg:rounded-[28px] lg:border lg:border-white/10 lg:bg-[#0d131f]">
          {/* Mismas cintas + grilla de puntos de la landing (ver AUTH_WAVE_LAYERS
              en wave-canvas.tsx) — este panel es casi del alto del viewport, sin
              scroll, así que usa la composición original del hero. */}
          <div className="pointer-events-none absolute inset-0 -z-20">
            <WaveCanvas layers={AUTH_WAVE_LAYERS} showDots />
          </div>
          {/* Ambiente azul sutil — se suma encima del canvas para que el texto
              siga siendo legible */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "radial-gradient(circle at 70% 30%, #131b2b00 0%, #040711b3 70%)" }}
          />

          <div className="relative flex min-h-svh w-full flex-1 flex-col overflow-y-auto px-6 py-10 sm:px-12 lg:min-h-0 lg:px-16">
            {/* Marca — solo en móvil (en desktop vive en el panel de imagen) */}
            <Link href="/" className="inline-flex items-center gap-3 lg:hidden">
              <Logo size={40} />
              <span className="text-lg font-black tracking-tight text-primary">MatriClick</span>
            </Link>

            <div
              key={mode}
              className="my-auto w-full py-6 duration-500 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
            >
              {isRegistro ? (
                <RegistroForm onSwitch={() => switchTo("login")} />
              ) : (
                <LoginForm onSwitch={() => switchTo("registro")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
