"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Plane, 
    ArrowLeft, 
    Wallet, 
    Calendar, 
    ChevronRight, 
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Building2,
    Clock,
    CheckCircle2,
    XCircle,
    Receipt
} from 'lucide-react';
import { format } from 'date-fns';
import BottomNav from '@/components/layout/BottomNav';

interface FlightTransaction {
    id: string;
    amount: string;
    type: 'PAYMENT' | 'REFUND';
    reference: string;
    createdAt: string;
    flightRequest: {
        origin: string;
        destination: string;
        airlineName: string;
        pnr: string;
        status: string;
    };
}

interface FlightTransactionsClientProps {
    initialTransactions: FlightTransaction[];
}

export default function FlightTransactionsClient({ initialTransactions }: FlightTransactionsClientProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'PAYMENT' | 'REFUND'>('ALL');

    const filteredTransactions = initialTransactions.filter(tx => {
        const matchesSearch = 
            tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.flightRequest.airlineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.flightRequest.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.flightRequest.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.flightRequest.pnr?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'ALL' || tx.type === filter;
        
        return matchesSearch && matchesFilter;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'TICKETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PAID_PROCESSING': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            case 'REFUNDED': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'EXPIRED': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32">
            {/* Header Section */}
            <div className="bg-slate-900 text-white px-6 pt-16 pb-24 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <button 
                            onClick={() => router.back()} 
                            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Flight History</h1>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.1em] mt-0.5">Airplane Transactions</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 backdrop-blur-md focus-within:bg-white/10 transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search PNR, Airline, Route..."
                                className="bg-transparent border-none focus:ring-0 text-sm w-full h-12 text-white placeholder:text-slate-500 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Filter size={18} className="text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="px-6 -mt-8 relative z-20 flex gap-2">
                {(['ALL', 'PAYMENT', 'REFUND'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                            filter === f 
                            ? 'bg-white text-slate-900 scale-105' 
                            : 'bg-slate-800/80 text-white/60 border border-white/5 backdrop-blur-md'
                        }`}
                    >
                        {f === 'ALL' ? 'Everything' : f + 's'}
                    </button>
                ))}
            </div>

            {/* Transaction List */}
            <div className="px-6 mt-10">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-slate-900 font-bold text-lg">Activity</h2>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{filteredTransactions.length} Items</span>
                </div>

                <div className="space-y-4">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => (
                            <div 
                                key={tx.id}
                                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                        tx.type === 'REFUND' ? 'bg-emerald-50' : 'bg-slate-50'
                                    }`}>
                                        {tx.type === 'REFUND' ? (
                                            <ArrowDownLeft className="text-emerald-600" size={24} />
                                        ) : (
                                            <Plane className="text-slate-700 -rotate-45" size={24} />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-900 truncate">
                                                {tx.flightRequest.airlineName} 
                                                <span className="text-slate-400 font-medium ml-1">· {tx.flightRequest.origin} → {tx.flightRequest.destination}</span>
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                PNR: {tx.flightRequest.pnr || 'N/A'}
                                            </span>
                                            <span className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-full border ${getStatusStyles(tx.flightRequest.status)}`}>
                                                {tx.flightRequest.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className={`text-lg font-bold tracking-tight ${tx.type === 'REFUND' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {tx.type === 'REFUND' ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
                                        </div>
                                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
                                            {format(new Date(tx.createdAt), 'MMM dd, HH:mm')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Receipt className="text-slate-300" size={32} />
                            </div>
                            <h3 className="text-slate-900 font-bold text-lg mb-2">No Transactions Found</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                Once you start booking flights, your payment and refund history will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
