// app/(dashboard)/layout.tsx
import BottomNav from '@/components/layout/BottomNav';
import React from 'react';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
            {children}
          <BottomNav/>
    </>
  );
}