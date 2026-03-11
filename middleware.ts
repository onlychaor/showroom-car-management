import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const { pathname } = nextUrl

  // Allow public files and auth routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/auth') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next()
  }

  // Basic check: allow if supabase dev session or supabase access token present
  const devUser = cookies.get('dev_user') || null
  const sbToken = cookies.get('sb-access-token') || cookies.get('supabase-auth-token') || null
  if (devUser || sbToken) {
    return NextResponse.next()
  }

  // redirect to auth
  const url = new URL('/auth', req.url)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

