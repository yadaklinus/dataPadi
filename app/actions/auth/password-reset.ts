'use server'

/**
 * Server Actions for Password Reset Flow
 * Based on Auth API Documentation Section 3
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function forgotPassword(formData: FormData) {
    const email = formData.get('email');

    if (!email) {
        return { success: false, error: 'Email is required' };
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Failed to request OTP' };
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { success: false, error: 'Failed to connect to the server' };
    }
}

export async function verifyOtp(formData: FormData) {
    const email = formData.get('email');
    const otp = formData.get('otp');

    if (!email || !otp) {
        return { success: false, error: 'Email and OTP are required' };
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Invalid OTP' };
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error('Verify OTP error:', error);
        return { success: false, error: 'Failed to connect to the server' };
    }
}

export async function resetPassword(formData: FormData) {
    const email = formData.get('email');
    const otp = formData.get('otp');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!email || !otp || !password) {
        return { success: false, error: 'All fields are required' };
    }

    if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Failed to reset password' };
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: 'Failed to connect to the server' };
    }
}
