import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas bloqueadas para la presentación del proyecto final
  const blockedRoutes = [
    '/cocomo-ii',
    '/use-case-points'
  ]

  // Si la ruta está bloqueada, redirigir a la página de funcionalidad no disponible
  if (blockedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/feature-unavailable', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cocomo-ii/:path*',
    '/use-case-points/:path*'
  ]
} 