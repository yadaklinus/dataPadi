import { cookies } from 'next/headers';

/**
 * A server-side wrapper for fetch that automatically 
 * attaches the session_token from cookies.
 */
export async function authorizedFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  const getHeaders = (token: string | undefined) => ({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  });

  const startTime = Date.now();
  let response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: getHeaders(accessToken),
  });
  const endTime = Date.now();

  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${options.method || 'GET'} ${endpoint} - ${response.status} (${endTime - startTime}ms)`);
  }

  // Handle unauthorized (expired accessToken)
  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.accessToken;
        const newRefreshToken = refreshData.refreshToken;

        // Persist BOTH tokens back to cookies immediately
        // Note: In Next.js Server Actions/Route Handlers, we can set cookies.
        // In Server Components, this might fail if called during rendering.
        try {
          const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          };

          cookieStore.set('accessToken', newAccessToken, cookieOptions);

          if (newRefreshToken) {
            cookieStore.set('refreshToken', newRefreshToken, cookieOptions);
          }
        } catch (cookieError) {
          // This happens if authorizedFetch is called in a context where cookies are read-only (e.g. Server Component body)
          console.warn('[API] Could not update cookies in this context (likely a Server Component). Tokens will be stale on next request.');
        }

        // Retry original request with NEW access token for the current stream
        response = await fetch(`${BACKEND_URL}${endpoint}`, {
          ...options,
          headers: getHeaders(newAccessToken),
        });
      } else {
        // Any other refresh failure (401, 403, 500, etc.)
        // Clear session to prevent infinite reload loops
        console.error(`[API] Refresh failed with status ${refreshResponse.status}. Logging out.`);
        try {
          cookieStore.delete('accessToken');
          cookieStore.delete('refreshToken');
        } catch (e) {
          console.warn('[API] Could not clear cookies in this context.');
        }
      }
    } catch (err) {
      console.error(' [API] Token refresh network error:', err);
    }
  }

  return response;
}