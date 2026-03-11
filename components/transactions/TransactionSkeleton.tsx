import React from 'react';

export const TransactionSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-50" />
                            <div>
                                <div className="h-4 w-32 bg-gray-100 rounded-md mb-2" />
                                <div className="h-3 w-24 bg-gray-50 rounded-md" />
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="h-4 w-16 bg-gray-100 rounded-md mb-2 ml-auto" />
                            <div className="h-3 w-12 bg-gray-50 rounded-md ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TransactionsPageSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 p-4 sm:p-6 bg-gray-50 min-h-screen">
            {/* Header Skeleton */}
            <div className="mb-6 pt-2 animate-pulse">
                <div className="h-7 w-48 bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 w-64 bg-gray-100 rounded-md" />
            </div>

            {/* Filter Chips Skeleton */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-9 w-20 bg-white border border-gray-100 rounded-full shrink-0" />
                ))}
            </div>

            {/* Content Skeleton */}
            <TransactionSkeleton />
        </div>
    );
};
