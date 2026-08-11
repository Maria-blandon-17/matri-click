import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_PREFIX = "/dashboard"
const AUTH_ROUTES = ["/login", "/registro"]
// Coincide con las secciones admin-only del sidebar (components/dashboard/sidebar.tsx):
// Administración y Reportes. "/dashboard/cuentas" (Mi perfil) queda fuera a propósito —
// es accesible para cualquier rol.
const ADMIN_ONLY_PREFIXES = ["/dashboard/administracion", "/dashboard/reportes"]

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isProtected = pathname.startsWith(PROTECTED_PREFIX)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard/inicio"
    url.search = ""
    return NextResponse.redirect(url)
  }

  if (user && ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", user.id)
      .single()

    if (perfil?.rol !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard/inicio"
      url.search = ""
      return NextResponse.redirect(url)
    }
  }

  return response
}
