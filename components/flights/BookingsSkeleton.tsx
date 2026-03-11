import React from 'react';

export const BookingsSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-5 pt-8 bg-[#F8FAFC] min-h-screen animate-pulse">

            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2" />
                <div className="h-4 w-64 bg-slate-100 rounded-md" />
            </div>

            {/* List Skeleton */}
            <div className="space-y-5">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-[2rem] border border-slate-100/60 p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-16 bg-slate-100 rounded-md" />
                                <div className="h-4 w-4 bg-slate-50 rounded" />
                                <div className="h-8 w-16 bg-slate-100 rounded-md" />
                            </div>
                        </div>
                        <div className="flex gap-4 mb-6">
                            <div className="h-4 w-24 bg-slate-50 rounded" />
                            <div className="h-4 w-24 bg-slate-50 rounded" />
                        </div>
                        <div className="h-8 w-32 bg-slate-100 rounded-full" />
                        <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between">
                            <div className="h-3 w-20 bg-slate-50 rounded" />
                            <div className="h-3 w-16 bg-slate-100 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
