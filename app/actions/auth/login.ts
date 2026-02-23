'use server'

import { cookies } from 'next/headers';

/**
 * Server Action for user authentication
 * Based on DataPadi API Documentation Section 2.2
 */
export async function loginUser(formData: FormData) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handles 400 (Missing fields) and 401 (Invalid credentials)
      return { success: false, error: data.message || 'Invalid credentials' };
    }

    // Set the JWT in an httpOnly cookie
    // If using Next.js 15+, ensure this is awaited: await (await cookies()).set(...)
    const cookieStore = await cookies();
    cookieStore.set('session_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { 
      success: true, 
      user: {
        id: data.user.id,
        userName: data.user.userName,
        tier: data.user.tier,
        isKycVerified: data.user.isKycVerified
      } 
    };
    
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Failed to connect to the server' };
  }
}