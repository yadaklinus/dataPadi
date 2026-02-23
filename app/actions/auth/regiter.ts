'use server'

// app/actions/auth.ts
export async function registerUser(formData: FormData) {
  // Grab the base URL from your .env file
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Extract fields from the form
  const payload = {
    userName: formData.get('userName'),
    email: formData.get('email'),
    phoneNumber: formData.get('phoneNumber'),
    password: formData.get('password'),
  };

  try {
    // The browser never sees this request
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Handle standard Data Padi errors (400, 409)
    if (!response.ok) {
      return { success: false, error: data.message || 'Registration failed' };
    }

    // Handle success (201)
    return { success: true, message: data.message };
    
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to connect to the server. Please try again later.' };
  }
}