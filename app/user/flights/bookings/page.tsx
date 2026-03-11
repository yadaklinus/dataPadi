import { Suspense } from 'react';
import { getUserFlights } from '@/app/actions/flight';
import BookingsClient from '@/components/flights/BookingsClient';
import { BookingsSkeleton } from '@/components/flights/BookingsSkeleton';
import { redirect } from 'next/navigation';

async function BookingsContent() {
    const result = await getUserFlights();

    if (!result.success) {
        // If unauthorized or error, kick back to login
        redirect('/auth/login');
    }

    const requests = result.data || [];

    return <BookingsClient initialRequests={requests} />;
}

export default function BookingsPage() {
    return (
        <Suspense fallback={<BookingsSkeleton />}>
            <BookingsContent />
        </Suspense>
    );
}
