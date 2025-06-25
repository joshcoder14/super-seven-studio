import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const authToken = request.cookies.get('authToken')?.value
    const isAuthenticated = Boolean(authToken)

    const authRoutes = ['/login', '/register']
    const protectedRoutes = ['/', '/profile']

    // Skip middleware for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next()
    }

    // 🚫 Unauthenticated user trying to access protected route
    if (!isAuthenticated && protectedRoutes.includes(pathname)) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        return NextResponse.redirect(loginUrl)
    }

    // ✅ Authenticated user trying to access login/register
    if (isAuthenticated && authRoutes.includes(pathname)) {
        const homeUrl = request.nextUrl.clone()
        homeUrl.pathname = '/'
        return NextResponse.redirect(homeUrl)
    }

    return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
