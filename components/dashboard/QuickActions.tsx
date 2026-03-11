"use client"
import React from 'react';
import { Wifi, Smartphone, Tv, Zap, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickActionsProps {
    onAction: (action: string) => void;
    isLoading?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, isLoading }) => {
    const actions = [
        { icon: Wifi, label: 'Buy Data', bg: 'bg-blue-50', color: 'text-blue-600', key: 'data' },
        { icon: Smartphone, label: 'Airtime', bg: 'bg-emerald-50', color: 'text-emerald-600', key: 'airtime' },
        { icon: Tv, label: 'Cable TV', bg: 'bg-purple-50', color: 'text-purple-600', key: 'cable' },
        { icon: Zap, label: 'Electricity', bg: 'bg-amber-50', color: 'text-amber-600', key: 'electricity' },
        { icon: GraduationCap, label: 'Education', bg: 'bg-indigo-50', color: 'text-indigo-600', key: 'education' },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-5 gap-3 mb-8 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex flex-col items-center py-4 px-2 rounded-2xl bg-white border border-gray-100 h-[100px]">
                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                        <div className="h-2 w-12 bg-gray-50 mt-3 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-8">
            {actions.map((action) => (
                <motion.button
                    key={action.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAction(action.key)}
                    className="flex flex-col items-center justify-center bg-white py-4 px-2 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-100 transition-all group lg:min-h-[100px]"
                >
                    <div className={`${action.bg} ${action.color} p-3 rounded-full mb-2 group-hover:scale-110 transition-transform`}>
                        <action.icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-semibold text-gray-700 text-[10px] sm:text-xs text-center">{action.label}</span>
                </motion.button>
            ))}
        </div>
    );
};
