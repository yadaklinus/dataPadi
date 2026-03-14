export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { getFlightTransactions } from '@/app/actions/flight';
import FlightTransactionsClient from '@/components/flights/FlightTransactionsClient';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

async function TransactionsContent() {
  const result = await getFlightTransactions();

  if (!result.success) {
    // If unauthorized or error, kick back to login or show error
    if (result.error?.includes('Unauthorized')) redirect('/auth/login');
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-4 max-w-sm">
                {result.error || 'Failed to load airplane transactions.'}
            </div>
        </div>
    );
  }

  return <FlightTransactionsClient initialTransactions={result.data} />;
}

export default function FlightTransactionsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        }>
            <TransactionsContent />
        </Suspense>
    </main>
  );
}
