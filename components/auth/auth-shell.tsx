import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { AuthVisual } from "@/components/auth/auth-visual"

/**
 * Cascarón visual a pantalla completa de las páginas de auth que NO
 * tienen la transición deslizante (recuperar contraseña, nueva
 * contraseña). Mitad izquierda: `AuthVisual`. Mitad derecha: `children`.
 * Login y registro usan `AuthFlow` en su lugar.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row">
      <section className="hidden w-full p-3 lg:block lg:w-[46%]">
        <AuthVisual className="min-h-[calc(100svh_-_1.5rem)] rounded-[28px] p-10" />
      </section>

      <section className="relative flex flex-1 flex-col overflow-hidden px-6 py-10 sm:px-12 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(circle at 70% 30%, #131b2b 0%, #040711 70%)" }}
        />

        <Link href="/" className="inline-flex items-center gap-3 lg:hidden">
          <Logo size={40} />
          <span className="text-lg font-black tracking-tight text-primary">MatriClick</span>
        </Link>

        <div className="mx-auto my-auto w-full max-w-sm py-6">{children}</div>
      </section>
    </div>
  )
}
