// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/forgot-password' || pathname === '/auth/reset-password';
  const isProtectedPage = pathname.startsWith('/user');

  // SCENARIO A: Already logged in
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // SCENARIO B: Not logged in
  if (isProtectedPage && !accessToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Optimization: Only run middleware on specific paths to save performance
export const config = {
  matcher: ['/user/:path*', '/auth/login', '/auth/register'],
};