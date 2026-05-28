import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth-user')?.value
    const path = request.nextUrl.pathname

    if (!authCookie) {
        if (path !== '/login')
            return NextResponse.redirect(new URL('/login', request.url))
        return NextResponse.next()
    }

    try {
        const usuario = JSON.parse(authCookie)
        const roles: string[] = usuario?.roles ?? []

        if (path.startsWith('/admin') && !roles.includes('ADMIN'))
            return NextResponse.redirect(new URL('/login', request.url))

        if (path.startsWith('/lista') && !roles.includes('CLIENTE'))
            return NextResponse.redirect(new URL('/login', request.url))

    } catch {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/lista/:path*'],
}