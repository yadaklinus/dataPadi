import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getPrintInventory } from '@/app/actions/vtu';
import PrintPins from '@/components/Printing';
import { PrintingSkeleton } from '@/components/printing/PrintingSkeleton';

async function PrintingContent() {
  const result = await getPrintInventory();

  if (!result.success) {
    // If unauthorized or error, kick back to login
    redirect('/auth/login');
  }

  // Pass the server-fetched inventory (if any) to the Client Component
  return <PrintPins initialInventory={result.data} />;
}

export default function PrintingPage() {
  return (
    <Suspense fallback={<PrintingSkeleton />}>
      <PrintingContent />
    </Suspense>
  );
}