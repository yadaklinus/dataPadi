import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Helper to check if an error is a Next.js redirect error
 */
export function isRedirect(error: any): boolean {
  return error?.digest?.startsWith('NEXT_REDIRECT') || error?.message === 'NEXT_REDIRECT';
}

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


  // Handle unauthorized or forbidden (expired token or invalid session)
  if (response.status === 401 || response.status === 403) {
    console.warn(`[API] ${response.status} detected. Forcing logout.`);
    try {
      // Attempt to clear cookies immediately
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
    } catch (e) {
      // This is expected in Server Components/Render phase
      console.warn('[API] Could not clear cookies in this context, redirecting to logout route.');
    }
    // Force a redirect to the logout route which will clean up and redirect to login
    redirect('/api/auth/logout');
  }

  return response;
}