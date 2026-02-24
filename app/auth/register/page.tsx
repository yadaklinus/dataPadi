"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { registerUser } from '@/app/actions/auth/regiter';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (!result.success) {
      setError(result.error || 'Something went wrong');
      setIsLoading(false);
    } else {
      setSuccess(result.message || 'Account created successfully!');
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center py-12 px-6 bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">

      {/* Animated Background Gradients (Consistent with Login/Landing) */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-300 rounded-full blur-[140px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] mix-blend-multiply animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Zap size={26} fill="currentColor" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">DataPadi</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create an Account</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Fast, Secure & Automated</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

          {(error || success) && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`mb-8 p-4 border rounded-2xl flex items-start gap-4 text-sm font-bold ${error ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}
            >
              {error ? <AlertCircle size={20} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
              <p>{error || success}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                name="userName"
                label="Full Name"
                placeholder="John Doe"
                type="text"
                required
                leftIcon={<User size={18} />}
                className="[&>input]:rounded-2xl"
              />
              <Input
                name="phoneNumber"
                label="Phone Number"
                placeholder="08012345678"
                type="tel"
                required
                leftIcon={<Phone size={18} />}
                className="[&>input]:rounded-2xl"
              />
            </div>

            <Input
              name="email"
              label="Email Address"
              placeholder="john@example.com"
              type="email"
              required
              leftIcon={<Mail size={18} />}
              className="[&>input]:rounded-2xl"
            />

            <Input
              name="password"
              label="Password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              required
              leftIcon={<Lock size={18} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              className="[&>input]:rounded-2xl"
            />

            <Button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-[1.5rem] mt-4 shadow-xl shadow-slate-900/10 transition-all flex justify-center items-center gap-2 group text-lg"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create My Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account? {' '}
              <Link href="/auth/login" className="text-blue-600 font-black hover:underline px-1">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}