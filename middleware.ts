// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public and internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  // Check for the iron-session cookie
  if (!req.cookies.has('logbook_session')) {
    // Not logged in → redirect to /login
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Logged in → continue
  return NextResponse.next()
}

export const config = {
  // Apply to all routes except the ones above
  matcher: [
    /*
      any path that is NOT:
       - /_next/*
       - /api/*
       - /
       - /login
       - /forgot-password
       - /favicon.ico
    */
    '/((?!_next/|api/|login$|forgot-password$|favicon.ico$).*)',
  ],
}
