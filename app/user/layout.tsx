// app/(dashboard)/layout.tsx
import BottomNav from '@/components/layout/BottomNav';
import React from 'react';
import { cookies } from 'next/headers';
import { SocketProvider } from '@/components/providers/SocketProvider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  return (
    <>
      {/* <SocketProvider token={token}> */}
      {children}
      <BottomNav />
      {/* </SocketProvider> */}
    </>
  );
}