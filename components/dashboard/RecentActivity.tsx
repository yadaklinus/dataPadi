"use client"
import React from 'react';
import { Wifi, Smartphone, Tv, Zap, GraduationCap, CreditCard, Receipt, ChevronRight } from 'lucide-react';
import { CURRENCY } from '@/constants';

interface Transaction {
    id: string;
    type: string;
    amount: number;
    createdAt: string;
    status: string;
    metadata?: any;
}

interface RecentActivityProps {
    transactions: Transaction[];
    isLoading?: boolean;
}

const getIconConfig = (type: string) => {
    switch (type) {
        case 'DATA': return { icon: Wifi, bg: 'bg-blue-50', color: 'text-blue-600' };
        case 'AIRTIME': return { icon: Smartphone, bg: 'bg-emerald-50', color: 'text-emerald-600' };
        case 'CABLE_TV': return { icon: Tv, bg: 'bg-purple-50', color: 'text-purple-600' };
        case 'ELECTRICITY': return { icon: Zap, bg: 'bg-amber-50', color: 'text-amber-600' };
        case 'EDUCATION': return { icon: GraduationCap, bg: 'bg-indigo-50', color: 'text-indigo-600' };
        case 'WALLET_FUNDING': return { icon: CreditCard, bg: 'bg-orange-50', color: 'text-orange-600' };
        default: return { icon: Receipt, bg: 'bg-gray-50', color: 'text-gray-600' };
    }
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ transactions, isLoading }) => {
    if (isLoading) {
        return <RecentActivitySkeleton />;
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="flex justify-between items-center p-5 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
                <button className="text-primary text-sm font-semibold hover:text-blue-800 transition-colors">See All</button>
            </div>

            {transactions.length > 0 ? (
                <div className="divide-y divide-gray-50">
                    {transactions.map((tx, index) => {
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
                <div className="p-10 text-center">
                    <p className="text-gray-400 text-sm font-medium">No recent transactions yet</p>
                </div>
            )}
        </div>
    );
};

export const RecentActivitySkeleton = () => (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8 animate-pulse">
        <div className="flex justify-between items-center p-5 border-b border-gray-50">
            <div className="h-5 w-32 bg-gray-100 rounded-md" />
            <div className="h-4 w-16 bg-gray-50 rounded-md" />
        </div>
        <div className="divide-y divide-gray-50">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-50" />
                        <div>
                            <div className="h-4 w-32 bg-gray-100 rounded-md mb-2" />
                            <div className="h-2 w-24 bg-gray-50 rounded-md" />
                        </div>
                    </div>
                    <div className="h-4 w-20 bg-gray-100 rounded-md" />
                </div>
            ))}
        </div>
    </div>
);
