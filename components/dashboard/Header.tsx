"use client"
import React from 'react';

interface HeaderProps {
    fullName: string;
    tier: string;
    isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ fullName, tier, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex justify-between items-center mb-6 pt-6 animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100" />
                    <div>
                        <div className="h-5 w-32 bg-gray-100 rounded-md mb-2" />
                        <div className="h-3 w-20 bg-gray-50 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center mb-6 pt-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm border-2 border-white">
                    {fullName.charAt(0)}
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                        Hi, {fullName.split(' ')[0]} 👋
                    </h1>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                        {tier.replace('_', ' ')}
                    </span>
                </div>
            </div>
        </div>
    );
};
