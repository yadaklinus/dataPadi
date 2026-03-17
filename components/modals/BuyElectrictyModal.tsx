"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2, Lightbulb, ChevronRight, Lock, Shield, Zap, Copy } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PinInput from '../ui/PinInput';
import { motion, AnimatePresence } from 'framer-motion';
import { getDiscos, verifyMeter, payElectricity, DiscoProvider } from '@/app/actions/electricity';

interface BuyElectricityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type Step = 'PROVIDER' | 'DETAILS' | 'CONFIRM' | 'PIN' | 'SUCCESS';

const QUICK_AMOUNTS = ['1000', '2000', '5000', '10000'];

// Helper: check if a value is meaningful (not blank / N/A)
const isRealValue = (val: unknown): val is string => {
  if (val === null || val === undefined) return false;
  const cleaned = String(val).trim().toLowerCase();
  return cleaned !== '' && cleaned !== 'n/a' && cleaned !== 'unknown' && cleaned !== 'unknown customer';
};

const BuyElectricityModal: React.FC<BuyElectricityModalProps> = ({ isOpen, onClose, onRefresh }) => {
  const [step, setStep] = useState<Step>('PROVIDER');
  const [discos, setDiscos] = useState<DiscoProvider[]>([]);
  const [providerId, setProviderId] = useState('');
  const [meterType, setMeterType] = useState<'PREPAID' | 'POSTPAID'>('PREPAID');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [units, setUnits] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoadingDiscos, setIsLoadingDiscos] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionPin, setTransactionPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedProvider = discos.find(p => p.id === providerId);

  useEffect(() => {
    if (isOpen && discos.length === 0) {
      fetchDiscos();
    }
  }, [isOpen]);

  const fetchDiscos = async () => {
    setIsLoadingDiscos(true);
    setErrorMessage('');
    const res = await getDiscos();
    if (res.success && res.data) {
      setDiscos(res.data);
    } else {
      setErrorMessage(res.error || 'Failed to load electricity providers.');
    }
    setIsLoadingDiscos(false);
  };

  const resetState = () => {
    setStep('PROVIDER');
    setProviderId('');
    setMeterType('PREPAID');
    setMeterNumber('');
    setAmount('');
    setCustomerName('');
    setGeneratedToken('');
    setUnits('');
    setCopied(false);
    setIsValidated(false);
    setIsValidating(false);
    setIsProcessing(false);
    setTransactionPin('');
    setErrorMessage('');
    setMinimumAmount('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 300);
  };

  const handleProviderSelect = (id: string) => {
    setProviderId(id);
    setErrorMessage('');
    setStep('DETAILS');
  };

  const handleValidate = async () => {
    if (!meterNumber || meterNumber.length < 5) {
      setErrorMessage('Please enter a valid Meter Number');
      return;
    }
    setIsValidating(true);
    setErrorMessage('');
    const res = await verifyMeter(providerId, meterNumber, meterType === 'PREPAID');
    if (res.success && res.data) {
      setCustomerName(res.data['customer_name'] || res.data['customer name'] || '');
      setMinimumAmount(res.data['minAmount'] || '');
      setIsValidated(true);
    } else {
      setErrorMessage(res.error || 'Unable to verify meter number. Please check your details.');
      setIsValidated(false);
    }
    setIsValidating(false);
  };

  const handlePurchase = async (pinToUse: string) => {
    const purchaseAmount = parseFloat(amount);
    if (pinToUse.length !== 4) {
      setErrorMessage('Please enter a valid 4-digit PIN');
      return;
    }
    setIsProcessing(true);
    setErrorMessage('');
    if (purchaseAmount < Number(minimumAmount)) {
      setErrorMessage(`Minimum amount is ₦${Number(minimumAmount).toLocaleString()}`);
      setIsProcessing(false);
      setTransactionPin('');
      return;
    }
    const res = await payElectricity({
      discoCode: providerId,
      meterNo: meterNumber,
      meterType: meterType === 'PREPAID' ? '01' : '02',
      amount: purchaseAmount,
      transactionPin: pinToUse
    });
    setIsProcessing(false);
    if (res.success) {
      if (res.token) { setGeneratedToken(res.token); setUnits(res.units); }
      setStep('SUCCESS');
      if (onRefresh) onRefresh();
    } else {
      setErrorMessage(res.error || 'Transaction failed. Please try again.');
      setTransactionPin('');
    }
  };

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getOnBack = () => {
    if (step === 'DETAILS') return () => setStep('PROVIDER');
    if (step === 'CONFIRM') return () => setStep('DETAILS');
    if (step === 'PIN') return () => { setStep('CONFIRM'); setTransactionPin(''); setErrorMessage(''); };
    return undefined;
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      onBack={getOnBack()}
      title={step === 'SUCCESS' ? 'Transaction Status' : 'Buy Electricity'}
    >
      <div className="h-[85svh] w-full flex flex-col flex-1 pb-4">

        {/* Global Error Banner */}
        <AnimatePresence>
          {errorMessage && step !== 'SUCCESS' && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-sm font-medium mb-4 flex items-start gap-3 border border-red-100 shadow-sm shrink-0"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STEP 1: PROVIDER ── */}
        {step === 'PROVIDER' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <p className="text-gray-500 mb-5 text-sm font-medium">Select your electricity distribution company</p>

            {isLoadingDiscos ? (
              <div className="flex flex-col items-center justify-center flex-1 space-y-3">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-amber-500" />
                </div>
                <p className="text-sm font-medium text-gray-400">Loading providers...</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto no-scrollbar pb-4">
                {discos.map((provider, idx) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    onClick={() => handleProviderSelect(provider.id)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm cursor-pointer active:scale-[0.98] transition-all duration-150 hover:shadow-md hover:border-amber-100"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                      <Lightbulb size={22} className="text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[15px]">{provider.name}</p>
                      {provider.minAmount > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">Min: ₦{provider.minAmount.toLocaleString()}</p>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <ChevronRight size={15} className="text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2: DETAILS ── */}
        {step === 'DETAILS' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            {/* Provider badge */}
            {selectedProvider && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-4 self-start border border-amber-200">
                <Lightbulb size={12} />
                {selectedProvider.name}
              </div>
            )}

            <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pb-4 flex flex-col">

              {/* Meter Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                {(['PREPAID', 'POSTPAID'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setMeterType(type); setIsValidated(false); setErrorMessage(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      meterType === type
                        ? 'bg-white text-amber-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Meter Number */}
              <Input
                label="Meter Number"
                placeholder="Enter your meter number"
                type="number"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(e.target.value.replace(/\D/g, ''));
                  setIsValidated(false);
                  setErrorMessage('');
                }}
                disabled={isValidating}
              />

              {/* After Validation */}
              <AnimatePresence>
                {isValidated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Verified customer card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle size={15} className="text-white" />
                        </div>
                        <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Meter Verified</span>
                      </div>
                      <div className="space-y-2.5">
                        {isRealValue(customerName) && (
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs text-emerald-600 font-semibold shrink-0 pt-0.5">Name</span>
                            <span className="font-bold text-gray-800 text-sm text-right break-words max-w-[65%]">{customerName}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-emerald-600 font-semibold shrink-0">Meter No.</span>
                          <span className="font-mono font-bold text-gray-700 text-sm">{meterNumber}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-emerald-600 font-semibold shrink-0">Type</span>
                          <span className="font-semibold text-gray-700 text-sm">{meterType.charAt(0) + meterType.slice(1).toLowerCase()}</span>
                        </div>
                        {isRealValue(minimumAmount) && (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs text-emerald-600 font-semibold shrink-0">Min. Amount</span>
                            <span className="font-bold text-amber-600 text-sm">₦{Number(minimumAmount).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amount input */}
                    <Input
                      label="Amount (₦)"
                      placeholder={`Min ₦${isRealValue(minimumAmount) ? Number(minimumAmount).toLocaleString() : '100'}`}
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
                      leftIcon={<span className="text-gray-400 font-black text-sm px-1">₦</span>}
                    />

                    {/* Quick amounts */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => { setAmount(amt); setErrorMessage(''); }}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 ${
                            amount === amt
                              ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          ₦{parseInt(amt).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Action */}
            <div className="mt-auto pt-3 shrink-0">
              {!isValidated ? (
                <Button
                  fullWidth
                  onClick={handleValidate}
                  disabled={isValidating || meterNumber.length < 5}
                  className="h-14 text-base rounded-2xl shadow-md bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  {isValidating ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={20} className="animate-spin" /> Verifying Meter...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <Zap size={18} /> Validate Meter
                    </span>
                  )}
                </Button>
              ) : (
                <Button
                  fullWidth
                  disabled={!amount || Number(amount) < 100}
                  onClick={() => setStep('CONFIRM')}
                  className="h-14 text-base rounded-2xl shadow-md bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  {amount && Number(amount) >= 100
                    ? `Proceed — ₦${Number(amount).toLocaleString()}`
                    : 'Enter an Amount'}
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: CONFIRM ── */}
        {step === 'CONFIRM' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            {/* Receipt Card */}
            <div className="bg-white border border-gray-100 shadow-lg rounded-3xl overflow-hidden mb-6 relative">
              {/* Top accent */}
              <div className="h-2 w-full bg-gradient-to-r from-amber-400 to-orange-500" />

              <div className="p-5">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-3 border border-amber-200">
                    <Lightbulb size={11} />
                    {selectedProvider?.name}
                  </div>
                  <p className="text-gray-500 text-sm mb-1">You are about to pay</p>
                  <p className="text-amber-500 font-black text-4xl mt-1">
                    ₦{Number(amount).toLocaleString()}
                  </p>
                </div>

                {/* Dashed divider with notches */}
                <div className="border-t-2 border-dashed border-gray-100 relative my-5">
                  <div className="absolute -left-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                  <div className="absolute -right-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                </div>

                {/* Details */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-gray-400 text-sm shrink-0">Provider</span>
                    <span className="font-bold text-gray-900 text-sm">{selectedProvider?.name}</span>
                  </div>
                  {isRealValue(customerName) && (
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-gray-400 text-sm shrink-0">Customer</span>
                      <span className="font-bold text-gray-900 text-sm text-right break-words max-w-[60%]">{customerName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-gray-400 text-sm shrink-0">Meter No.</span>
                    <span className="font-mono font-bold text-gray-900 text-sm">{meterNumber}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-gray-400 text-sm shrink-0">Meter Type</span>
                    <span className="font-semibold text-gray-900 text-sm">{meterType.charAt(0) + meterType.slice(1).toLowerCase()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center gap-2">
                <Zap size={13} className="text-amber-500 shrink-0" />
                <span className="text-xs text-gray-400">
                  {meterType === 'PREPAID' ? 'A token will be generated after payment' : 'Your postpaid bill will be settled'}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-2 shrink-0">
              <Button
                fullWidth
                onClick={() => setStep('PIN')}
                disabled={isProcessing}
                className="h-14 text-base rounded-2xl shadow-md bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                Proceed to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: PIN ── */}
        {step === 'PIN' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <div className="flex-1 flex flex-col items-center justify-center -mt-8 px-2">
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.15)]">
                  <Lock size={32} className="text-amber-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                  <Shield size={13} className="text-white" />
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Authorize Payment</h3>
              <p className="text-sm text-slate-400 mb-2 text-center px-6 leading-relaxed">
                Enter your 4-digit transaction PIN to confirm
              </p>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5 mb-8">
                <p className="text-amber-600 font-black text-lg text-center">
                  ₦{Number(amount).toLocaleString()}
                </p>
                <p className="text-amber-500 text-xs text-center font-medium">{selectedProvider?.name}</p>
              </div>

              <PinInput
                length={4}
                value={transactionPin}
                onChange={(val) => {
                  setTransactionPin(val);
                  if (errorMessage) setErrorMessage('');
                }}
                onComplete={(val) => handlePurchase(val)}
                disabled={isProcessing}
                error={errorMessage}
              />
            </div>

            <div className="mt-auto pt-4 shrink-0">
              <Button
                fullWidth
                onClick={() => handlePurchase(transactionPin)}
                disabled={isProcessing || transactionPin.length !== 4}
                className="h-14 text-base rounded-2xl shadow-md bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 size={20} className="animate-spin" /> Processing...
                  </span>
                ) : (
                  'Confirm Payment'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 5: SUCCESS ── */}
        {step === 'SUCCESS' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8"
          >
            {/* Success icon */}
            <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-5 shadow-[0_0_50px_rgba(34,197,94,0.18)] ring-[10px] ring-emerald-50/60">
              <CheckCircle size={60} className="text-emerald-500" strokeWidth={2} />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Payment Successful!</h3>
            <p className="text-gray-400 mb-5 text-sm max-w-[220px] mx-auto leading-relaxed">
              Your electricity payment has been processed.
            </p>

            {/* Token Card */}
            {generatedToken && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full bg-gray-900 rounded-3xl p-5 mb-6 text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Electricity Token</span>
                  </div>
                  <button
                    onClick={handleCopyToken}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <Copy size={13} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-2xl font-mono font-black tracking-widest text-white break-all leading-tight">
                  {generatedToken.match(/.{1,4}/g)?.join('-') || generatedToken}
                </p>
                {isRealValue(units) && (
                  <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-semibold">Units</span>
                    <span className="text-amber-400 font-bold text-sm">{units} kWh</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* No token (postpaid) summary */}
            {!generatedToken && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3 mb-6">
                <p className="text-amber-700 font-bold text-sm">{selectedProvider?.name}</p>
                <p className="text-amber-800 font-black text-xl">₦{Number(amount).toLocaleString()}</p>
              </div>
            )}

            <div className="w-full mt-auto pt-2 shrink-0">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleClose}
                className="h-14 text-base rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </BottomSheet>
  );
};

export default BuyElectricityModal;