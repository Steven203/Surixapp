import { NextRequest, NextResponse } from 'next/server'

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

    const isAuthRoute = path === '/login' || path === '/register'
    const isAdminRoute = path.startsWith('/admin')
    const isClienteRoute = path.startsWith('/lista') || path.startsWith('/perfil')

    if (isAuthRoute && usuario) {
        if (usuario?.roles?.includes('ADMIN')) {
            return NextResponse.redirect(new URL('/admin/productos', request.url))
        }
        return NextResponse.redirect(new URL('/lista', request.url))
    }

    if (isAdminRoute) {
        if (!usuario) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (!usuario?.roles?.includes('ADMIN')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (isClienteRoute) {
        if (!usuario) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (!usuario?.roles?.includes('CLIENTE') && !usuario?.roles?.includes('ADMIN')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/lista/:path*', '/perfil/:path*', '/login', '/register'],
}