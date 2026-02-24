"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, Tv, ChevronRight, Phone, Search } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { motion } from 'framer-motion';
import { getCablePackages, verifySmartCard, payCableSubscription, CablePackagesResponse, CablePackage } from '@/app/actions/cable';

interface BuyCableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'PROVIDER' | 'DETAILS' | 'CONFIRM' | 'SUCCESS';

interface UIPlan {
  id: string;
  name: string;
  price: number;
}

// Fixed display providers mapped to the expected API payload values
const CABLE_PROVIDERS = [
  { id: 'dstv', name: 'DStv', theme: 'text-blue-600 bg-blue-100', activeTheme: 'active:bg-blue-50 active:border-blue-200' },
  { id: 'gotv', name: 'GOtv', theme: 'text-green-600 bg-green-100', activeTheme: 'active:bg-green-50 active:border-green-200' },
  { id: 'startimes', name: 'StarTimes', theme: 'text-orange-600 bg-orange-100', activeTheme: 'active:bg-orange-50 active:border-orange-200' },
  { id: 'showmax', name: 'Showmax', theme: 'text-purple-600 bg-purple-100', activeTheme: 'active:bg-purple-50 active:border-purple-200' }
];

const BuyCableModal: React.FC<BuyCableModalProps> = ({ isOpen, onClose }) => {
  // States
  const [step, setStep] = useState<Step>('PROVIDER');
  const [apiPackages, setApiPackages] = useState<CablePackagesResponse | null>(null);

  const [providerId, setProviderId] = useState('');
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<UIPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Validation & Transaction States
  const [customerName, setCustomerName] = useState('');
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedProvider = CABLE_PROVIDERS.find(p => p.id === providerId);

  // Fetch Providers/Packages on Load
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
    setPhoneNumber('');
    setSelectedPlan(null);
    setSearchQuery('');
    setCustomerName('');
    setIsValidated(false);
    setIsValidating(false);
    setIsProcessing(false);
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
      setIsValidated(true);
    } else {
      setErrorMessage(res.error || 'Unable to verify smartcard. Please check your details.');
      setIsValidated(false);
    }
    setIsValidating(false);
  };

  const getAvailablePlans = (): UIPlan[] => {
    if (!apiPackages || !providerId) return [];

    // Find the correct key in the API response (e.g. "DStv", "GOtv") regardless of case
    const apiKeys = Object.keys(apiPackages);
    const mappedKey = apiKeys.find(k => k.toLowerCase() === providerId.toLowerCase());

    if (!mappedKey) return [];

    const groups = apiPackages[mappedKey];
    const flatPlans: UIPlan[] = [];

    groups.forEach((group) => {
      if (group.PRODUCT && Array.isArray(group.PRODUCT)) {
        group.PRODUCT.forEach((p: CablePackage) => {
          flatPlans.push({
            id: p.PACKAGE_ID,
            name: p.PACKAGE_NAME,
            price: parseFloat(p.PACKAGE_AMOUNT)
          });
        });
      }
    });

    return flatPlans;
  };

  const availablePlans = getAvailablePlans();
  const filteredPlans = availablePlans.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage('Please provide a valid contact phone number');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    console.log(selectedPlan)

    const res = await payCableSubscription({
      cableTV: providerId,
      packageCode: selectedPlan.id,
      smartCardNo: smartCardNumber,
      phoneNo: phoneNumber
    });

    setIsProcessing(false);

    if (res.success) {
      setStep('SUCCESS');
    } else {
      setErrorMessage(res.error || 'Transaction failed. Please try again.');
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title={step === 'SUCCESS' ? 'Transaction Status' : 'Cable Subscription'}>
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
            <p className="text-gray-500 mb-4 text-sm font-medium">Select your cable provider</p>

            {isLoadingPackages ? (
              <div className="flex flex-col items-center justify-center flex-1 space-y-3 text-purple-600">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-sm font-medium text-gray-500">Loading packages...</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto no-scrollbar pb-4">
                {CABLE_PROVIDERS.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.id)}
                    className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm cursor-pointer transition-colors ${provider.activeTheme}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${provider.theme}`}>
                        <Tv size={20} />
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

        {/* STEP 2: DETAILS (Validation & Plans) */}
        {step === 'DETAILS' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <button
              onClick={() => setStep('PROVIDER')}
              className="text-sm text-purple-600 mb-5 font-bold flex items-center gap-1.5 w-fit hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={16} /> Change Provider
            </button>

            <div className="space-y-5 overflow-y-auto no-scrollbar flex-1 pb-4 flex flex-col">

              <div className="space-y-1">
                <Input
                  label="Smartcard / IUC Number"
                  placeholder="Enter decoder number"
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
                <div className="mt-2 shrink-0">
                  <Button
                    fullWidth
                    onClick={handleValidate}
                    disabled={isValidating || smartCardNumber.length < 8}
                    className="h-14 text-base rounded-2xl shadow-md bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isValidating ? (
                      <span className="flex items-center gap-2 justify-center">
                        <Loader2 size={20} className="animate-spin" /> Verifying Smartcard...
                      </span>
                    ) : (
                      'Validate Smartcard'
                    )}
                  </Button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1 space-y-5">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3 shadow-sm shrink-0">
                    <CheckCircle size={24} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Verified Customer</p>
                      <p className="font-bold text-gray-800">{customerName}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <p className="text-gray-500 mb-2 text-xs uppercase tracking-wider font-semibold">Available Packages</p>
                    <div className="mb-3 shrink-0">
                      <Input
                        placeholder={`Search ${selectedProvider?.name} plans...`}
                        leftIcon={<Search size={18} className="text-gray-400" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-0"
                      />
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2">
                      {filteredPlans.length > 0 ? filteredPlans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className={`flex justify-between items-center p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${selectedPlan?.id === plan.id
                              ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                              : 'border-gray-100 bg-white hover:border-purple-300'
                            }`}
                        >
                          <span className="font-semibold text-gray-800">{plan.name}</span>
                          <span className="font-bold text-purple-700">₦{plan.price.toLocaleString()}</span>
                        </div>
                      )) : (
                        <div className="text-center py-6 text-gray-400 text-sm">
                          No packages found.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 shrink-0">
                    <Input
                      label="Contact Phone Number"
                      placeholder="Required for receipt"
                      type="tel"
                      maxLength={11}
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value.replace(/\D/g, ''));
                        setErrorMessage('');
                      }}
                      leftIcon={<Phone size={18} className="text-gray-400" />}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Anchored Bottom Action for Proceed */}
            {isValidated && (
              <div className="mt-auto pt-4 shrink-0">
                <Button
                  fullWidth
                  disabled={!selectedPlan || phoneNumber.length < 10}
                  onClick={() => setStep('CONFIRM')}
                  className="h-14 text-base rounded-2xl shadow-md bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Proceed to Payment
                </Button>
              </div>
            )}
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
              className="text-sm text-purple-600 mb-5 font-bold flex items-center gap-1.5 w-fit hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={16} /> Edit Details
            </button>

            {/* Digital Receipt Card */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 text-center mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-purple-700" />

              <p className="text-gray-500 text-sm mb-1 mt-2 font-medium">You are about to subscribe to</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedPlan?.name}</h3>
              <p className="text-purple-600 font-black text-4xl mb-6">₦{selectedPlan?.price.toLocaleString()}</p>

              <div className="border-t-2 border-dashed border-gray-100 relative my-6">
                <div className="absolute -left-8 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
                <div className="absolute -right-8 -top-3 w-6 h-6 bg-gray-50 rounded-full" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Provider</span>
                  <span className="font-semibold text-gray-900">{selectedProvider?.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-semibold text-gray-900">{customerName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Smartcard No.</span>
                  <span className="font-mono font-semibold text-gray-900">{smartCardNumber}</span>
                </div>
              </div>
            </div>

            {/* Anchored Bottom Action */}
            <div className="mt-auto pt-4 shrink-0">
              <Button
                fullWidth
                onClick={handlePurchase}
                disabled={isProcessing}
                className="h-14 text-base rounded-2xl shadow-md bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isProcessing ? (
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
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Subscription Successful!</h3>
            <p className="text-gray-500 mb-8 max-w-[250px] mx-auto text-sm leading-relaxed">
              Your {selectedProvider?.name} decoder has been successfully credited.
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

export default BuyCableModal;