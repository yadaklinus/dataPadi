'use client';

import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600">
          <AlertCircle size={40} />
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-500 font-medium mb-8">
          An unexpected error occurred. Our team has been notified and we're working to fix it.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-slate-900 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full bg-white text-slate-600 border border-slate-200 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-slate-900 rounded-xl text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-400 break-all">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
