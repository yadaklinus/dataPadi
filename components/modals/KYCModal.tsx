"use client"
import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, User, Loader2 } from 'lucide-react';
import { verifyBVN } from '@/app/actions/payment';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose }) => {
  const [bvn, setBvn] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (bvn.length !== 11) { // [cite: 256]
      setErrorMessage('BVN must be exactly 11 digits');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const result = await verifyBVN(bvn, firstName, lastName); // [cite: 254]

    if (result.success) {
      setIsLoading(false);
      onClose();
      // Using a custom UI toast is better, but keeping alert for your logic
      alert("Success! Your dedicated bank account has been generated.");
    } else {
      setErrorMessage(result.error);
      setIsLoading(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center -mt-2">
         {/* Header Icon */}
         <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 opacity-50" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white">
                <ShieldCheck size={40} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-1.5 rounded-full border-2 border-white">
                <AlertTriangle size={14} fill="currentColor" />
            </div>
         </div>

         <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Identity Verification</h2>
         <p className="text-center text-gray-500 text-sm px-4 mb-6 leading-relaxed">
           Please provide your details exactly as they appear on your <span className="font-bold text-blue-600">BVN record</span> to unlock your dedicated bank account[cite: 254].
         </p>

         {errorMessage && (
           <div className="w-full bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 border border-red-100 flex items-center gap-2">
             <AlertTriangle size={14} /> {errorMessage}
           </div>
         )}

         <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                  label="First Name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  leftIcon={<User size={18} />}
              />
              <Input 
                  label="Last Name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  leftIcon={<User size={18} />}
              />
            </div>

            <Input 
                label="BVN"
                placeholder="11-digit number"
                type="tel"
                maxLength={11}
                value={bvn}
                onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))} // Sanitize [cite: 256]
                leftIcon={<Lock size={18} />}
                className="text-lg tracking-[0.2em] font-mono"
            />
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-900">CBN Regulation Compliance</p>
                  <p className="text-[11px] text-blue-700 leading-tight">
                      Your BVN is encrypted before storage[cite: 265]. We use it only to generate your permanent bank account[cite: 254].
                  </p>
                </div>
            </div>

            <div className="pt-2">
              <Button 
                fullWidth 
                isLoading={isLoading}
                disabled={bvn.length !== 11 || !firstName || !lastName}
                onClick={handleSubmit}
                className="h-14 text-lg shadow-lg shadow-blue-200"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Verify Identity Now'}
              </Button>
              <button 
                onClick={onClose}
                className="w-full py-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors mt-2"
              >
                I'll do this later
              </button>
            </div>
         </div>
      </div>
    </BottomSheet>
  );
};

export default KYCModal;