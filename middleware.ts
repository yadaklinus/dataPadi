// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('session_token')?.value;
  
  // 2. Define current path
  const { pathname } = request.nextUrl;

  // 3. Define paths
  const isAuthPage = pathname === '/login' || pathname === '/register';
  // Assumes all your protected dashboard routes start with /user
  const isProtectedPage = pathname.startsWith('/user'); 

  // SCENARIO A: User is ALREADY logged in but tries to go to Login/Register
  // Redirect them to Dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // SCENARIO B: User is NOT logged in but tries to go to a Protected Page
  // Redirect them to Login
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Optimization: Only run middleware on specific paths to save performance
export const config = {
  matcher: ['/user/:path*', '/login', '/register'],
};