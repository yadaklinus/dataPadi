"use client"
import React, { useState } from 'react';
import {
  Eye, EyeOff, Plus, Smartphone, Wifi, Zap, Tv,
  TrendingUp, CreditCard, Receipt, ChevronRight
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { CURRENCY } from '@/constants';
import BuyDataModal from '@/components/modals/BuyDataModal';
import BuyAirtimeModal from '@/components/modals/BuyAirtimeModal';
import { motion } from 'framer-motion';
import { DashboardData } from '@/app/actions/dashboard';
import BuyElectricityModal from './modals/BuyElectrictyModal';
import BuyCableModal from './modals/BuyCableModal';

interface DashboardProps {
  initialData: DashboardData;
}

// Map backend transaction types to UI icons
const getIconConfig = (type: string) => {
  switch (type) {
    case 'DATA': return { icon: Wifi, bg: 'bg-blue-50', color: 'text-blue-600' };
    case 'AIRTIME': return { icon: Smartphone, bg: 'bg-emerald-50', color: 'text-emerald-600' };
    case 'CABLE_TV': return { icon: Tv, bg: 'bg-purple-50', color: 'text-purple-600' };
    case 'ELECTRICITY': return { icon: Zap, bg: 'bg-amber-50', color: 'text-amber-600' };
    case 'WALLET_FUNDING': return { icon: CreditCard, bg: 'bg-orange-50', color: 'text-orange-600' };
    default: return { icon: Receipt, bg: 'bg-gray-50', color: 'text-gray-600' };
  }
};

const Dashboard: React.FC<DashboardProps> = ({ initialData }) => {
  const [data] = useState<DashboardData>(initialData);
  const [showBalance, setShowBalance] = useState(true);
  const [isBuyDataOpen, setIsBuyDataOpen] = useState(false);
  const [isBuyAirtimeOpen, setIsBuyAirtimeOpen] = useState(false);
  const [isBuyElectrictyOpen, setIsBuyElectrictyOpen] = useState(false);
  const [isBuyCableTV, setIsBuyCableTV] = useState(false);

  // Modernized Quick Actions: Light backgrounds with colored icons
  const quickActions = [
    { icon: Wifi, label: 'Buy Data', bg: 'bg-blue-50', color: 'text-blue-600', onClick: () => setIsBuyDataOpen(true) },
    { icon: Smartphone, label: 'Airtime', bg: 'bg-emerald-50', color: 'text-emerald-600', onClick: () => setIsBuyAirtimeOpen(true) },
    { icon: Tv, label: 'Cable TV', bg: 'bg-purple-50', color: 'text-purple-600', onClick: () => setIsBuyCableTV(true) },
    { icon: Zap, label: 'Electricity', bg: 'bg-amber-50', color: 'text-amber-600', onClick: () => setIsBuyElectrictyOpen(true) },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 sm:px-6 bg-gray-50">

      {/* Header Area */}
      <div className="flex justify-between items-center mb-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {data.user.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Hi, {data.user.fullName.split(' ')[0]} 👋
            </h1>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
              {data.user.tier.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Wallet Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-primary to-blue-800 text-white border-none shadow-xl shadow-blue-900/20 p-6 rounded-[2rem] mb-8">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-100 text-sm font-medium tracking-wide">Available Balance</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="Toggle balance visibility"
              >
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {showBalance ? `${CURRENCY}${data.user.walletBalance.toLocaleString()}` : '****'}
            </div>
          </div>

          {/* Today Spent Metric - Moved to top right for balance */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 text-right border border-white/10">
            <span className="text-[10px] text-blue-100 uppercase tracking-wider block mb-0.5">Today Spent</span>
            <div className="flex items-center justify-end gap-1">
              <TrendingUp size={12} className="text-white" />
              <span className="font-bold text-sm text-white">{CURRENCY}{data.todaySpent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="relative z-10 pt-2 border-t border-white/10">
          <button className="bg-white text-gray-900 px-5 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-50 active:scale-95 transition-all shadow-md">
            <Plus size={18} strokeWidth={3} className="text-primary" />
            Fund Wallet
          </button>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <h2 className="text-base font-bold text-gray-900 mb-4 px-1">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {quickActions.map((action) => (
          <motion.button
            key={action.label}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center bg-white py-4 px-2 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all group"
          >
            <div className={`${action.bg} ${action.color} p-3 rounded-full mb-2 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-gray-700 text-xs text-center">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
        <button className="text-primary text-sm font-semibold hover:text-blue-800 transition-colors">See All</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {data.recentTransactions.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {data.recentTransactions.map((tx, index) => {
              const config = getIconConfig(tx.type);
              const Icon = config.icon;
              const isFunding = tx.type === 'WALLET_FUNDING';

              return (
                <div key={`${tx.id}-${index}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center ${config.color}`}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {tx.type.replace('_', ' ')} {tx.metadata?.network ? `• ${tx.metadata.network}` : ''}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${isFunding ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {isFunding ? '+' : '-'}{CURRENCY}{tx.amount.toLocaleString()}
                    </span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No recent transactions found.
          </div>
        )}
      </div>

      <BuyDataModal isOpen={isBuyDataOpen} onClose={() => setIsBuyDataOpen(false)} />
      <BuyAirtimeModal isOpen={isBuyAirtimeOpen} onClose={() => setIsBuyAirtimeOpen(false)} />
      <BuyElectricityModal isOpen={isBuyElectrictyOpen} onClose={() => setIsBuyElectrictyOpen(false)} />
      <BuyCableModal isOpen={isBuyCableTV} onClose={() => setIsBuyCableTV(false)} />
    </div>
  );
};

export default Dashboard;