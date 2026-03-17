"use client"
import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PinInput from '../ui/PinInput';
import { NetworkId } from '@/types/types';
import { CURRENCY, NETWORKS } from '@/constants';
import { Phone, CheckCircle, AlertCircle, Loader2, Lock, Shield, Search, ChevronRight, Wifi, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDataPlans, buyData, NetworkPlans } from '@/app/actions/vtu';

interface BuyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

interface UIPlan {
  id: string;
  name: string;
  price: number;
  groupName: string;
}

type Step = 'NETWORK' | 'PLAN' | 'PHONE' | 'CONFIRM' | 'PIN' | 'SUCCESS';

const GROUP_COLORS: Record<string, string> = {
  SME:    '#6366f1',
  Awoof:  '#f59e0b',
  Direct: '#10b981',
};

const BuyDataModal: React.FC<BuyDataModalProps> = ({ isOpen, onClose, onRefresh }) => {
  const [step, setStep] = useState<Step>('NETWORK');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<UIPlan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiPlans, setApiPlans] = useState<NetworkPlans | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [transactionPin, setTransactionPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNetworkData = NETWORKS.find(n => n.id === selectedNetwork);

  useEffect(() => {
    if (isOpen && !apiPlans) fetchPlans();
  }, [isOpen]);

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    setErrorMessage('');
    const result = await getDataPlans();
    if (result.success && result.data) {
      setApiPlans(result.data);
    } else {
      setErrorMessage(result.error || 'Failed to load data plans.');
    }
    setIsLoadingPlans(false);
  };

  const reset = () => {
    setStep('NETWORK');
    setSelectedNetwork(null);
    setSelectedPlan(null);
    setPhoneNumber('');
    setTransactionPin('');
    setIsPurchasing(false);
    setSearchQuery('');
    setErrorMessage('');
  };

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const handleNetworkSelect = (networkId: NetworkId) => {
    setSelectedNetwork(networkId);
    setErrorMessage('');
    setStep('PLAN');
  };

  const handlePlanSelect = (plan: UIPlan) => {
    setSelectedPlan(plan);
    setErrorMessage('');
    setStep('PHONE');
  };

  const getAvailablePlans = (): UIPlan[] => {
    if (!apiPlans || !selectedNetwork) return [];
    const networkId = selectedNetwork.toString();
    let networkKey = networkId;
    if (networkId === '9MOBILE') networkKey = 'm_9mobile';
    if (networkId === 'GLO') networkKey = 'Glo';
    if (networkId === 'AIRTEL') networkKey = 'Airtel';
    if (networkId === 'MTN') networkKey = 'MTN';
    const groups = apiPlans[networkKey];
    if (!groups || !Array.isArray(groups)) return [];
    const flat: UIPlan[] = [];
    groups.forEach((group) => {
      if (group.PRODUCT && Array.isArray(group.PRODUCT)) {
        group.PRODUCT.forEach((p: any) => {
          flat.push({
            id: p.PRODUCT_ID,
            name: p.PRODUCT_NAME,
            price: p.SELLING_PRICE,
            groupName: p.PRODUCT_NAME.includes('(SME)') ? 'SME'
              : p.PRODUCT_NAME.includes('(Awoof') ? 'Awoof' : 'Direct',
          });
        });
      }
    });
    return flat;
  };

  const currentPlans = getAvailablePlans();
  const filteredPlans = currentPlans.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePurchase = async (pinToUse: string) => {
    if (!selectedNetwork || !selectedPlan || !phoneNumber) return;
    if (pinToUse.length !== 4) { setErrorMessage('Please enter a valid 4-digit PIN'); return; }
    setIsPurchasing(true);
    setErrorMessage('');
    const result = await buyData(selectedNetwork.toString().toUpperCase(), selectedPlan.id, phoneNumber, pinToUse);
    setIsPurchasing(false);
    if (result.success) {
      setStep('SUCCESS');
      if (onRefresh) onRefresh();
    } else {
      setErrorMessage(result.error || 'Transaction failed. Please try again.');
      setTransactionPin('');
    }
  };

  const getOnBack = () => {
    if (step === 'PLAN')    return () => setStep('NETWORK');
    if (step === 'PHONE')   return () => setStep('PLAN');
    if (step === 'CONFIRM') return () => setStep('PHONE');
    if (step === 'PIN')     return () => { setStep('CONFIRM'); setTransactionPin(''); setErrorMessage(''); };
    return undefined;
  };

  const nc = selectedNetworkData?.color ?? '#6366f1';

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} onBack={getOnBack()} title={step === 'SUCCESS' ? 'Transaction Status' : 'Buy Data'}>
      <div className="h-[88svh] w-full flex flex-col">

        {/* Error Banner */}
        <AnimatePresence>
          {errorMessage && step !== 'SUCCESS' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-sm font-medium mb-4 flex items-start gap-3 border border-red-100 shrink-0"
            >
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STEP 1: NETWORK ── */}
        {step === 'NETWORK' && (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 h-full w-full">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Network</p>

            {isLoadingPlans ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Loader2 size={22} className="animate-spin text-indigo-500" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Loading plans...</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {NETWORKS.map((network) => {
                  const isSelected = selectedNetwork === network.id;
                  return (
                    <motion.button
                      key={network.id}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => handleNetworkSelect(network.id)}
                      className="relative flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all duration-200"
                      style={isSelected
                        ? { backgroundColor: network.color + '15', borderColor: network.color }
                        : { borderColor: '#f1f5f9', backgroundColor: '#fff' }}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: network.color }}>
                          <Check size={9} className="text-white" />
                        </div>
                      )}
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base mb-1.5 shadow-md"
                        style={{ backgroundColor: network.color }}>
                        {network.logo}
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: isSelected ? '#111827' : '#6b7280' }}>
                        {network.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2: PLAN ── */}
        {step === 'PLAN' && (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 h-full w-full">

            {/* Network chip */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm"
                style={{ backgroundColor: nc }}>{selectedNetworkData?.logo}</div>
              <span className="font-bold text-gray-800">{selectedNetworkData?.name} Data Plans</span>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 mb-4 focus-within:border-blue-400 focus-within:bg-white transition-all">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search plans…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 font-medium"
              />
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} available
            </p>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-4">
              {filteredPlans.length > 0 ? filteredPlans.map((plan, i) => (
                <motion.button
                  key={`${plan.id}-${i}`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelect(plan)}
                  className="w-full flex justify-between items-center p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-gray-200 transition-all"
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">{plan.name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ backgroundColor: (GROUP_COLORS[plan.groupName] ?? '#6b7280') + '15', color: GROUP_COLORS[plan.groupName] ?? '#6b7280' }}>
                      {plan.groupName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-black text-base" style={{ color: nc }}>{CURRENCY}{plan.price.toLocaleString()}</span>
                    <ChevronRight size={15} className="text-gray-300" />
                  </div>
                </motion.button>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Wifi size={32} className="mb-3 opacity-30" />
                  <p className="text-sm font-medium">{searchQuery ? 'No matching plans' : 'No plans available'}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: PHONE ── */}
        {step === 'PHONE' && (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 h-full w-full">

            {/* Selected plan summary */}
            <div className="rounded-3xl overflow-hidden mb-5 border-2"
              style={{ borderColor: nc + '30', backgroundColor: nc + '08' }}>
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${nc}80, ${nc})` }} />
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black shadow-md"
                  style={{ backgroundColor: nc }}>{selectedNetworkData?.logo}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{selectedPlan?.name}</p>
                  <p className="text-xs text-gray-500">{selectedNetworkData?.name}</p>
                </div>
                <p className="font-black text-xl shrink-0" style={{ color: nc }}>
                  {CURRENCY}{selectedPlan?.price.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</p>
            <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 mb-4 focus-within:border-blue-400 focus-within:bg-white transition-all">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: nc }}>
                <Phone size={14} className="text-white" />
              </div>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
                placeholder="08012345678"
                className="flex-1 bg-transparent outline-none text-gray-900 font-semibold text-base placeholder-gray-300"
                autoFocus
              />
              {phoneNumber.length >= 10 && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
            </div>

            <div className="mt-auto pt-3 shrink-0">
              <Button fullWidth disabled={phoneNumber.length < 10} onClick={() => setStep('CONFIRM')}
                className="h-14 text-base rounded-2xl shadow-md font-semibold">
                Proceed
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: CONFIRM ── */}
        {step === 'CONFIRM' && (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 h-full w-full">

            <div className="bg-white border border-gray-100 shadow-lg rounded-3xl overflow-hidden mb-6">
              <div className="h-2" style={{ background: `linear-gradient(to right, ${nc}80, ${nc})` }} />
              <div className="p-5 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-lg"
                  style={{ backgroundColor: nc }}>
                  {selectedNetworkData?.logo}
                </div>
                <p className="text-gray-400 text-sm mb-1">{selectedPlan?.name}</p>
                <p className="font-mono font-black text-gray-900 text-xl tracking-wider mb-1">{phoneNumber}</p>
                <p className="text-gray-400 text-xs mb-4">{selectedNetworkData?.name}</p>
                <p className="font-black text-5xl" style={{ color: nc }}>
                  {CURRENCY}{selectedPlan?.price.toLocaleString()}
                </p>
                <div className="border-t-2 border-dashed border-gray-100 relative my-5">
                  <div className="absolute -left-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                  <div className="absolute -right-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="font-bold text-gray-800">Data Bundle</span>
                </div>
              </div>
              <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center gap-2">
                <Wifi size={13} className="text-indigo-500 shrink-0" />
                <span className="text-xs text-gray-400">Data will be activated instantly</span>
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

        {/* ── STEP 5: PIN ── */}
        {step === 'PIN' && (
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
                style={{ backgroundColor: nc + '12', borderColor: nc + '30' }}>
                <p className="font-black text-lg text-center" style={{ color: nc }}>
                  {CURRENCY}{selectedPlan?.price.toLocaleString()}
                </p>
                <p className="text-xs text-center font-medium text-gray-500">
                  {selectedNetworkData?.name} · {selectedPlan?.name} · {phoneNumber}
                </p>
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

        {/* ── STEP 6: SUCCESS ── */}
        {step === 'SUCCESS' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8">
            <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-5
              shadow-[0_0_50px_rgba(34,197,94,0.18)] ring-[10px] ring-emerald-50/60">
              <CheckCircle size={60} className="text-emerald-500" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Data Activated!</h3>
            <p className="text-gray-400 mb-5 text-sm">Successfully sent to</p>
            <div className="w-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mb-8">
              <div className="h-1.5" style={{ background: `linear-gradient(to right, ${nc}80, ${nc})` }} />
              <div className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow"
                  style={{ backgroundColor: nc }}>{selectedNetworkData?.logo}</div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-semibold truncate">{selectedPlan?.name}</p>
                  <p className="font-mono font-bold text-gray-900 text-base">{phoneNumber}</p>
                </div>
                <p className="font-black text-xl shrink-0" style={{ color: nc }}>
                  {CURRENCY}{selectedPlan?.price.toLocaleString()}
                </p>
              </div>
            </div>
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

export default BuyDataModal;