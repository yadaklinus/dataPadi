import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const cookieStore = await cookies();

    // Clear the auth cookies
    cookieStore.delete('accessToken');

    // Redirect to the login page
    const url = new URL(request.url);
    return NextResponse.redirect(new URL('/auth/login', url.origin));
}
