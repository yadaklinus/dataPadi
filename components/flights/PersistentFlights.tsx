"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plane, Loader2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFlightLink } from '@/app/actions/flight';
import { usePathname } from 'next/navigation';

export default function PersistentFlights() {
    const pathname = usePathname();
    const isVisible = pathname === '/user/flights';
    
    const [url, setUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const fetchLink = async () => {
        setIsLoading(true);
        setError(null);
        setUrl(null);
        setIframeLoading(true);

        const result = await getFlightLink();

        setIsLoading(false);

        if (result.success && result.url) {
            setUrl(result.url);
        } else {
            setError(result.error || 'Failed to load the flight booking page.');
        }
    };

    useEffect(() => {
        fetchLink();
    }, []);

    // We keep the component mounted but hidden when not on the flights page
    return (
        <div 
            className={`flex flex-col h-screen bg-slate-950 fixed inset-0 z-[40] transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={{ display: isVisible || url ? 'flex' : 'none' }}
        >
            {/* Slim header bar */}
            <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-slate-900 border-b border-slate-800 shrink-0 z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                        <Plane size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm leading-none">Flights</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-0.5">Book & manage flights</p>
                    </div>
                </div>

                {url && (
                    <div className="flex items-center gap-2">
                        {/* Reload */}
                        <button
                            onClick={() => { setIframeLoading(true); iframeRef.current?.contentWindow?.location.reload(); }}
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
                        >
                            <RefreshCw size={14} className="text-slate-400" />
                        </button>
                        {/* Open in browser */}
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
                        >
                            <ExternalLink size={14} className="text-slate-400" />
                        </a>
                    </div>
                )}
            </div>

            {/* Main content area */}
            <div className="flex-1 relative overflow-hidden pb-20">

                {/* Loading flight link */}
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-20"
                        >
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Plane size={32} className="text-white/60" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Loader2 size={14} className="animate-spin text-white" />
                                </div>
                            </div>
                            <p className="text-white font-semibold text-base">Connecting to booking portal...</p>
                            <p className="text-slate-500 text-sm mt-1">Please wait a moment</p>
                        </motion.div>
                    )}

                    {/* Error state */}
                    {!isLoading && error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-20 px-8"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                                <AlertCircle size={32} className="text-red-400" />
                            </div>
                            <p className="text-white font-bold text-lg text-center mb-2">Couldn't load flights</p>
                            <p className="text-slate-400 text-sm text-center mb-8 leading-relaxed">{error}</p>
                            <button
                                onClick={fetchLink}
                                className="flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-slate-50 transition-colors active:scale-95"
                            >
                                <RefreshCw size={16} /> Try Again
                            </button>
                        </motion.div>
                    )}

                    {/* iframe loading overlay (while url is set but iframe hasn't painted) */}
                    {!isLoading && url && iframeLoading && (
                        <motion.div
                            key="iframe-loading"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 pointer-events-none"
                        >
                            <Loader2 size={28} className="animate-spin text-blue-400 mb-3" />
                            <p className="text-slate-400 text-sm font-medium">Loading booking page...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* The iframe */}
                {url && (
                    <iframe
                        ref={iframeRef}
                        src={url}
                        title="Flight Booking"
                        className="w-full h-full border-0"
                        onLoad={() => setIframeLoading(false)}
                        allow="payment; geolocation; clipboard-write"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
                    />
                )}
            </div>
        </div>
    );
}
