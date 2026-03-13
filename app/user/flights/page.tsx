export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { getAirports } from '@/app/actions/flight';
import FlightsClient from '@/components/flights/FlightsClient';
import { FlightsSkeleton } from '@/components/flights/FlightsSkeleton';

async function FlightsContent() {
    const result = await getAirports();

    // Even if it fails, we pass an empty array to the client to avoid a crash
    const airports = (result.success && result.data) ? result.data : [];

    return <FlightsClient initialAirports={airports} />;
}

export default function FlightsPage() {
    return (
        <Suspense fallback={<FlightsSkeleton />}>
            <FlightsContent />
        </Suspense>
    );
}
