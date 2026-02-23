import { cookies } from 'next/headers';

/**
 * A server-side wrapper for fetch that automatically 
 * attaches the session_token from cookies.
 */
export async function authorizedFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle unauthorized (expired token)
  if (response.status === 401) {
    // You might want to redirect to /login here or handle logout logic
  }

  return response;
}