"use client"
import React, { useState } from 'react';
import {
  User, Shield, Bell, LogOut, ChevronRight, HelpCircle,
  CheckCircle2, AlertCircle, Copy, Wallet, ExternalLink
} from 'lucide-react';
import { initializeGatewayFunding } from '@/app/actions/payment';
import { logoutUser } from '@/app/actions/auth/logout';
import KYCModal from '@/components/modals/KYCModal';
import { CURRENCY } from '@/constants';

interface ProfileProps {
  initialUser?: {
    fullName: string;
    email: string;
    isKycVerified: boolean;
    kycData?: {
      status: string;
      virtualAccountNumber?: string;
      bankName?: string;
    };
    walletBalance: number;
  }
}

const Profile: React.FC<ProfileProps> = ({ initialUser }) => {
  if (!initialUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium text-sm">Loading profile...</p>
      </div>
    );
  }

  const [isKYCOpen, setIsKYCOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fundingAmount, setFundingAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  const [error, setError] = useState('');

  const handleCopyAccount = () => {
    const acc = initialUser.kycData?.virtualAccountNumber;
    if (acc) {
      navigator.clipboard.writeText(acc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFundWithCard = async () => {
    const amount = Number(fundingAmount);
    if (!fundingAmount || isNaN(amount) || amount < 100) {
      setError("Minimum funding amount is " + CURRENCY + "100");
      return;
    }

    setIsFunding(true);
    setError('');

    const result = await initializeGatewayFunding(amount);

    if (result.success && result.paymentLink) {
      window.open(result.paymentLink, '_blank');
      setFundingAmount('');
    } else {
      setError(result.error || 'Could not initialize payment');
    }
    setIsFunding(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 sm:px-6 pt-8 bg-gray-50 min-h-screen">

      {/* 1. Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl ring-4 ring-white">
            {initialUser.fullName?.charAt(0) || <User size={40} />}
          </div>
          {initialUser.isKycVerified && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
              <CheckCircle2 size={24} className="text-blue-500" fill="currentColor" color="white" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">{initialUser.fullName}</h2>
        <p className="text-gray-500 text-sm font-medium mb-4">{initialUser.email}</p>

        {/* KYC Badge */}
        <button
          onClick={() => !initialUser.isKycVerified && setIsKYCOpen(true)}
          disabled={initialUser.isKycVerified}
          className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${initialUser.isKycVerified
              ? 'bg-green-50 text-emerald-700 border border-green-100 cursor-default'
              : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 shadow-sm'
            }`}
        >
          {initialUser.isKycVerified
            ? <><CheckCircle2 size={14} className="text-emerald-500" /> KYC Verified</>
            : <><AlertCircle size={14} className="text-orange-500" /> Action Required: Verify Identity</>
          }
        </button>
      </div>

      {/* 2. Wallet Funding Section */}
      <div className="bg-blue-600 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-blue-600/20 relative overflow-hidden">
        {/* Abstract Background Elements (Optional: remove these if you want it completely flat) */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6 text-blue-100">
            <Wallet size={18} />
            <span className="text-sm font-semibold tracking-wide uppercase">Add Money</span>
          </div>

          {initialUser.isKycVerified && initialUser.kycData?.virtualAccountNumber ? (
            <div>
              <p className="text-xs text-blue-200 mb-2 font-semibold uppercase tracking-wider">Bank Transfer Details</p>
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div>
                  <h3 className="text-2xl font-mono font-bold tracking-wider mb-1">{initialUser.kycData.virtualAccountNumber}</h3>
                  <p className="text-xs text-blue-200 font-medium">{initialUser.kycData.bankName} • DATA PADI {initialUser.fullName}</p>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors active:scale-95"
                >
                  {copied ? <CheckCircle2 size={20} className="text-green-300" /> : <Copy size={20} className="text-white" />}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm mb-4 text-blue-100 font-medium">Fund via Card or USSD instantly.</p>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-2 rounded-lg text-xs mb-4 font-medium flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/20 mb-4 flex items-center">
                <div className="px-4 font-bold text-xl text-blue-100">{CURRENCY}</div>
                <input
                  type="number"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  placeholder="Min 100"
                  className="flex-1 bg-transparent border-none text-white text-xl font-bold outline-none placeholder:text-blue-300/50"
                />
              </div>
              <button
                disabled={isFunding}
                onClick={handleFundWithCard}
                className="w-full bg-white text-blue-700 h-14 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-gray-50 active:scale-95 transition-all shadow-md"
              >
                {isFunding ? 'Processing...' : <><ExternalLink size={18} /> Pay with Flutterwave</>}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* 3. Settings & Links Menu */}
      <h3 className="text-sm font-bold text-gray-900 mb-3 px-2 uppercase tracking-wider">Preferences</h3>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="divide-y divide-gray-50">

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                <Shield size={18} />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Security & Passwords</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                <Bell size={18} />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Notifications</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                <HelpCircle size={18} />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Help & Support</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

        </div>
      </div>

      {/* 4. Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-white border border-red-100 flex items-center justify-center gap-2 p-4 rounded-2xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors shadow-sm font-bold text-sm"
      >
        <LogOut size={18} />
        Log Out
      </button>

      {/* Modals */}
      <KYCModal isOpen={isKYCOpen} onClose={() => setIsKYCOpen(false)} />
    </div>
  );
};

export default Profile;