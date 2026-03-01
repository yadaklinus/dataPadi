"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, AlertCircle, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { forgotPassword } from '@/app/actions/auth/password-reset';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const ForgotPassword = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        try {
            const result = await forgotPassword(formData);

            if (result.success) {
                setSuccess(result.message || 'OTP sent successfully!');
                // Redirect to verify OTP after a short delay
                setTimeout(() => {
                    router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
                }, 2000);
            } else {
                setError(result.error || 'Failed to request OTP');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center p-6 bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">

            {/* Animated Background Gradients */}
            <div className="absolute inset-0 -z-10 opacity-30">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400 rounded-full blur-[140px] mix-blend-multiply animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200 rounded-full blur-[120px] mix-blend-multiply animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Branding */}
                <div className="mb-12 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30 group-hover:scale-105 transition-transform">
                            <Zap size={26} fill="currentColor" />
                        </div>
                        <span className="font-black text-2xl tracking-tight text-slate-900">Mufti Pay</span>
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Forgot Password</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Enter your email to receive an OTP</p>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative group">
                    <div className="absolute top-6 right-6 w-3 group-hover:w-12 h-1.5 bg-blue-600 rounded-full transition-all duration-500" />

                    {error && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-8 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-4 text-sm font-bold shadow-sm"
                        >
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-8 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl flex items-start gap-4 text-sm font-bold shadow-sm"
                        >
                            <Zap size={20} className="shrink-0 mt-0.5 text-emerald-600" />
                            <p>{success}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            name="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            type="email"
                            leftIcon={<Mail size={18} />}
                            required
                            className="[&>input]:rounded-2xl"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={isLoading}
                            className="h-14 mt-6 rounded-[1.5rem] bg-blue-600 hover:bg-slate-900 text-white shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 text-lg font-bold"
                        >
                            Send OTP <ArrowRight size={20} />
                        </Button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                        <Link href="/auth/login" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors uppercase tracking-widest text-xs">
                            <ArrowLeft size={16} /> Back to Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
