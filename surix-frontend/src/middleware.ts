import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth-user')?.value
    const path = request.nextUrl.pathname

    // rutas que requieren login obligatorio
    if (path.startsWith('/admin')) {
        if (!authCookie)
            return NextResponse.redirect(new URL('/login', request.url))
        try {
            const usuario = JSON.parse(authCookie)
            if (!usuario?.roles?.includes('ADMIN'))
                return NextResponse.redirect(new URL('/login', request.url))
        } catch {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // /lista requiere login pero /catalogo es público
    if (path.startsWith('/lista')) {
        if (!authCookie)
            return NextResponse.redirect(new URL('/login?redirect=/lista', request.url))
        try {
            const usuario = JSON.parse(authCookie)
            if (!usuario?.roles?.includes('CLIENTE') && !usuario?.roles?.includes('ADMIN'))
                return NextResponse.redirect(new URL('/login', request.url))
        } catch {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/lista/:path*'],
}