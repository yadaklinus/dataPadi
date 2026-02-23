import { redirect } from 'next/navigation';
import { getPrintInventory } from '@/app/actions/vtu';
import PrintPins from '@/components/Printing';

export default async function DashboardPage() {
  const result = await getPrintInventory();
  console.log(result)
  if (!result.success ) {
    // If unauthorized or error, kick back to login
    redirect('/auth/login');
  }

  return <PrintPins/>;
}