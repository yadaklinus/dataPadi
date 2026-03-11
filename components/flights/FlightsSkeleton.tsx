import React from 'react';

export const FlightsSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 sm:px-6 pt-8 bg-gray-50 min-h-screen animate-pulse">

            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 w-64 bg-gray-100 rounded-md" />
            </div>

            {/* Trip Type Tabs Skeleton */}
            <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
                <div className="h-10 w-28 bg-gray-900/10 rounded-xl" />
                <div className="h-10 w-28 bg-transparent rounded-xl" />
            </div>

            {/* Search Form Skeleton */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">

                {/* Origin/Destination Inputs */}
                <div className="grid md:grid-cols-2 gap-6 relative">
                    <div className="space-y-4">
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                        <div className="h-16 w-full bg-gray-50 rounded-2xl" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                        <div className="h-16 w-full bg-gray-50 rounded-2xl" />
                    </div>
                    {/* Swap Button Placeholder */}
                    <div className="hidden md:flex absolute left-1/2 top-[55px] -translate-x-1/2 w-10 h-10 rounded-full bg-gray-100 border-4 border-white shadow-sm" />
                </div>

                {/* Date & Travelers Inputs */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <div className="h-3 w-24 bg-gray-100 rounded" />
                        <div className="h-14 w-full bg-gray-50 rounded-2xl" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-3 w-24 bg-gray-100 rounded" />
                        <div className="h-14 w-full bg-gray-50 rounded-2xl" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-3 w-24 bg-gray-100 rounded" />
                        <div className="h-14 w-full bg-gray-50 rounded-2xl" />
                    </div>
                </div>

                {/* Search Button Skeleton */}
                <div className="h-16 w-full bg-blue-100 rounded-2xl mt-4" />
            </div>

            {/* Recent Searches Placeholder */}
            <div className="mt-10">
                <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 min-w-[200px] bg-white rounded-2xl border border-gray-100 shadow-sm shrink-0" />
                    ))}
                </div>
            </div>
        </div>
    );
};
