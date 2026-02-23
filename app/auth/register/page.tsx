"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerUser } from '@/app/actions/auth/regiter';

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
    
    // Call the secure Server Action (acting as your BFF)
    const result = await registerUser(formData);

    if (!result.success) {
      setError(result.error || 'Something went wrong');
      setIsLoading(false);
    } else {
      setSuccess(result.message || 'Account created successfully!');
      // Redirect to login after a short delay so the user sees the success message
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <span className="text-2xl font-black tracking-tighter">DP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create an Account</h1>
          <p className="text-sm text-slate-500">Join Data Padi to start transacting</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-start gap-3 text-sm font-medium">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-100 rounded-xl flex items-start gap-3 text-sm font-medium">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name / userName */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-slate-400" size={18} />
              <input 
                name="userName"
                type="text" 
                required
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-400" size={18} />
              <input 
                name="email"
                type="email" 
                required
                placeholder="john@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-4 text-slate-400" size={18} />
              <input 
                name="phoneNumber"
                type="tel" 
                required
                placeholder="08012345678"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-400" size={18} />
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Create a strong password"
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !!success}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-6 shadow-lg shadow-blue-600/20 active:scale-[0.98] hover:bg-blue-700 transition-all disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account? <a href="/auth/login" className="text-blue-600 font-bold hover:underline">Log in</a>
        </p>

      </div>
    </div>
  );
}