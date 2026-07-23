import { NextRequest, NextResponse } from 'next/server'

// ==========================================
// CONSTANTES LOCALES Y RUTAS CONFIGURADAS
// ==========================================
const AUTH_ROUTES = ['/login', '/register'] as const
const ADMIN_PREFIX = '/admin'
const CLIENTE_PREFIXES = ['/lista', '/perfil'] as const

const ROUTES = {
    LOGIN: '/login',
    ADMIN_DEFAULT: '/admin/productos',
    CLIENTE_DEFAULT: '/lista',
} as const

const ROLES = {
    ADMIN: 'ADMIN',
    CLIENTE: 'CLIENTE',
} as const

export function proxy(request: NextRequest) {
    const authCookie = request.cookies.get('auth-user')?.value
    const path = request.nextUrl.pathname

    const safeParseUser = () => {
        if (!authCookie) return null
        try {
            return JSON.parse(decodeURIComponent(authCookie))
        } catch {
            return null
        }
    }

    const usuario = safeParseUser()

    // Uso de las constantes para evaluar las rutas
    const isAuthRoute = AUTH_ROUTES.some((route) => path === route)
    const isAdminRoute = path.startsWith(ADMIN_PREFIX)
    const isClienteRoute = CLIENTE_PREFIXES.some((prefix) => path.startsWith(prefix))

    // 1. Control de rutas de autenticación (si ya está logueado)
    if (isAuthRoute && usuario) {
        if (usuario?.roles?.includes(ROLES.ADMIN)) {
            return NextResponse.redirect(new URL(ROUTES.ADMIN_DEFAULT, request.url))
        }
        return NextResponse.redirect(new URL(ROUTES.CLIENTE_DEFAULT, request.url))
    }

    // 2. Control de rutas de administrador
    if (isAdminRoute) {
        if (!usuario || !usuario?.roles?.includes(ROLES.ADMIN)) {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
        }
    }

    // 3. Control de rutas de cliente
    if (isClienteRoute) {
        if (!usuario) {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
        }
        const hasValidRole =
            usuario?.roles?.includes(ROLES.CLIENTE) ||
            usuario?.roles?.includes(ROLES.ADMIN)

        if (!hasValidRole) {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/lista/:path*', '/perfil/:path*', '/login', '/register'],
}