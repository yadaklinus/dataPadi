'use server';

import { cookies } from 'next/headers';

export async function changePin(formData: FormData) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const password = formData.get('password');
    const newPin = formData.get('newPin');

    if (!password || !newPin) {
        return { success: false, error: 'Password and New PIN are required' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        return { success: false, error: 'Authentication required' };
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/change-pin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password, newPin }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Failed to change PIN' };
        }

        return {
            success: true,
            message: data.message || 'Transaction PIN successfully updated.'
        };

    } catch (error) {
        console.error('Change PIN error:', error);
        return { success: false, error: 'Failed to connect to the server' };
    }
}
