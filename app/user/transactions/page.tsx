export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { getTransactionHistory } from '@/app/actions/user';
import TransactionsClient from '@/components/transactions/TransactionsClient';
import { TransactionsPageSkeleton } from '@/components/transactions/TransactionSkeleton';
import { redirect } from 'next/navigation';
import { TransactionType } from '@/types/types';

async function TransactionsContent() {
  const result = await getTransactionHistory(1, 50, 'All');

  if (!result.success) {
    // If unauthorized or error, kick back to login
    redirect('/auth/login');
  }

  const transactions = result.data.map((tx: any) => ({
    ...tx,
    date: tx.date || tx.createdAt,
    type: tx.type as TransactionType
  }));

  return <TransactionsClient initialTransactions={transactions} />;
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsPageSkeleton />}>
      <TransactionsContent />
    </Suspense>
  );
}