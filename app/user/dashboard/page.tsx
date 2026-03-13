export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { getDashboardData } from '@/app/actions/dashboard';
import Dashboard from '@/components/dashboardComponent';
import { redirect } from 'next/navigation';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

async function DashboardContent() {
  const result = await getDashboardData();

  if (!result.success || !result.data) {
    // If unauthorized or error, kick back to login
    redirect('/auth/login');
  }

  return <Dashboard initialData={result.data} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}