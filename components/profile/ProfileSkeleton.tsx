import React from 'react';

export const ProfileSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 sm:px-6 pt-8 bg-gray-50 min-h-screen animate-pulse">

            {/* Header Skeleton */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4" />
                <div className="h-6 w-40 bg-gray-200 rounded-md mb-2" />
                <div className="h-4 w-56 bg-gray-100 rounded-md mb-4" />
                <div className="h-8 w-32 bg-gray-50 rounded-full" />
            </div>

            {/* Wallet Card Skeleton */}
            <div className="bg-gray-200 rounded-3xl p-6 h-[200px] mb-8 shadow-sm">
                <div className="h-4 w-32 bg-gray-300 rounded mb-6" />
                <div className="h-10 w-48 bg-gray-300 rounded-lg mb-4" />
                <div className="h-12 w-full bg-white/20 rounded-2xl" />
            </div>

            {/* Preferences Menu Skeleton */}
            <div className="h-4 w-32 bg-gray-100 rounded mb-3 ml-2" />
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 flex items-center justify-between border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50" />
                            <div className="h-4 w-40 bg-gray-100 rounded-md" />
                        </div>
                        <div className="h-4 w-4 bg-gray-50 rounded" />
                    </div>
                ))}
            </div>

            {/* Logout Button Skeleton */}
            <div className="h-16 w-full bg-white border border-gray-100 rounded-2xl" />
        </div>
    );
};
