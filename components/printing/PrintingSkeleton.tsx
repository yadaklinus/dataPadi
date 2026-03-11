import React from 'react';

export const PrintingSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-48 p-4 sm:p-6 bg-slate-50/50 min-h-screen animate-pulse">

            {/* Header Area Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pt-2 sm:pt-4">
                <div>
                    <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2" />
                    <div className="h-4 w-64 bg-slate-100 rounded-md" />
                </div>
            </div>

            {/* Modern Tabs Skeleton */}
            <div className="bg-white p-1.5 rounded-2xl flex w-full sm:w-auto sm:max-w-sm mb-6 sm:mb-8 border border-slate-100 shadow-sm">
                <div className="flex-1 h-10 bg-slate-100 rounded-xl" />
                <div className="flex-1 h-10 bg-white rounded-xl" />
            </div>

            <div className="max-w-4xl">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Creation Form Skeleton */}
                    <div className="lg:col-span-3 space-y-6 sm:space-y-8">
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm h-[140px]" />
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm h-[200px]" />
                    </div>

                    {/* Quantity & Cost Skeleton */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm h-[320px]">
                            <div className="h-4 w-20 bg-slate-100 rounded mb-6" />
                            <div className="h-14 w-full bg-slate-50 rounded-2xl mb-6" />
                            <div className="h-20 w-full bg-slate-900/10 rounded-2xl mb-6" />
                            <div className="h-16 w-full bg-slate-200 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
