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
  if (isProtectedPage && !accessToken && refreshToken) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const nextResponse = NextResponse.next();

        // Update persistent cookies in the response
        nextResponse.cookies.set('accessToken', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60,
        });

        nextResponse.cookies.set('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });

        return nextResponse;
      }
    } catch (err) {
      console.error('Middleware Refresh Error:', err);
    }

    // Refresh failed or error -> force logout
    const nextResponse = NextResponse.redirect(new URL('/auth/login', request.url));
    nextResponse.cookies.delete('accessToken');
    nextResponse.cookies.delete('refreshToken');
    return nextResponse;
  }

  return NextResponse.next();
}

// Optimization: Only run middleware on specific paths to save performance
export const config = {
  matcher: ['/user/:path*', '/auth/login', '/auth/register'],
};