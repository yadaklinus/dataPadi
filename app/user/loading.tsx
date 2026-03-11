import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 sm:px-6 pt-8 bg-gray-50 min-h-screen">
            {/* 1. Header Skeleton */}
            <div className="flex flex-col items-center mb-8 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 shadow-sm" />
                <div className="h-6 w-48 bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 w-32 bg-gray-100 rounded-lg mb-4" />
                <div className="h-8 w-40 bg-gray-100 rounded-full" />
            </div>

            {/* 2. Main Card Skeleton (e.g., Wallet/Balance) */}
            <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-5 h-5 bg-gray-100 rounded-md" />
                    <div className="h-4 w-24 bg-gray-100 rounded-md" />
                </div>

                <div className="space-y-4">
                    <div className="h-16 w-full bg-gray-50 rounded-2xl border border-gray-100" />
                    <div className="h-14 w-full bg-gray-200 rounded-2xl" />
                </div>
            </div>

            {/* 3. List Skeleton */}
            <div className="px-2 mb-4 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded-md" />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6 animate-pulse">
                <div className="divide-y divide-gray-50">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100" />
                                <div className="h-4 w-32 bg-gray-100 rounded-md" />
                            </div>
                            <div className="w-5 h-5 bg-gray-50 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Bottom Spinner (Optional for extra clarity) */}
            <div className="flex justify-center py-4">
                <Loader2 className="text-blue-600 animate-spin opacity-20" size={24} />
            </div>
        </div>
    );
}
