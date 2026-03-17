"use client"
import React, { useState } from 'react';
import { Wifi, Smartphone, Tv, Zap, GraduationCap, CreditCard, Receipt, ChevronRight } from 'lucide-react';
import { CURRENCY } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionStatus } from '@/types/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const TransactionDetailsModal = dynamic(() => import('../modals/TransactionDetailsModal'), { ssr: false });

interface Transaction {
    id: string;
    type: string;
    amount: number;
    createdAt: string;
    status: string;
    description?: string;
    reference?: string;
    metadata?: any;
}

interface RecentActivityProps {
    transactions: Transaction[];
    isLoading?: boolean;
}

// ── Type display helpers ─────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; icon: any; bg: string; color: string; dot: string }> = {
    DATA:           { label: 'Data Bundle',     icon: Wifi,           bg: 'bg-indigo-50',  color: 'text-indigo-600',  dot: '#6366f1' },
    AIRTIME:        { label: 'Airtime',         icon: Smartphone,     bg: 'bg-emerald-50', color: 'text-emerald-600', dot: '#10b981' },
    CABLE_TV:       { label: 'Cable TV',        icon: Tv,             bg: 'bg-sky-50',     color: 'text-sky-600',     dot: '#0ea5e9' },
    CABLE:          { label: 'Cable TV',        icon: Tv,             bg: 'bg-sky-50',     color: 'text-sky-600',     dot: '#0ea5e9' },
    ELECTRICITY:    { label: 'Electricity',     icon: Zap,            bg: 'bg-amber-50',   color: 'text-amber-600',   dot: '#f59e0b' },
    EDUCATION:      { label: 'Education',       icon: GraduationCap,  bg: 'bg-violet-50',  color: 'text-violet-600',  dot: '#8b5cf6' },
    WALLET_FUNDING: { label: 'Wallet Funding',  icon: CreditCard,     bg: 'bg-green-50',   color: 'text-green-600',   dot: '#16a34a' },
};

const getConfig = (type: string) =>
    TYPE_CONFIG[type.toUpperCase()] ?? { label: type.replace(/_/g, ' '), icon: Receipt, bg: 'bg-gray-50', color: 'text-gray-600', dot: '#9ca3af' };

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
    SUCCESS: { bg: 'bg-emerald-50 border border-emerald-100', text: 'text-emerald-700' },
    FAILED:  { bg: 'bg-red-50 border border-red-100',         text: 'text-red-600' },
    PENDING: { bg: 'bg-amber-50 border border-amber-100',     text: 'text-amber-700' },
};

const getStatusStyle = (status: string) =>
    STATUS_STYLES[status.toUpperCase()] ?? { bg: 'bg-gray-50 border border-gray-100', text: 'text-gray-500' };

// ── Subtitle: pick best short description for each type ───────────────────────

const getSubtitle = (tx: Transaction) => {
    const m = tx.metadata;
    if (!m) return tx.description || '';
    switch (tx.type.toUpperCase()) {
        case 'AIRTIME':
        case 'DATA':
            return [m.network, m.phoneNumber].filter(Boolean).join(' · ');
        case 'ELECTRICITY':
            return [m.provider || m.discoCode, m.meterNumber || m.meterNo].filter(Boolean).join(' · ');
        case 'CABLE_TV':
        case 'CABLE':
            return [m.provider, m.plan || m.planName].filter(Boolean).join(' · ');
        case 'EDUCATION':
            return m.provider || m.examType || '';
        case 'WALLET_FUNDING':
            return m.bankName || m.source || '';
        default:
            return tx.description || '';
    }
};

// ── Map raw dashboard transaction to the Transaction type TransactionDetailsModal expects ──

const toModalTx = (tx: Transaction): any => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    date: tx.createdAt,
    status: (tx.status as TransactionStatus),
    description: tx.description || getConfig(tx.type).label,
    reference: tx.reference,
    metadata: tx.metadata,
});

// ── Component ────────────────────────────────────────────────────────────────

export const RecentActivity: React.FC<RecentActivityProps> = ({ transactions, isLoading }) => {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    if (isLoading) return <RecentActivitySkeleton />;

    return (
        <>
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-50">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            {transactions.length} recent transaction{transactions.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link href="/user/transactions"
                        className="text-primary text-sm font-bold hover:text-blue-700 transition-colors flex items-center gap-1">
                        See All <ChevronRight size={14} />
                    </Link>
                </div>

                {transactions.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {transactions.map((tx, index) => {
                            const cfg = getConfig(tx.type);
                            const Icon = cfg.icon;
                            const isFunding = tx.type.toUpperCase() === 'WALLET_FUNDING';
                            const statusStyle = getStatusStyle(tx.status);
                            const subtitle = getSubtitle(tx);

                            return (
                                <motion.button
                                    key={`${tx.id}-${index}`}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setSelectedTx(tx)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer group text-left"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Icon */}
                                        <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center ${cfg.color} shrink-0`}>
                                            <Icon size={19} strokeWidth={2.5} />
                                        </div>

                                        {/* Text */}
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-gray-900 text-sm">{cfg.label}</p>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${statusStyle.bg} ${statusStyle.text}`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                            {subtitle ? (
                                                <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{subtitle}</p>
                                            ) : null}
                                            <p className="text-[11px] text-gray-300 font-medium mt-0.5">
                                                {new Date(tx.createdAt).toLocaleDateString('en-NG', {
                                                    month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Amount + chevron */}
                                    <div className="flex items-center gap-2 shrink-0 ml-3">
                                        <span className={`font-black text-sm ${isFunding ? 'text-emerald-600' : 'text-gray-900'}`}>
                                            {isFunding ? '+' : '-'}{CURRENCY}{Number(tx.amount).toLocaleString()}
                                        </span>
                                        <ChevronRight size={15} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                ) : (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="py-14 text-center">
                            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                <Receipt size={22} className="text-gray-300" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium">No transactions yet</p>
                            <p className="text-gray-300 text-xs mt-1">Your activity will appear here</p>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Transaction detail modal */}
            {selectedTx && (
                <TransactionDetailsModal
                    isOpen={!!selectedTx}
                    onClose={() => setSelectedTx(null)}
                    transaction={toModalTx(selectedTx)}
                />
            )}
        </>
    );
};

// ── Skeleton ─────────────────────────────────────────────────────────────────

export const RecentActivitySkeleton = () => (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8 animate-pulse">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-50">
            <div>
                <div className="h-4 w-32 bg-gray-100 rounded-md mb-1.5" />
                <div className="h-2.5 w-20 bg-gray-50 rounded-md" />
            </div>
            <div className="h-4 w-14 bg-gray-50 rounded-md" />
        </div>
        <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gray-50 shrink-0" />
                        <div>
                            <div className="h-3.5 w-28 bg-gray-100 rounded-md mb-2" />
                            <div className="h-2.5 w-20 bg-gray-50 rounded-md" />
                        </div>
                    </div>
                    <div className="h-4 w-16 bg-gray-100 rounded-md" />
                </div>
            ))}
        </div>
    </div>
);
