"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DashboardData, getDashboardData } from '@/app/actions/dashboard';

// Import granular components
import { Header } from './dashboard/Header';
import { BalanceCard } from './dashboard/BalanceCard';
import { QuickActions } from './dashboard/QuickActions';
import { RecentActivity } from './dashboard/RecentActivity';

// Dynamic imports for modals to reduce initial bundle
const BuyDataModal = dynamic(() => import('@/components/modals/BuyDataModal'), { ssr: false });
const BuyAirtimeModal = dynamic(() => import('@/components/modals/BuyAirtimeModal'), { ssr: false });
const BuyElectricityModal = dynamic(() => import('./modals/BuyElectrictyModal'), { ssr: false });
const BuyCableModal = dynamic(() => import('./modals/BuyCableModal'), { ssr: false });
const BuyEducationModal = dynamic(() => import('./modals/BuyEducationModal'), { ssr: false });

interface DashboardProps {
  initialData: DashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ initialData }) => {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isBuyDataOpen, setIsBuyDataOpen] = useState(false);
  const [isBuyAirtimeOpen, setIsBuyAirtimeOpen] = useState(false);
  const [isBuyElectrictyOpen, setIsBuyElectrictyOpen] = useState(false);
  const [isBuyCableTV, setIsBuyCableTV] = useState(false);
  const [isBuyEducationOpen, setIsBuyEducationOpen] = useState(false);

  // Re-sync with initialData if it changes from parent
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const refreshDashboard = async () => {
    const result = await getDashboardData();
    if (result.success && result.data) {
      setData(result.data);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'data': setIsBuyDataOpen(true); break;
      case 'airtime': setIsBuyAirtimeOpen(true); break;
      case 'cable': setIsBuyCableTV(true); break;
      case 'electricity': setIsBuyElectrictyOpen(true); break;
      case 'education': setIsBuyEducationOpen(true); break;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 sm:px-6 bg-gray-50">

      {/* 1. Header (Name, Tier) */}
      <Header
        fullName={data.user.fullName}
        tier={data.user.tier}
      />

      {/* 2. Balance Card (Wallet balance, Today Spent) */}
      <BalanceCard
        balance={Number(data.user.walletBalance)}
        todaySpent={Number(data.todaySpent)}
      />

      {/* 3. Quick Actions Grid */}
      <h2 className="text-base font-bold text-gray-900 mb-4 px-1">Quick Actions</h2>
      <QuickActions onAction={handleQuickAction} />

      {/* 4. Recent Activity List */}
      <RecentActivity transactions={data.recentTransactions} />

      {/* Modals are only loaded on demand (dynamic import) */}
      {isBuyDataOpen && (
        <BuyDataModal
          isOpen={isBuyDataOpen}
          onClose={() => setIsBuyDataOpen(false)}
          onRefresh={refreshDashboard}
        />
      )}
      {isBuyAirtimeOpen && (
        <BuyAirtimeModal
          isOpen={isBuyAirtimeOpen}
          onClose={() => setIsBuyAirtimeOpen(false)}
          onRefresh={refreshDashboard}
        />
      )}
      {isBuyElectrictyOpen && (
        <BuyElectricityModal
          isOpen={isBuyElectrictyOpen}
          onClose={() => setIsBuyElectrictyOpen(false)}
          onRefresh={refreshDashboard}
        />
      )}
      {isBuyCableTV && (
        <BuyCableModal
          isOpen={isBuyCableTV}
          onClose={() => setIsBuyCableTV(false)}
          onRefresh={refreshDashboard}
        />
      )}
      {isBuyEducationOpen && (
        <BuyEducationModal
          isOpen={isBuyEducationOpen}
          onClose={() => setIsBuyEducationOpen(false)}
          onRefresh={refreshDashboard}
        />
      )}
    </div>
  );
};

export default Dashboard;