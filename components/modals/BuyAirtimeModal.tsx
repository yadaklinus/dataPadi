"use client"
import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import PinInput from '../ui/PinInput';
import { NetworkId } from '@/types/types';
import { CURRENCY, NETWORKS } from '@/constants';
import { Phone, CheckCircle, AlertCircle, Loader2, Zap, Lock, Shield, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buyAirtime } from '@/app/actions/vtu';

interface BuyAirtimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type Step = 'FORM' | 'CONFIRM' | 'PIN' | 'SUCCESS';

const QUICK_AMOUNTS = ['100', '200', '500', '1000', '2000', '5000'];

const BuyAirtimeModal: React.FC<BuyAirtimeModalProps> = ({ isOpen, onClose, onRefresh }) => {
  const [step, setStep] = useState<Step>('FORM');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionPin, setTransactionPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedNetworkData = NETWORKS.find(n => n.id === selectedNetwork);

  const canProceed =
    selectedNetwork !== null &&
    phoneNumber.length >= 10 &&
    Number(amount) >= 50;

  const reset = () => {
    setStep('FORM');
    setSelectedNetwork(null);
    setPhoneNumber('');
    setAmount('');
    setTransactionPin('');
    setIsLoading(false);
    setErrorMessage('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handlePurchase = async (pinToUse: string) => {
    if (!selectedNetwork || !amount || !phoneNumber) return;
    if (pinToUse.length !== 4) {
      setErrorMessage('Please enter a valid 4-digit PIN');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await buyAirtime(
        selectedNetwork.toString().toUpperCase(),
        Number(amount),
        phoneNumber,
        pinToUse
      );

      if (result.success) {
        setStep('SUCCESS');
        if (onRefresh) onRefresh();
      } else {
        setErrorMessage(result.error || 'Transaction failed. Please try again.');
        setTransactionPin('');
      }
    } catch {
      setErrorMessage('A network error occurred. Please check your connection.');
      setTransactionPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const getOnBack = () => {
    if (step === 'CONFIRM') return () => { setStep('FORM'); setErrorMessage(''); };
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
      title={step === 'SUCCESS' ? 'Transaction Status' : 'Buy Airtime'}
    >
      <div className="h-[92svh] w-full flex flex-col flex-1 pb-4">

        {/* Error Banner */}
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

        {/* ── STEP 1: FORM (all-in-one) ── */}
        {step === 'FORM' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar space-y-6 pb-4">

              {/* ── Network Selector ── */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Network</p>
                <div className="grid grid-cols-4 gap-3">
                  {NETWORKS.map((network) => {
                    const isSelected = selectedNetwork === network.id;
                    return (
                      <motion.button
                        key={network.id}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => { setSelectedNetwork(network.id); setErrorMessage(''); }}
                        className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-transparent shadow-lg scale-[1.03]'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                        style={isSelected ? { backgroundColor: network.color + '15', borderColor: network.color } : {}}
                      >
                        {isSelected && (
                          <div
                            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: network.color }}
                          >
                            <Check size={9} className="text-white" />
                          </div>
                        )}
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base mb-1.5 shadow-md"
                          style={{ backgroundColor: network.color }}
                        >
                          {network.logo}
                        </div>
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                          {network.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* ── Phone Number ── */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</p>
                <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
                  {/* Network color dot */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors"
                    style={{ backgroundColor: selectedNetworkData?.color ?? '#E5E7EB' }}
                  >
                    <Phone size={15} className="text-white" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
                    placeholder="08012345678"
                    className="flex-1 bg-transparent outline-none text-gray-900 font-semibold text-base placeholder-gray-300"
                  />
                  {phoneNumber.length >= 10 && (
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                  )}
                </div>
              </div>

              {/* ── Amount ── */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amount</p>

                {/* Big amount input */}
                <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 focus-within:border-blue-400 focus-within:bg-white transition-all mb-3">
                  <span className="text-gray-400 font-black text-xl shrink-0">{CURRENCY}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setErrorMessage(''); }}
                    placeholder="0"
                    className="flex-1 bg-transparent outline-none text-gray-900 font-black text-2xl placeholder-gray-200 w-0"
                  />
                  {Number(amount) >= 50 && (
                    <span className="text-xs font-bold text-emerald-500 shrink-0">✓</span>
                  )}
                </div>

                {/* Quick amount pills */}
                <div className="flex gap-2 flex-wrap">
                  {QUICK_AMOUNTS.map((amt) => {
                    const isActive = amount === amt;
                    return (
                      <button
                        key={amt}
                        onClick={() => { setAmount(amt); setErrorMessage(''); }}
                        className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Zap size={10} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                        {CURRENCY}{Number(amt).toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3 shrink-0">
              {/* Summary pill above button */}
              <AnimatePresence>
                {canProceed && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex items-center justify-between mb-3 px-1"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-black"
                        style={{ backgroundColor: selectedNetworkData?.color ?? '#6366f1' }}
                      >
                        {selectedNetworkData?.logo}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">{phoneNumber}</span>
                    </div>
                    <span className="text-sm font-black text-gray-800">{CURRENCY}{Number(amount).toLocaleString()}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                fullWidth
                disabled={!canProceed}
                onClick={() => setStep('CONFIRM')}
                className="h-14 text-base rounded-2xl shadow-md font-semibold"
              >
                {!selectedNetwork
                  ? 'Select a Network'
                  : !phoneNumber || phoneNumber.length < 10
                  ? 'Enter Phone Number'
                  : Number(amount) < 50
                  ? 'Enter Amount (min ₦50)'
                  : `Buy ${selectedNetworkData?.name} Airtime — ${CURRENCY}${Number(amount).toLocaleString()}`}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: CONFIRM ── */}
        {step === 'CONFIRM' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <div className="bg-white border border-gray-100 shadow-lg rounded-3xl overflow-hidden mb-6">
              {/* Colored top accent from network color */}
              <div
                className="h-2 w-full"
                style={{ background: selectedNetworkData ? `linear-gradient(to right, ${selectedNetworkData.color}99, ${selectedNetworkData.color})` : 'linear-gradient(to right, #6366f1, #8b5cf6)' }}
              />

              <div className="p-5 text-center">
                {/* Network avatar */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-lg"
                  style={{ backgroundColor: selectedNetworkData?.color ?? '#6366f1' }}
                >
                  {selectedNetworkData?.logo}
                </div>

                <p className="text-gray-400 text-sm mb-1">Send airtime to</p>
                <p className="text-xl font-mono font-black text-gray-900 tracking-wider mb-1">{phoneNumber}</p>
                <p className="text-gray-400 text-xs mb-4">{selectedNetworkData?.name}</p>

                {/* Amount */}
                <p
                  className="font-black text-5xl"
                  style={{ color: selectedNetworkData?.color ?? '#6366f1' }}
                >
                  {CURRENCY}{Number(amount).toLocaleString()}
                </p>

                {/* Dashed divider */}
                <div className="border-t-2 border-dashed border-gray-100 relative my-5">
                  <div className="absolute -left-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                  <div className="absolute -right-7 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Transaction type</span>
                  <span className="font-bold text-gray-800">Airtime Top-Up</span>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center gap-2">
                <Zap size={13} className="text-blue-500 shrink-0" />
                <span className="text-xs text-gray-400">Delivered instantly to your number</span>
              </div>
            </div>

            <div className="mt-auto pt-2 shrink-0">
              <Button
                fullWidth
                onClick={() => setStep('PIN')}
                disabled={isLoading}
                className="h-14 text-base rounded-2xl shadow-md font-semibold"
              >
                Proceed to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: PIN ── */}
        {step === 'PIN' && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col flex-1 h-full w-full"
          >
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
              <p className="text-sm text-slate-400 mb-2 text-center px-6 leading-relaxed">
                Enter your 4-digit PIN to confirm
              </p>

              <div
                className="rounded-2xl px-5 py-2.5 mb-8 border"
                style={{ backgroundColor: (selectedNetworkData?.color ?? '#6366f1') + '12', borderColor: (selectedNetworkData?.color ?? '#6366f1') + '30' }}
              >
                <p className="font-black text-lg text-center" style={{ color: selectedNetworkData?.color ?? '#6366f1' }}>
                  {CURRENCY}{Number(amount).toLocaleString()}
                </p>
                <p className="text-xs text-center font-medium text-gray-500">{selectedNetworkData?.name} · {phoneNumber}</p>
              </div>

              <PinInput
                length={4}
                value={transactionPin}
                onChange={(val) => {
                  setTransactionPin(val);
                  if (errorMessage) setErrorMessage('');
                }}
                onComplete={(val) => handlePurchase(val)}
                disabled={isLoading}
                error={errorMessage}
              />
            </div>

            <div className="mt-auto pt-4 shrink-0">
              <Button
                fullWidth
                onClick={() => handlePurchase(transactionPin)}
                disabled={isLoading || transactionPin.length !== 4}
                className="h-14 text-base rounded-2xl shadow-md font-semibold"
              >
                {isLoading ? (
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

        {/* ── STEP 4: SUCCESS ── */}
        {step === 'SUCCESS' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8"
          >
            <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-5 shadow-[0_0_50px_rgba(34,197,94,0.18)] ring-[10px] ring-emerald-50/60">
              <CheckCircle size={60} className="text-emerald-500" strokeWidth={2} />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Airtime Sent!</h3>
            <p className="text-gray-400 mb-5 text-sm">Successfully topped up</p>

            {/* Summary card */}
            <div className="w-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mb-8">
              <div
                className="h-1.5"
                style={{ background: selectedNetworkData ? `linear-gradient(to right, ${selectedNetworkData.color}80, ${selectedNetworkData.color})` : '#6366f1' }}
              />
              <div className="p-5 flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow"
                  style={{ backgroundColor: selectedNetworkData?.color ?? '#6366f1' }}
                >
                  {selectedNetworkData?.logo}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-semibold">{selectedNetworkData?.name} Airtime</p>
                  <p className="font-mono font-bold text-gray-900 text-base">{phoneNumber}</p>
                </div>
                <p
                  className="font-black text-xl shrink-0"
                  style={{ color: selectedNetworkData?.color ?? '#6366f1' }}
                >
                  {CURRENCY}{Number(amount).toLocaleString()}
                </p>
              </div>
            </div>

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

export default BuyAirtimeModal;