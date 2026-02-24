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

  let response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: getHeaders(accessToken),
  });

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

        // Retry original request with NEW access token for the current stream
        // Persistent cookie updates are handled by the Middleware layer
        response = await fetch(`${BACKEND_URL}${endpoint}`, {
          ...options,
          headers: getHeaders(refreshData.accessToken),
        });
      }
    } catch (err) {
      console.error('Token refresh error:', err);
    }
  }

  return response;
}