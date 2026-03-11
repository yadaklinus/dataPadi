import React from 'react';
import { BalanceCardSkeleton } from './BalanceCard';
import { RecentActivitySkeleton } from './RecentActivity';

export const DashboardSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 sm:px-6 bg-gray-50">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-6 pt-6 animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100" />
                    <div>
                        <div className="h-5 w-32 bg-gray-100 rounded-md mb-2" />
                        <div className="h-3 w-20 bg-gray-50 rounded-md" />
                    </div>
                </div>
            </div>

            {/* Balance Card Skeleton */}
            <BalanceCardSkeleton />

            {/* Quick Actions Skeleton */}
            <h2 className="text-base font-bold text-gray-900 mb-4 px-1">Quick Actions</h2>
            <div className="grid grid-cols-5 gap-3 mb-8 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex flex-col items-center py-4 px-2 rounded-2xl bg-white border border-gray-100 h-[100px]">
                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                        <div className="h-2 w-12 bg-gray-50 mt-3 rounded" />
                    </div>
                ))}
            </div>

            {/* Recent Activity Skeleton */}
            <RecentActivitySkeleton />
        </div>
    );
};
