// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';
  const isProtectedPage = pathname.startsWith('/user');

  // SCENARIO A: Already logged in (has refresh token)
  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // SCENARIO B: Not logged in
  if (isProtectedPage && !refreshToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // SCENARIO C: Access Token expired/missing but have Refresh Token
  // We no longer block in middleware. We let the page layout/skeleton render instantly
  // and handle the refresh in the actual data fetching layer (authorizedFetch).
  if (isProtectedPage && !accessToken && refreshToken) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Optimization: Only run middleware on specific paths to save performance
export const config = {
  matcher: ['/user/:path*', '/auth/login', '/auth/register'],
};