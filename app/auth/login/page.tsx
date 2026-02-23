"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { loginUser } from '@/app/actions/auth/login';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const handleLogin = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Calling the Server Action directly
      const result = await loginUser(formData);
      
      if (result.success) {
        router.push('/user/dashboard');
        router.refresh(); // Refresh to ensure server-side auth state updates
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
    <div className="flex flex-col justify-center min-h-screen p-8 bg-slate-50">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="mb-10">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-2xl">DP</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Sign in to continue to DataPadi</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-3 text-sm font-semibold">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            type="email"
            leftIcon={<Mail size={18} />}
            required
          />

          <div className="space-y-1">
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
                  className="focus:outline-none text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              required
            />
            <div className="flex justify-end mt-2">
              <button type="button" className="text-xs text-blue-600 font-bold">
                Forgot Password?
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-4 gap-2">
            Sign In <ArrowRight size={18} />
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center text-sm">
          <p className="text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;