import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_ROUTES = ['/history'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token');

  if (PRIVATE_ROUTES.some((r) => pathname.startsWith(r)) && !accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/history/:path*', '/sign-in', '/sign-up'],
};
