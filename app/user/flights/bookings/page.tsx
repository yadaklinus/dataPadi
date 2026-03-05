"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plane, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { getUserFlights } from '@/app/actions/flight';
import BottomNav from '@/components/layout/BottomNav';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function UserFlightBookings() {
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await getUserFlights();
            if (res.success) {
                setRequests(res.data || []);
            } else {
                setError(res.error || 'Failed to fetch bookings');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'FUTURE_HELD':
            case 'PENDING':
                return {
                    label: 'Finding Best Price',
                    color: 'text-amber-700 bg-amber-50',
                    icon: <Loader2 size={16} className="animate-spin" />,
                    message: "We are currently sourcing the best prices for you. Check back shortly."
                };
            case 'OPTIONS_PROVIDED':
                return {
                    label: 'Action Required',
                    color: 'text-blue-700 bg-blue-50',
                    icon: <AlertCircle size={16} />,
                    message: "Flight options are ready. Please select one."
                };
            case 'QUOTED':
                return {
                    label: 'Payment Pending',
                    color: 'text-rose-700 bg-rose-50',
                    icon: <AlertCircle size={16} />,
                    message: "Seat locked! Please complete payment."
                };
            case 'PAID_PROCESSING':
                return {
                    label: 'Processing Ticket',
                    color: 'text-indigo-700 bg-indigo-50',
                    icon: <Loader2 size={16} className="animate-spin" />,
                    message: "Payment received. Issuing your ticket."
                };
            case 'TICKETED':
                return {
                    label: 'Ticketed',
                    color: 'text-emerald-700 bg-emerald-50',
                    icon: <CheckCircle size={16} />,
                    message: "Your e-ticket is ready for download."
                };
            default:
                return {
                    label: status,
                    color: 'text-slate-700 bg-slate-100',
                    icon: <Clock size={16} />,
                    message: ""
                };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center pb-32">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-[3px] border-slate-200 rounded-full" />
                    <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Plane className="text-slate-800" size={20} />
                    </div>
                </div>
                <p className="text-slate-500 text-sm mt-6 font-medium tracking-widest uppercase">Fetching Bookings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] relative pb-32 font-sans selection:bg-slate-800 selection:text-white">
            {/* Premium Header */}
            <div className="relative bg-slate-900 pt-16 pb-28 px-6 overflow-hidden rounded-b-[2.5rem] shadow-2xl z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 flex flex-col items-start mt-4">
                    <h1 className="text-3xl font-light text-white tracking-tight mb-2 flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                            <Clock className="text-white" size={24} />
                        </div>
                        <span className="font-semibold">My Flights</span>
                    </h1>
                    <p className="text-slate-300 font-medium text-sm mt-3 max-w-sm leading-relaxed tracking-wide">
                        Manage your premium flight requests and past bookings.
                    </p>
                </div>
            </div>

            <div className="px-5 -mt-20 relative z-20">
                {error ? (
                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-red-100/50 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5 border border-red-100">
                            <AlertCircle className="text-red-500" size={28} />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-xl tracking-tight mb-2">Could not load flights</h3>
                        <p className="text-slate-500 text-sm max-w-xs">{error}</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white"></div>
                            <Plane className="text-slate-800 relative z-10" size={28} />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-2xl tracking-tight mb-3">No Itineraries Found</h3>
                        <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                            You haven't requested any flights yet. Let's find your next premium journey.
                        </p>
                        <button
                            onClick={() => router.push('/user/flights')}
                            className="bg-slate-900 text-white font-semibold flex items-center gap-3 h-14 px-8 rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all duration-300 active:scale-95 tracking-wide"
                        >
                            <Plane size={18} /> Book a Flight
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {requests.map((req, index) => {
                            const badge = getStatusBadge(req.status);
                            const tDate = new Date(req.targetDate);

                            return (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => router.push(`/user/flights/bookings/${req.id}`)}
                                    className="group bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/60 p-6 cursor-pointer transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-150" />

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-3xl font-light text-slate-900 tracking-tight">{req.origin}</span>
                                                <Plane size={16} className="text-slate-300 transform rotate-90" />
                                                <span className="text-3xl font-light text-slate-900 tracking-tight">{req.destination}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-slate-300" />
                                                    <span className="text-slate-600">{format(tDate, 'dd MMM, yy')}</span>
                                                </div>
                                                {req.tripType === 'ROUND_TRIP' && req.returnDate && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-slate-300 opacity-50">•</span>
                                                        <Calendar size={13} className="text-slate-300 ml-2" />
                                                        <span className="text-slate-600">{format(new Date(req.returnDate), 'dd MMM, yy')}</span>
                                                    </div>
                                                )}
                                                <div className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] ml-auto border ${req.tripType === 'ROUND_TRIP' ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                    {req.tripType === 'ROUND_TRIP' ? 'Round Trip' : 'One Way'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${badge.label === 'Action Required' || badge.label === 'Payment Pending' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                badge.label === 'Ticketed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                    badge.label === 'Processing Ticket' ? 'bg-slate-900 border-slate-800 text-white' :
                                                        'bg-slate-50 border-slate-200 text-slate-600'
                                            }`}>
                                            {badge.icon}
                                            {badge.label}
                                        </div>
                                    </div>

                                    {badge.message && (
                                        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 mt-4 flex items-start gap-3">
                                            <div className="bg-white p-1 rounded-md border border-slate-100 shadow-sm">
                                                <AlertCircle size={14} className="text-slate-500 shrink-0" />
                                            </div>
                                            <p className="text-[13px] text-slate-600 font-medium leading-snug pt-0.5">
                                                {badge.message}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <span>ID: {req.id.slice(0, 8)}</span>
                                        <span className="text-slate-900 flex items-center gap-1.5 group-hover:text-slate-600 transition-colors">
                                            Details <Plane size={12} className="transform rotate-45" />
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
