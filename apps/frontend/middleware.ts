import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_ROUTES = ['/history'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };

    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token');
  const hasValidToken = accessToken !== undefined && isTokenValid(accessToken.value);

  if (PRIVATE_ROUTES.some((r) => pathname.startsWith(r)) && !hasValidToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && hasValidToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/history/:path*', '/sign-in', '/sign-up'],
};
