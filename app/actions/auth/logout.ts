'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server Action to log out the user
 * Clears the session cookie and redirects to login [cite: 32]
 */
export async function logoutUser() {
    const cookieStore = await cookies();

    // Clear the auth cookies
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    // Redirect to the login page
    redirect('/auth/login');
}
