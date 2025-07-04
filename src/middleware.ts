import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const authToken = request.cookies.get('authToken')?.value
    const isAuthenticated = Boolean(authToken)

    // FIX 5: Define public routes
    const publicRoutes = ['/login', '/register']
    
    // Skip middleware for:
    if (
        publicRoutes.includes(pathname) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        /\.(ico|svg|png|jpg|jpeg|css|js)$/.test(pathname)
    ) {
        // Redirect authenticated users away from public routes
        if (isAuthenticated && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    // FIX 6: Redirect unauthenticated users to login
    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Match all request paths except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|svg|png|jpg|jpeg|css|js)).*)',
    ],
}