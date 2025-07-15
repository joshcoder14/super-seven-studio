import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('authToken')?.value
  const isAuthenticated = Boolean(authToken)
  const role = request.cookies.get('user_role')?.value

  // Public routes
  const publicRoutes = ['/login', '/register']
  
  // Skip middleware for static files and API routes
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    /\.(ico|svg|png|jpg|jpeg|css|js)$/.test(pathname)
  ) {
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect if role is missing
  if (!role) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'missing_role')
    return NextResponse.redirect(loginUrl)
  }

  // Owner: No restrictions
  if (role === 'Owner') {
    return NextResponse.next()
  }

  // Secretary: Block billing routes
  if (role === 'Secretary') {
    if (pathname.startsWith('/billing')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Editor/Photographer: Strict allowlist
  if (role === 'Editor' || role === 'Photographer') {
    const allowedPaths = ['/', '/workload', '/settings']
    const isAllowed = allowedPaths.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    )

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Client: Specific allowed routes
  if (role === 'Client') {
    const allowedPaths = ['/', '/booking', '/package', '/billing', '/settings']
    const isAllowed = allowedPaths.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    )

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Fallback for unknown roles
  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|svg|png|jpg|jpeg|css|js)).*)',
  ],
}