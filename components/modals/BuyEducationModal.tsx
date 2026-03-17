"use client"
import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import PinInput from '../ui/PinInput';
import { CURRENCY } from '@/constants';
import { Phone, CheckCircle, AlertCircle, Loader2, GraduationCap, FileText, User, Lock, Shield, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyJambProfile, buyEducationPin } from '@/app/actions/vtu';

interface BuyEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type Provider = 'WAEC' | 'JAMB' | 'JAMB_MOCK';
type Step = 'PROVIDER' | 'DETAILS' | 'CONFIRM' | 'PIN' | 'SUCCESS';

const EDUCATION_PRODUCTS: Record<Provider, {
  name: string; price: number; examType: string;
  color: string; lightColor: string; subtitle: string;
}> = {
  WAEC: {
    name: 'WAEC Result Checker',
    price: 3500,
    examType: 'waecdirect',
    color: '#10b981',
    lightColor: '#ecfdf5',
    subtitle: 'Check WAEC/WASSCE results instantly',
  },
  JAMB: {
    name: 'JAMB UTME (No Mock)',
    price: 6200,
    examType: 'utme-no-mock',
    color: '#6366f1',
    lightColor: '#eef2ff',
    subtitle: 'UTME registration without mock exam',
  },
  JAMB_MOCK: {
    name: 'JAMB UTME (With Mock)',
    price: 7700,
    examType: 'utme-mock',
    color: '#8b5cf6',
    lightColor: '#f5f3ff',
    subtitle: 'UTME registration including mock exam',
  },
};

const PROVIDER_ICONS: Record<Provider, typeof FileText> = {
  WAEC: FileText,
  JAMB: GraduationCap,
  JAMB_MOCK: GraduationCap,
};

const BuyEducationModal: React.FC<BuyEducationModalProps> = ({ isOpen, onClose, onRefresh }) => {
  const [step, setStep] = useState<Step>('PROVIDER');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [phoneNo, setPhoneNo] = useState('');
  const [profileId, setProfileId] = useState('');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [transactionPin, setTransactionPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionData, setTransactionData] = useState<any>(null);

  const product = provider ? EDUCATION_PRODUCTS[provider] : null;
  const isJamb = provider === 'JAMB' || provider === 'JAMB_MOCK';
  const pc = product?.color ?? '#6366f1';

  const reset = () => {
    setStep('PROVIDER');
    setProvider(null);
    setPhoneNo('');
    setProfileId('');
    setVerifiedName(null);
    setIsPurchasing(false);
    setIsVerifying(false);
    setTransactionPin('');
    setErrorMessage('');
    setTransactionData(null);
  };

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  useEffect(() => {
    if (isJamb && profileId.length === 10 && !verifiedName && !isVerifying) {
      handleVerifyProfile();
    } else if (profileId.length !== 10) {
      setVerifiedName(null);
    }
  }, [profileId, provider]);

  const handleVerifyProfile = async () => {
    if (profileId.length !== 10) return;
    setIsVerifying(true);
    setErrorMessage('');
    setVerifiedName(null);
    const result = await verifyJambProfile(profileId);
    setIsVerifying(false);
    if (result.success && result.data?.customer_name) {
      setVerifiedName(result.data.customer_name);
    } else {
      setErrorMessage(result.error || 'Failed to verify Profile ID.');
    }
  };

  const handleProceedToConfirm = () => {
    setErrorMessage('');
    if (phoneNo.length < 10) { setErrorMessage('Please enter a valid phone number'); return; }
    if (isJamb && (!verifiedName || profileId.length !== 10)) {
      setErrorMessage('Please enter and verify a valid JAMB Profile ID first');
      return;
    }
    setStep('CONFIRM');
  };

  const handlePurchase = async (pinToUse: string) => {
    if (!provider) return;
    if (pinToUse.length !== 4) { setErrorMessage('Please enter a valid 4-digit PIN'); return; }
    setIsPurchasing(true);
    setErrorMessage('');
    const backendProvider = isJamb ? 'JAMB' : 'WAEC';
    const passedProfileId = isJamb ? profileId : undefined;
    const result = await buyEducationPin(backendProvider, product!.examType, phoneNo, pinToUse, passedProfileId);
    setIsPurchasing(false);
    if (result.success) {
      setTransactionData({ status: result.status, details: result.data?.cardDetails, message: result.message });
      setStep('SUCCESS');
      if (onRefresh) onRefresh();
    } else {
      setErrorMessage(result.error || 'Transaction failed. Please try again.');
      setTransactionPin('');
    }
  };

  const getOnBack = () => {
    if (step === 'DETAILS') return () => { setStep('PROVIDER'); setErrorMessage(''); };
    if (step === 'CONFIRM') return () => setStep('DETAILS');
    if (step === 'PIN')     return () => { setStep('CONFIRM'); setTransactionPin(''); setErrorMessage(''); };
    return undefined;
  };

  const canProceed = phoneNo.length >= 10 && (!isJamb || !!verifiedName);

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} onBack={getOnBack()}
      title={step === 'SUCCESS' ? 'Transaction Status' : 'Education Payment'}>
      <div className="h-[88svh] w-full flex flex-col">

        {/* Error Banner */}
        <AnimatePresence>
          {errorMessage && step !== 'SUCCESS' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-sm font-medium mb-4 flex items-start gap-3 border border-red-100 shrink-0">
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STEP 1: PROVIDER ── */}
        {step === 'PROVIDER' && (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 h-full w-full">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Service</p>
            <div className="space-y-3">
              {(Object.keys(EDUCATION_PRODUCTS) as Provider[]).map((prov, i) => {
                const info = EDUCATION_PRODUCTS[prov];
                const Icon = PROVIDER_ICONS[prov];
                return (
                  <motion.button
                    key={prov}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setProvider(prov); setErrorMessage(''); setStep('DETAILS'); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 bg-white transition-all hover:border-gray-200 text-left"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: info.lightColor }}>
                      <Icon size={22} style={{ color: info.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{info.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{info.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-base" style={{ color: info.color }}>
                        {CURRENCY}{info.price.toLocaleString()}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: DETAILS ── */}
        {step === 'DETAILS' && product && (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 h-full w-full">

            {/* Selected service card */}
            <div className="rounded-3xl overflow-hidden mb-5 border-2"
              style={{ borderColor: pc + '30', backgroundColor: pc + '08' }}>
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${pc}80, ${pc})` }} />
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: product.lightColor }}>
                  {React.createElement(PROVIDER_ICONS[provider!], { size: 18, style: { color: pc } })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.subtitle}</p>
                </div>
                <p className="font-black text-lg shrink-0" style={{ color: pc }}>
                  {CURRENCY}{product.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">

              {/* JAMB Profile ID */}
              {isJamb && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">JAMB Profile ID</p>
                  <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
                    <User size={16} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={profileId}
                      onChange={(e) => { setProfileId(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
                      placeholder="10-digit Profile ID"
                      className="flex-1 bg-transparent outline-none text-gray-900 font-semibold text-base placeholder-gray-300"
                    />
                    {isVerifying && <Loader2 size={16} className="animate-spin text-blue-400 shrink-0" />}
                    {verifiedName && <Check size={16} className="text-emerald-500 shrink-0" />}
                  </div>

                  <AnimatePresence>
                    {isVerifying && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-xs text-blue-500 font-medium mt-2 px-1">
                        Verifying Profile ID...
                      </motion.p>
                    )}
                    {verifiedName && !isVerifying && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                        <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                        <span className="text-sm font-bold text-emerald-700">{verifiedName}</span>
                      </motion.div>
                    )}
                    {profileId.length === 10 && !verifiedName && !isVerifying && !errorMessage && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <button onClick={handleVerifyProfile}
                          className="text-xs font-bold mt-2 px-3 py-1.5 rounded-xl border-2 ml-1"
                          style={{ borderColor: pc + '40', color: pc, backgroundColor: pc + '08' }}>
                          Verify Manually
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Phone Number */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</p>
                <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: pc }}>
                    <Phone size={14} className="text-white" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    value={phoneNo}
                    onChange={(e) => { setPhoneNo(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
                    placeholder="08012345678"
                    className="flex-1 bg-transparent outline-none text-gray-900 font-semibold text-base placeholder-gray-300"
                  />
                  {phoneNo.length >= 10 && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3 shrink-0">
              <Button fullWidth disabled={!canProceed} onClick={handleProceedToConfirm}
                className="h-14 text-base rounded-2xl shadow-md font-semibold">
                {!phoneNo || phoneNo.length < 10
                  ? 'Enter Phone Number'
                  : isJamb && !verifiedName
                  ? 'Verify Profile ID First'
                  : `Proceed — ${CURRENCY}${product.price.toLocaleString()}`}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: CONFIRM ── */}
        {step === 'CONFIRM' && product && provider && (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 h-full w-full">

            <div className="bg-white border border-gray-100 shadow-lg rounded-3xl overflow-hidden mb-6">
              <div className="h-2 w-full" style={{ background: `linear-gradient(to right, ${pc}80, ${pc})` }} />
              <div className="p-5 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
                  style={{ backgroundColor: product.lightColor }}>
                  {React.createElement(PROVIDER_ICONS[provider], { size: 26, style: { color: pc } })}
                </div>
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-widest">You are purchasing</p>
                <p className="font-bold text-gray-900 text-base mb-1">{product.name}</p>
                <p className="font-black text-5xl mb-4" style={{ color: pc }}>
                  {CURRENCY}{product.price.toLocaleString()}
                </p>
                <div className="border-t-2 border-dashed border-gray-100 relative my-4">
                  <div className="absolute -left-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                  <div className="absolute -right-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                </div>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Phone</span>
                    <span className="font-mono font-bold text-gray-900">{phoneNo}</span>
                  </div>
                  {isJamb && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Profile ID</span>
                        <span className="font-mono font-bold text-gray-900">{profileId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Name</span>
                        <span className="font-bold text-gray-900 text-right max-w-[55%]">{verifiedName}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-2 shrink-0">
              <Button fullWidth onClick={() => setStep('PIN')} disabled={isPurchasing}
                className="h-14 text-base rounded-2xl shadow-md font-semibold">
                Proceed to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: PIN ── */}
        {step === 'PIN' && product && (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 h-full w-full">
            <div className="flex-1 flex flex-col items-center justify-center -mt-8 px-2">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.12)]">
                  <Lock size={32} className="text-blue-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                  <Shield size={13} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Authorize Payment</h3>
              <p className="text-sm text-slate-400 mb-2 text-center px-6">Enter your 4-digit PIN to confirm</p>
              <div className="rounded-2xl px-5 py-2.5 mb-8 border"
                style={{ backgroundColor: pc + '12', borderColor: pc + '30' }}>
                <p className="font-black text-lg text-center" style={{ color: pc }}>
                  {CURRENCY}{product.price.toLocaleString()}
                </p>
                <p className="text-xs text-center font-medium text-gray-500">{product.name}</p>
              </div>
              <PinInput length={4} value={transactionPin}
                onChange={(val) => { setTransactionPin(val); if (errorMessage) setErrorMessage(''); }}
                onComplete={(val) => handlePurchase(val)}
                disabled={isPurchasing} error={errorMessage} />
            </div>
            <div className="mt-auto pt-4 shrink-0">
              <Button fullWidth onClick={() => handlePurchase(transactionPin)}
                disabled={isPurchasing || transactionPin.length !== 4}
                className="h-14 text-base rounded-2xl shadow-md font-semibold">
                {isPurchasing
                  ? <span className="flex items-center gap-2 justify-center"><Loader2 size={20} className="animate-spin" /> Processing...</span>
                  : 'Confirm Payment'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 5: SUCCESS ── */}
        {step === 'SUCCESS' && product && provider && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8">

            {transactionData?.status === 'PENDING' ? (
              <>
                <div className="w-28 h-28 bg-amber-50 rounded-full flex items-center justify-center mb-5
                  shadow-[0_0_50px_rgba(245,158,11,0.18)] ring-[10px] ring-amber-50/60">
                  <Loader2 size={56} className="animate-spin text-amber-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Request Accepted</h3>
                <p className="text-gray-400 mb-6 text-sm px-6 leading-relaxed">
                  {transactionData.message || 'Connection delay with the board. Your PIN is being generated.'}
                </p>
                <div className="w-full bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8">
                  <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm text-amber-700 font-medium">You will receive your PIN shortly via the app.</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-5
                  shadow-[0_0_50px_rgba(34,197,94,0.18)] ring-[10px] ring-emerald-50/60">
                  <CheckCircle size={60} className="text-emerald-500" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Purchase Successful!</h3>
                <p className="text-gray-400 mb-5 text-sm">{product.name} PIN generated</p>

                {/* PIN / card details */}
                {transactionData?.details && (
                  <div className="w-full rounded-3xl overflow-hidden border-2 mb-6"
                    style={{ borderColor: pc + '30', backgroundColor: pc + '06' }}>
                    <div className="h-1.5" style={{ background: `linear-gradient(to right, ${pc}80, ${pc})` }} />
                    <div className="p-4">
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: pc }}>PIN Details</p>
                      <p className="font-mono font-bold text-gray-900 break-all text-sm leading-relaxed tracking-wider">
                        {transactionData.details}
                      </p>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="w-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mb-8">
                  <div className="h-1.5" style={{ background: `linear-gradient(to right, ${pc}80, ${pc})` }} />
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: product.lightColor }}>
                      {React.createElement(PROVIDER_ICONS[provider], { size: 18, style: { color: pc } })}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-semibold truncate">{product.name}</p>
                      <p className="font-mono font-bold text-gray-900">{phoneNo}</p>
                    </div>
                    <p className="font-black text-base shrink-0" style={{ color: pc }}>
                      {CURRENCY}{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="w-full mt-auto pt-2 shrink-0">
              <Button variant="secondary" fullWidth onClick={handleClose}
                className="h-14 text-base rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200">
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </BottomSheet>
  );
};

export default BuyEducationModal;
