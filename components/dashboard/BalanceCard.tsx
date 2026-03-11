"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, TrendingUp, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import { CURRENCY } from '@/constants';
import { useRouter } from 'next/navigation';

interface BalanceCardProps {
    balance: number;
    todaySpent: number;
    isLoading?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, todaySpent, isLoading }) => {
    const [showBalance, setShowBalance] = useState(true);
    const router = useRouter();

    if (isLoading) {
        return <BalanceCardSkeleton />;
    }

    return (
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
                        {showBalance ? `${CURRENCY}${Number(balance).toLocaleString()}` : '****'}
                    </div>
                </div>

                {/* Today Spent Metric - Moved to top right for balance */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 text-right border border-white/10">
                    <span className="text-[10px] text-blue-100 uppercase tracking-wider block mb-0.5">Today Spent</span>
                    <div className="flex items-center justify-end gap-1">
                        <TrendingUp size={12} className="text-white" />
                        <span className="font-bold text-sm text-white">{CURRENCY}{Number(todaySpent).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="relative z-10 pt-2 border-t border-white/10">
                <button onClick={() => router.push('/user/profile')} className="bg-white text-gray-900 px-5 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-50 active:scale-95 transition-all shadow-md">
                    <Plus size={18} strokeWidth={3} className="text-primary" />
                    Fund Wallet
                </button>
            </div>
        </Card>
    );
};

export const BalanceCardSkeleton = () => (
    <div className="bg-white rounded-[2rem] p-6 mb-8 border border-gray-100 animate-pulse shadow-sm h-[200px] flex flex-col justify-between">
        <div>
            <div className="h-4 w-32 bg-gray-100 rounded-md mb-3" />
            <div className="h-10 w-48 bg-gray-200 rounded-lg" />
        </div>
        <div className="flex justify-between items-end">
            <div className="h-10 w-32 bg-gray-100 rounded-full" />
            <div className="h-10 w-24 bg-gray-50 rounded-xl" />
        </div>
    </div>
);
