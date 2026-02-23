"use client"
import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import Input from '../ui/Input';
import NetworkSelector from '../ui/NetworkSelector';
import { NetworkId } from '@/types/types';
import { CURRENCY } from '@/constants';
import { Phone, CheckCircle, ArrowLeft, AlertCircle, Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { buyAirtime } from '@/app/actions/vtu';

interface BuyAirtimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'NETWORK' | 'DETAILS' | 'CONFIRM' | 'SUCCESS';

const QUICK_AMOUNTS = ['100', '200', '500', '1000'];

const BuyAirtimeModal: React.FC<BuyAirtimeModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('NETWORK');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const reset = () => {
    setStep('NETWORK');
    setSelectedNetwork(null);
    setPhoneNumber('');
    setAmount('');
    setIsLoading(false);
    setErrorMessage('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleNetworkSelect = (networkId: NetworkId) => {
    setSelectedNetwork(networkId);
    setErrorMessage('');
    setStep('DETAILS');
  };

  const handlePurchase = async () => {
    if (!selectedNetwork || !amount || !phoneNumber) return;

    setIsLoading(true);
    setErrorMessage('');

    const networkKey = selectedNetwork.toString().toUpperCase();
    
    try {
      const result = await buyAirtime(
        networkKey, 
        Number(amount), 
        phoneNumber
      );

      if (result.success) {
        setStep('SUCCESS');
      } else {
        setErrorMessage(result.error || 'Transaction failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title={step === 'SUCCESS' ? 'Transaction Status' : 'Buy Airtime'}>
      {/* h-full and flex-1 allows this container to take all the height the BottomSheet provides. 
        pb-safe ensures it doesn't clip into mobile home bars.
      */}
      <div className="h-full w-full flex flex-col flex-1 pb-4">
        
        {/* Global Error Banner */}
        {errorMessage && step !== 'SUCCESS' && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-semibold mb-4 flex items-center gap-3 border border-red-100 shadow-sm shrink-0">
            <AlertCircle size={18} className="shrink-0" /> 
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: NETWORK */}
        {step === 'NETWORK' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col flex-1 h-full w-full"
          >
            <p className="text-gray-500 mb-4 text-sm font-medium">Select a network provider to continue</p>
            <div className="overflow-y-auto no-scrollbar pb-4">
              <NetworkSelector selectedNetwork={selectedNetwork} onSelect={handleNetworkSelect} />
            </div>
          </motion.div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 'DETAILS' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <button 
              onClick={() => setStep('NETWORK')} 
              className="text-sm text-primary mb-5 font-bold flex items-center gap-1.5 w-fit hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={16} /> Change Network
            </button>
            
            <div className="space-y-5 overflow-y-auto no-scrollbar flex-1 pb-4">
              
              {/* Phone Input Area */}
              <div className="space-y-1">
                <Input
                  label="Phone Number"
                  placeholder="e.g. 08012345678"
                  type="tel"
                  maxLength={11}
                  value={phoneNumber}
                  onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''));
                      setErrorMessage('');
                  }}
                  leftIcon={<Phone size={18} className="text-gray-400" />}
                  autoFocus
                />
              </div>

              {/* Amount Input Area with Quick Selects */}
              <div className="space-y-3">
                <Input
                  label="Amount"
                  placeholder="Min ₦50"
                  type="number"
                  value={amount}
                  onChange={(e) => {
                      setAmount(e.target.value);
                      setErrorMessage('');
                  }}
                  leftIcon={<span className="text-gray-500 font-extrabold text-sm px-1">{CURRENCY}</span>}
                />
                
                {/* Quick Amount Pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setAmount(amt); setErrorMessage(''); }}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 ${
                        amount === amt 
                          ? 'border-primary bg-blue-50 text-primary shadow-sm' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Zap size={10} className="inline mr-1 mb-0.5" />
                      {CURRENCY}{amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Anchored Bottom Action */}
            <div className="mt-auto pt-4 shrink-0">
              <Button 
                fullWidth 
                disabled={!amount || Number(amount) < 50 || phoneNumber.length < 10}
                onClick={() => setStep('CONFIRM')}
                className="h-14 text-base rounded-2xl shadow-md"
              >
                Proceed to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CONFIRM */}
        {step === 'CONFIRM' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <button 
              onClick={() => setStep('DETAILS')} 
              className="text-sm text-primary mb-5 font-bold flex items-center gap-1.5 w-fit hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={16} /> Edit Details
            </button>
              
            {/* Digital Receipt Card */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 text-center mb-6 relative overflow-hidden">
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-primary" />
              
              <p className="text-gray-500 text-sm mb-1 mt-2 font-medium">You are about to send</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">{selectedNetwork} Airtime</h3>
              <p className="text-primary font-black text-4xl mb-6">{CURRENCY}{Number(amount).toLocaleString()}</p>
              
              {/* Dashed Divider */}
              <div className="border-t-2 border-dashed border-gray-100 relative my-6">
                <div className="absolute -left-8 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                <div className="absolute -right-8 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-widest font-bold">Beneficiary Account</p>
                <p className="text-xl font-mono text-gray-800 font-semibold tracking-wider">{phoneNumber}</p>
              </div>
            </div>

            {/* Anchored Bottom Action */}
            <div className="mt-auto pt-4 shrink-0">
              <Button 
                fullWidth 
                onClick={handlePurchase}
                disabled={isLoading}
                className="h-14 text-base rounded-2xl shadow-md"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 size={20} className="animate-spin" /> Processing Payment...
                  </span>
                ) : (
                  'Confirm & Pay'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'SUCCESS' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-8 ring-green-50/50">
              <CheckCircle size={56} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Purchase Successful!</h3>
            <p className="text-gray-500 mb-8 max-w-[250px] mx-auto text-sm leading-relaxed">
              Airtime has been successfully sent to <br/>
              <span className="font-mono text-gray-800 font-bold text-base bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">{phoneNumber}</span>
            </p>
            
            {/* Anchored Bottom Action */}
            <div className="w-full mt-auto pt-4 shrink-0">
              <Button variant="secondary" fullWidth onClick={handleClose} className="h-14 text-base rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200">
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