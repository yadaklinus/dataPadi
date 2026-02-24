import React from 'react';
import { Search, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <Search size={40} />
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">404</h1>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
                <p className="text-slate-500 font-medium mb-8">
                    The page you're looking for doesn't exist or has been moved to a new location.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="w-full bg-blue-600 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-200"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>

                    <Link
                        href="/auth/register"
                        className="w-full bg-white text-slate-600 border border-slate-200 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                    >
                        Create Account
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
