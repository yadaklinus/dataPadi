import React from 'react';

export const BookingDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] animate-pulse">
            {/* Premium Header Skeleton */}
            <div className="relative bg-slate-900 px-5 pt-12 pb-24 rounded-b-[2.5rem] mb-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-slate-800" />
                    <div className="h-6 w-32 bg-slate-800 rounded-md" />
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-5">
                        <div className="h-3 w-20 bg-white/10 rounded" />
                        <div className="h-6 w-24 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex items-center gap-4 py-2">
                        <div className="h-10 w-20 bg-white/10 rounded-lg" />
                        <div className="flex-1 h-px bg-white/10" />
                        <div className="h-10 w-20 bg-white/10 rounded-lg" />
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/5 flex gap-4">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-4 w-32 bg-white/10 rounded" />
                    </div>
                </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="px-5 space-y-6 -mt-14 relative z-20">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 h-[180px]" />
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 h-[300px]" />
            </div>
        </div>
    );
};
