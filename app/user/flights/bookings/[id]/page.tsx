import { Suspense } from 'react';
import { getFlightRequest } from '@/app/actions/flight';
import BookingDetailsClient from '@/components/flights/BookingDetailsClient';
import { BookingDetailsSkeleton } from '@/components/flights/BookingDetailsSkeleton';
import { redirect, notFound } from 'next/navigation';

async function BookingDetailsContent({ id }: { id: string }) {
    const result = await getFlightRequest(id);

    if (!result.success) {
        if (result.error?.includes('Unauthorized')) {
            redirect('/auth/login');
        }
        notFound();
    }

    return <BookingDetailsClient id={id} initialRequest={result.data} />;
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;

    return (
        <Suspense fallback={<BookingDetailsSkeleton />}>
            <BookingDetailsContent id={id} />
        </Suspense>
    );
}
