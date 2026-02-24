"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { loginUser } from '@/app/actions/auth/login';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginUser(formData);

      if (result.success) {
        router.push('/user/dashboard');
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-6 bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">

      {/* Animated Background Gradients (Same as Landing Page) */}
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
        {/* Branding / Back Link */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Zap size={26} fill="currentColor" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">DataPadi</span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sign in to your account</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative group">
          {/* Subtle decoration */}
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

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              type="email"
              leftIcon={<Mail size={18} />}
              required
              className="[&>input]:rounded-2xl"
            />

            <div className="space-y-2">
              <Input
                name="password"
                label="Password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
                className="[&>input]:rounded-2xl"
              />
              <div className="flex justify-end pt-1">
                <Link href="/forgot-password" title="Coming Soon" className="text-xs text-blue-600 font-black tracking-wide hover:underline uppercase">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="h-14 mt-6 rounded-[1.5rem] bg-blue-600 hover:bg-slate-900 text-white shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 text-lg font-bold"
            >
              Sign In <ArrowRight size={20} />
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              New to DataPadi?{' '}
              <Link href="/auth/register" className="text-blue-600 font-black hover:underline px-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;