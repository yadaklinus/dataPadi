"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2, Tv, ChevronRight, Search, Lock, Shield, Zap, Star } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PinInput from '../ui/PinInput';
import { motion, AnimatePresence } from 'framer-motion';
import { getCablePackages, verifySmartCard, payCableSubscription, CablePackagesResponse, CablePackage } from '@/app/actions/cable';

interface BuyCableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type Step = 'PROVIDER' | 'DETAILS' | 'CONFIRM' | 'PIN' | 'SUCCESS';

interface UIPlan {
  id: string;
  name: string;
  price: number;
}

const CABLE_PROVIDERS = [
  {
    id: 'dstv',
    name: 'DStv',
    tagline: 'Premium satellite TV',
    gradient: 'from-blue-500 to-blue-700',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    activeBg: 'bg-blue-600',
  },
  {
    id: 'gotv',
    name: 'GOtv',
    tagline: 'Digital terrestrial TV',
    gradient: 'from-emerald-500 to-green-600',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    activeBg: 'bg-emerald-600',
  },
  {
    id: 'startimes',
    name: 'StarTimes',
    tagline: 'Affordable entertainment',
    gradient: 'from-orange-500 to-red-500',
    lightBg: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    activeBg: 'bg-orange-600',
  },
];

// Helper: check if a value is "real" (not N/A, not empty, not Unknown)
const isRealValue = (val: string | undefined | null): val is string => {
  if (!val) return false;
  const cleaned = val.trim().toLowerCase();
  return cleaned !== '' && cleaned !== 'n/a' && cleaned !== 'unknown customer' && cleaned !== 'unknown';
};

const BuyCableModal: React.FC<BuyCableModalProps> = ({ isOpen, onClose, onRefresh }) => {
  const [step, setStep] = useState<Step>('PROVIDER');
  const [apiPackages, setApiPackages] = useState<CablePackagesResponse | null>(null);

  const [providerId, setProviderId] = useState('');
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<UIPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentBouquet, setCurrentBouquet] = useState('');
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionPin, setTransactionPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedProvider = CABLE_PROVIDERS.find(p => p.id === providerId);

  useEffect(() => {
    if (isOpen && !apiPackages) {
      fetchPackages();
    }
  }, [isOpen]);

  const fetchPackages = async () => {
    setIsLoadingPackages(true);
    setErrorMessage('');
    const res = await getCablePackages();
    if (res.success && res.data) {
      setApiPackages(res.data);
    } else {
      setErrorMessage(res.error || 'Failed to load cable TV packages.');
    }
    setIsLoadingPackages(false);
  };

  const resetState = () => {
    setStep('PROVIDER');
    setProviderId('');
    setSmartCardNumber('');
    setSelectedPlan(null);
    setSearchQuery('');
    setCustomerName('');
    setDueDate('');
    setCurrentBouquet('');
    setIsValidated(false);
    setIsValidating(false);
    setIsProcessing(false);
    setTransactionPin('');
    setErrorMessage('');
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
    if (!smartCardNumber || smartCardNumber.length < 8) {
      setErrorMessage('Please enter a valid Smartcard/IUC Number (min 8 digits)');
      return;
    }
    setIsValidating(true);
    setErrorMessage('');
    const res = await verifySmartCard(providerId, smartCardNumber);
    if (res.success && res.customerName) {
      setCustomerName(res.customerName);
      setDueDate(res.dueDate ?? '');
      setCurrentBouquet(res.currentBouquet ?? '');
      setIsValidated(true);
    } else {
      setErrorMessage(res.error || 'Unable to verify smartcard. Please check your details.');
      setIsValidated(false);
    }
    setIsValidating(false);
  };

  const getAvailablePlans = (): UIPlan[] => {
    if (!apiPackages || !providerId) return [];
    const apiKeys = Object.keys(apiPackages);
    const mappedKey = apiKeys.find(k => k.toLowerCase() === providerId.toLowerCase());
    if (!mappedKey) return [];
    const groups = apiPackages[mappedKey];
    const flatPlans: UIPlan[] = [];
    groups.forEach((group) => {
      if (group.PRODUCT && Array.isArray(group.PRODUCT)) {
        group.PRODUCT.forEach((p: CablePackage) => {
          flatPlans.push({ id: p.PACKAGE_ID, name: p.PACKAGE_NAME, price: parseFloat(p.PACKAGE_AMOUNT) });
        });
      }
    });
    return flatPlans;
  };

  const availablePlans = getAvailablePlans();
  const filteredPlans = availablePlans.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePurchase = async (pinToUse: string) => {
    if (!selectedPlan) return;
    if (pinToUse.length !== 4) {
      setErrorMessage('Please enter a valid 4-digit PIN');
      return;
    }
    setIsProcessing(true);
    setErrorMessage('');
    const res = await payCableSubscription({
      cableTV: providerId,
      packageCode: selectedPlan.id,
      smartCardNo: smartCardNumber,
      transactionPin: pinToUse
    });
    setIsProcessing(false);
    if (res.success) {
      setStep('SUCCESS');
      if (onRefresh) onRefresh();
    } else {
      setErrorMessage(res.error || 'Transaction failed. Please try again.');
      setTransactionPin('');
    }
  };

  const getOnBack = () => {
    if (step === 'DETAILS') return () => setStep('PROVIDER');
    if (step === 'CONFIRM') return () => setStep('DETAILS');
    if (step === 'PIN') return () => {
      setStep('CONFIRM');
      setTransactionPin('');
      setErrorMessage('');
    };
    return undefined;
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      onBack={getOnBack()}
      title={step === 'SUCCESS' ? 'Transaction Status' : 'Cable Subscription'}
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

        {/* STEP 1: PROVIDER */}
        {step === 'PROVIDER' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <p className="text-gray-500 mb-5 text-sm font-medium">Choose your cable TV provider</p>

            {isLoadingPackages ? (
              <div className="flex flex-col items-center justify-center flex-1 space-y-3">
                <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-400">Loading packages...</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto no-scrollbar pb-4">
                {CABLE_PROVIDERS.map((provider, idx) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07, duration: 0.22 }}
                    onClick={() => handleProviderSelect(provider.id)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm cursor-pointer active:scale-[0.98] transition-all duration-150 hover:shadow-md hover:border-gray-200"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${provider.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                      <Tv size={22} className="text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[15px]">{provider.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{provider.tagline}</p>
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

        {/* STEP 2: DETAILS */}
        {step === 'DETAILS' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            {/* Provider badge */}
            {selectedProvider && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${selectedProvider.lightBg} ${selectedProvider.textColor} text-xs font-bold mb-4 self-start border ${selectedProvider.borderColor}`}>
                <Tv size={12} />
                {selectedProvider.name}
              </div>
            )}

            <div className="space-y-5 overflow-y-auto no-scrollbar flex-1 pb-4 flex flex-col">
              <div>
                <Input
                  label="Smartcard / IUC Number"
                  placeholder="Enter your decoder number"
                  type="number"
                  value={smartCardNumber}
                  onChange={(e) => {
                    setSmartCardNumber(e.target.value.replace(/\D/g, ''));
                    setIsValidated(false);
                    setErrorMessage('');
                    setSelectedPlan(null);
                  }}
                  disabled={isValidating}
                />
              </div>

              {!isValidated ? (
                <div className="shrink-0">
                  <Button
                    fullWidth
                    onClick={handleValidate}
                    disabled={isValidating || smartCardNumber.length < 8}
                    className="h-14 text-base rounded-2xl shadow-md bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    {isValidating ? (
                      <span className="flex items-center gap-2 justify-center">
                        <Loader2 size={20} className="animate-spin" /> Verifying Smartcard...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Shield size={18} /> Validate Smartcard
                      </span>
                    )}
                  </Button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1 space-y-5">

                  {/* ── Verified Card Info ── */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 shadow-sm shrink-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={15} className="text-white" />
                      </div>
                      <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Verified Customer</span>
                    </div>

                    {/* Info grid — always shows name, conditionally shows the rest */}
                    <div className="space-y-2.5">
                      {/* Name — always shown if validated */}
                      {isRealValue(customerName) && (
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs text-emerald-600 font-semibold shrink-0 pt-0.5">Name</span>
                          <span className="font-bold text-gray-800 text-sm text-right break-words max-w-[60%]">{customerName}</span>
                        </div>
                      )}

                      {/* Smartcard */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-emerald-600 font-semibold shrink-0">Smartcard No.</span>
                        <span className="font-mono font-bold text-gray-700 text-sm">{smartCardNumber}</span>
                      </div>

                      {/* Due Date — hide if N/A */}
                      {isRealValue(dueDate) && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-emerald-600 font-semibold shrink-0">Due Date</span>
                          <span className="font-semibold text-gray-800 text-sm text-right">{dueDate}</span>
                        </div>
                      )}

                      {/* Current Bouquet — hide if N/A */}
                      {isRealValue(currentBouquet) && (
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs text-emerald-600 font-semibold shrink-0 pt-0.5">Current Bouquet</span>
                          <span className="font-semibold text-gray-800 text-sm text-right break-words max-w-[60%]">{currentBouquet}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plans Section */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <p className="text-gray-400 mb-2.5 text-xs uppercase tracking-widest font-bold">Select a Package</p>

                    {/* Search */}
                    <div className="mb-3 shrink-0">
                      <Input
                        placeholder={`Search ${selectedProvider?.name} plans...`}
                        leftIcon={<Search size={16} className="text-gray-400" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-0"
                      />
                    </div>

                    {/* Plan list */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar pb-2">
                      {filteredPlans.length > 0 ? filteredPlans.map((plan) => {
                        const isSelected = selectedPlan?.id === plan.id;
                        return (
                          <motion.div
                            key={plan.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPlan(plan)}
                            className={`flex justify-between items-center p-4 rounded-2xl border transition-all cursor-pointer ${isSelected
                                ? 'border-purple-500 bg-purple-50 shadow-[0_0_0_2px_rgba(147,51,234,0.15)]'
                                : 'border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm'
                              }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${isSelected ? 'bg-purple-600' : 'bg-gray-200'}`} />
                              <span className={`font-semibold text-sm leading-snug ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{plan.name}</span>
                            </div>
                            <span className={`font-black text-sm ml-3 shrink-0 ${isSelected ? 'text-purple-700' : 'text-gray-600'}`}>
                              ₦{plan.price.toLocaleString()}
                            </span>
                          </motion.div>
                        );
                      }) : (
                        <div className="text-center py-10 text-gray-400 text-sm">
                          <Search size={28} className="mx-auto mb-2 opacity-40" />
                          No packages found.
                        </div>
                      )}
                    </div>

                    {/* Proceed Button */}
                    <div className="pt-3 shrink-0">
                      <Button
                        fullWidth
                        disabled={!selectedPlan}
                        onClick={() => setStep('CONFIRM')}
                        className="h-14 text-base rounded-2xl shadow-md bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                      >
                        {selectedPlan ? `Proceed — ₦${selectedPlan.price.toLocaleString()}` : 'Select a Package'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 3: CONFIRM */}
        {step === 'CONFIRM' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            {/* Receipt Card */}
            <div className="bg-white border border-gray-100 shadow-lg rounded-3xl overflow-hidden mb-6 relative">
              {/* Top gradient accent */}
              <div className={`h-2 w-full bg-gradient-to-r ${selectedProvider?.gradient ?? 'from-purple-500 to-purple-700'}`} />

              <div className="p-5">
                {/* Provider + Plan */}
                <div className="text-center mb-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${selectedProvider?.lightBg} ${selectedProvider?.textColor} text-xs font-bold mb-3 border ${selectedProvider?.borderColor}`}>
                    <Tv size={11} />
                    {selectedProvider?.name}
                  </div>
                  <p className="text-gray-500 text-sm mb-1">You are subscribing to</p>
                  <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{selectedPlan?.name}</h3>
                  <p className="text-purple-600 font-black text-4xl mt-2">
                    ₦{selectedPlan?.price.toLocaleString()}
                  </p>
                </div>

                {/* Dashed divider with notches */}
                <div className="border-t-2 border-dashed border-gray-100 relative my-5">
                  <div className="absolute -left-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                  <div className="absolute -right-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                </div>

                {/* Details grid */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-gray-400 text-sm shrink-0">Provider</span>
                    <span className="font-bold text-gray-900 text-sm text-right">{selectedProvider?.name}</span>
                  </div>
                  {isRealValue(customerName) && (
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-gray-400 text-sm shrink-0">Customer</span>
                      <span className="font-bold text-gray-900 text-sm text-right break-words max-w-[60%]">{customerName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-gray-400 text-sm shrink-0">Smartcard No.</span>
                    <span className="font-mono font-bold text-gray-900 text-sm">{smartCardNumber}</span>
                  </div>
                  {isRealValue(currentBouquet) && (
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-gray-400 text-sm shrink-0">Current Bouquet</span>
                      <span className="font-semibold text-gray-900 text-sm text-right break-words max-w-[55%]">{currentBouquet}</span>
                    </div>
                  )}
                  {isRealValue(dueDate) && (
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-gray-400 text-sm shrink-0">Due Date</span>
                      <span className="font-semibold text-gray-900 text-sm">{dueDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom badge */}
              <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center gap-2">
                <Zap size={13} className="text-purple-500 shrink-0" />
                <span className="text-xs text-gray-400">Instant activation upon successful payment</span>
              </div>
            </div>

            <div className="mt-auto pt-2 shrink-0">
              <Button
                fullWidth
                onClick={() => setStep('PIN')}
                disabled={isProcessing}
                className="h-14 text-base rounded-2xl shadow-md bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                Proceed to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: PIN */}
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
                <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.12)]">
                  <Lock size={32} className="text-purple-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                  <Shield size={13} className="text-white" />
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Authorize Payment</h3>
              <p className="text-sm text-slate-400 mb-2 text-center px-6 leading-relaxed">
                Enter your 4-digit transaction PIN to confirm
              </p>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl px-4 py-2.5 mb-8">
                <p className="text-purple-700 font-black text-lg text-center">
                  ₦{selectedPlan?.price.toLocaleString()}
                </p>
                <p className="text-purple-500 text-xs text-center font-medium">{selectedPlan?.name}</p>
              </div>

              <PinInput
                length={4}
                value={transactionPin}
                onChange={(val) => {
                  setTransactionPin(val);
                  if (errorMessage) setErrorMessage('');
                }}
                onComplete={(val) => {
                  handlePurchase(val);
                }}
                disabled={isProcessing}
                error={errorMessage}
              />
            </div>

            <div className="mt-auto pt-4 shrink-0">
              <Button
                fullWidth
                onClick={() => handlePurchase(transactionPin)}
                disabled={isProcessing || transactionPin.length !== 4}
                className="h-14 text-base rounded-2xl shadow-md bg-purple-600 hover:bg-purple-700 text-white font-semibold"
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

        {/* STEP 5: SUCCESS */}
        {step === 'SUCCESS' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8"
          >
            {/* Success icon */}
            <div className="relative mb-6">
              <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.18)] ring-[10px] ring-emerald-50/60">
                <CheckCircle size={60} className="text-emerald-500" strokeWidth={2} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -top-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow"
              >
                <Star size={15} className="text-white fill-white" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Subscribed!</h3>
            <p className="text-gray-400 mb-2 max-w-[230px] mx-auto text-sm leading-relaxed">
              Your <span className="font-bold text-gray-600">{selectedProvider?.name}</span> decoder has been successfully credited.
            </p>
            {selectedPlan && (
              <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-3 mb-8">
                <p className="text-purple-600 font-bold text-sm">{selectedPlan.name}</p>
                <p className="text-purple-800 font-black text-xl">₦{selectedPlan.price.toLocaleString()}</p>
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

export default BuyCableModal;