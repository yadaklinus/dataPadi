import { getDashboardData } from '@/app/actions/dashboard';
import Dashboard from '@/components/dashboardComponet';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const result = await getDashboardData();

  console.log(result)

  if (!result.success || !result.data) {
    // If unauthorized or error, kick back to login
    redirect('/auth/login');
  }

  return <Dashboard initialData={result.data} />;
}