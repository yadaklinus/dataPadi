"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, Lightbulb, ChevronRight, Phone, Lock } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PinInput from '../ui/PinInput';
import { motion } from 'framer-motion';
import { getDiscos, verifyMeter, payElectricity, DiscoProvider } from '@/app/actions/electricity';

interface BuyElectricityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type Step = 'PROVIDER' | 'DETAILS' | 'CONFIRM' | 'PIN' | 'SUCCESS';

const QUICK_AMOUNTS = ['1000', '2000', '5000', '10000'];

const BuyElectricityModal: React.FC<BuyElectricityModalProps> = ({ isOpen, onClose, onRefresh }) => {
  // States
  const [step, setStep] = useState<Step>('PROVIDER');
  const [discos, setDiscos] = useState<DiscoProvider[]>([]);
  const [providerId, setProviderId] = useState('');
  const [meterType, setMeterType] = useState<'PREPAID' | 'POSTPAID'>('PREPAID');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');

  // Validation & Transaction States
  const [customerName, setCustomerName] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [units, setUnits] = useState('');
  const [isLoadingDiscos, setIsLoadingDiscos] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionPin, setTransactionPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedProvider = discos.find(p => p.id === providerId);

  // Fetch Providers on Load
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
    setUnits('')
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
    if (!meterNumber || meterNumber.length < 5) {
      setErrorMessage('Please enter a valid Meter Number');
      return;
    }

    setIsValidating(true);
    setErrorMessage('');

    const res = await verifyMeter(providerId, meterNumber, meterType === 'PREPAID');

    console.log("verifyMeter", res.data);

    if (res.success && res.data) {
      setCustomerName(res.data["customer_name"]);
      setMinimumAmount(res.data["minAmount"]);
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
      setErrorMessage("Please enter a valid 4-digit PIN");
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    if (purchaseAmount < Number(minimumAmount)) {
      setErrorMessage(`Amount must be greater than ${minimumAmount}`);
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

    console.log(res);

    if (res.success) {
      // Save Token if Prepaid and provided by the backend
      if (res.token) {
        setGeneratedToken(res.token);
        setUnits(res.units);
      }
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
      title={step === 'SUCCESS' ? 'Transaction Status' : 'Buy Electricity'}
    >
      <div className="h-[85svh] w-full flex flex-col flex-1 pb-4">

        {/* Global Error Banner */}
        {errorMessage && step !== 'SUCCESS' && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-semibold mb-4 flex items-center gap-3 border border-red-100 shadow-sm shrink-0">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: PROVIDER */}
        {step === 'PROVIDER' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <p className="text-gray-500 mb-4 text-sm font-medium">Select an electricity provider</p>

            {isLoadingDiscos ? (
              <div className="flex flex-col items-center justify-center flex-1 space-y-3 text-amber-500">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-sm font-medium text-gray-500">Loading providers...</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto no-scrollbar pb-4">
                {discos.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.id)}
                    className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm active:bg-amber-50 active:border-amber-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <Lightbulb size={20} />
                      </div>
                      <span className="font-semibold text-gray-800">{provider.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 'DETAILS' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <p className="text-gray-500 mb-4 text-sm font-medium">Select an electricity provider</p>

            <div className="space-y-5 overflow-y-auto no-scrollbar flex-1 pb-4">

              {/* Meter Type Toggles */}
              <div className="flex gap-4">
                <button
                  onClick={() => { setMeterType('PREPAID'); setIsValidated(false); }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-colors ${meterType === 'PREPAID'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 text-gray-500 hover:border-amber-200'
                    }`}
                >
                  Prepaid
                </button>
                <button
                  onClick={() => { setMeterType('POSTPAID'); setIsValidated(false); }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-colors ${meterType === 'POSTPAID'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 text-gray-500 hover:border-amber-200'
                    }`}
                >
                  Postpaid
                </button>
              </div>

              {/* Meter Number Input */}
              <div className="space-y-1">
                <Input
                  label="Meter Number"
                  placeholder="Enter meter number"
                  type="number"
                  value={meterNumber}
                  onChange={(e) => {
                    setMeterNumber(e.target.value.replace(/\D/g, ''));
                    setIsValidated(false);
                    setErrorMessage('');
                  }}
                  disabled={isValidating}
                />
              </div>

              {/* Validation Result & Final Inputs */}
              {isValidated ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <CheckCircle size={24} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Verified Customer</p>
                      <p className="font-bold text-gray-800">{customerName}</p>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Minimum Amount: ₦{minimumAmount}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Input
                      label="Amount (₦)"
                      placeholder="Min ₦100"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value.replace(/\D/g, ''));
                        setErrorMessage('');
                      }}
                      leftIcon={<span className="text-gray-500 font-extrabold text-sm px-1">₦</span>}
                    />

                    {/* Quick Amount Pills */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => { setAmount(amt); setErrorMessage(''); }}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 ${amount === amt
                            ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          ₦{parseInt(amt).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                </motion.div>
              ) : null}
            </div>

            {/* Anchored Bottom Action */}
            <div className="mt-auto pt-4 shrink-0">
              {!isValidated ? (
                <Button
                  fullWidth
                  onClick={handleValidate}
                  disabled={isValidating || meterNumber.length < 5}
                  className="h-14 text-base rounded-2xl shadow-md bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isValidating ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={20} className="animate-spin" /> Verifying Meter...
                    </span>
                  ) : (
                    'Validate Meter'
                  )}
                </Button>
              ) : (
                <Button
                  fullWidth
                  disabled={!amount || Number(amount) < 100}
                  onClick={() => setStep('CONFIRM')}
                  className="h-14 text-base rounded-2xl shadow-md bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Proceed to Payment
                </Button>
              )}
            </div>
          </motion.div>
        )
        }

        {/* STEP 3: CONFIRM */}
        {
          step === 'CONFIRM' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col flex-1 h-full w-full"
            >
              {/* Digital Receipt Card */}

              {/* Digital Receipt Card */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 text-center mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />

                <p className="text-gray-500 text-sm mb-1 mt-2 font-medium">You are about to pay</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">{selectedProvider?.name}</h3>
                <p className="text-amber-600 font-black text-4xl mb-6">₦{Number(amount).toLocaleString()}</p>

                <div className="border-t-2 border-dashed border-gray-100 relative my-6">
                  <div className="absolute -left-8 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                  <div className="absolute -right-8 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Customer Name</span>
                    <span className="font-semibold text-gray-900">{customerName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Meter Number</span>
                    <span className="font-mono font-semibold text-gray-900">{meterNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Meter Type</span>
                    <span className="font-semibold text-gray-900">{meterType}</span>
                  </div>
                </div>
              </div>

              {/* Anchored Bottom Action */}
              <div className="mt-auto pt-4 shrink-0">
                <Button
                  fullWidth
                  onClick={() => setStep('PIN')}
                  disabled={isProcessing}
                  className="h-14 text-base rounded-2xl shadow-md bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Proceed
                </Button>
              </div>
            </motion.div>
          )
        }

        {
          step === 'PIN' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col flex-1 h-full w-full"
            >
              <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Lock size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Enter Transaction PIN</h3>
                <p className="text-sm text-slate-500 mb-8 text-center px-4">
                  Please enter your 4-digit PIN to authorize this payment of <span className="font-bold text-slate-700">₦{Number(amount).toLocaleString()}</span>
                </p>

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

              {/* Anchored Bottom Action */}
              <div className="mt-auto pt-4 shrink-0">
                <Button
                  fullWidth
                  onClick={() => handlePurchase(transactionPin)}
                  disabled={isProcessing || transactionPin.length !== 4}
                  className="h-14 text-base rounded-2xl shadow-md bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={20} className="animate-spin" /> Verifying...
                    </span>
                  ) : (
                    'Confirm PIN'
                  )}
                </Button>
              </div>
            </motion.div>
          )
        }

        {/* STEP 4: SUCCESS */}
        {
          step === 'SUCCESS' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-8 ring-green-50/50">
                <CheckCircle size={56} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Payment Successful!</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Your electricity payment has been processed.
              </p>

              {/* Token Display Card (Only renders if a token exists) */}
              {generatedToken && (
                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Your Token</p>
                  <p className="text-2xl font-mono text-gray-900 font-black tracking-widest break-all">
                    {generatedToken.match(/.{1,4}/g)?.join('-') || generatedToken}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Units</p>
                  <p className="text-2xl font-mono text-gray-900 font-black tracking-widest break-all">
                    {units}
                  </p>
                </div>
              )}

              {/* Anchored Bottom Action */}
              <div className="w-full mt-auto pt-4 shrink-0">
                <Button variant="secondary" fullWidth onClick={handleClose} className="h-14 text-base rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Done
                </Button>
              </div>
            </motion.div>
          )
        }
      </div >
    </BottomSheet >
  );
};

export default BuyElectricityModal;