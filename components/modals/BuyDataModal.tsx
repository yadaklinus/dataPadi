"use client"
import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import Input from '../ui/Input';
import NetworkSelector from '../ui/NetworkSelector';
import { NetworkId } from '@/types/types';
import { CURRENCY } from '@/constants';
import { Phone, ChevronRight, CheckCircle, Search, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDataPlans, buyData, NetworkPlans } from '@/app/actions/vtu';

interface BuyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UIPlan {
  id: string;
  name: string;
  price: number;
  groupName: string;
}

type Step = 'NETWORK' | 'PLAN' | 'PHONE' | 'CONFIRM' | 'SUCCESS';

const BuyDataModal: React.FC<BuyDataModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('NETWORK');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<UIPlan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [apiPlans, setApiPlans] = useState<NetworkPlans | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && !apiPlans) {
      fetchPlans();
    }
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
    setIsPurchasing(false);
    setSearchQuery('');
    setErrorMessage('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

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

    if (!groups || !Array.isArray(groups)) {
      console.warn(`No plans found for key: ${networkKey}`);
      return [];
    }

    const flatPlans: UIPlan[] = [];

    groups.forEach((group) => {
      if (group.PRODUCT && Array.isArray(group.PRODUCT)) {
        group.PRODUCT.forEach((p: any) => {
          flatPlans.push({
            id: p.PRODUCT_ID,
            name: p.PRODUCT_NAME,
            price: p.SELLING_PRICE,
            groupName: p.PRODUCT_NAME.includes('(SME)') ? 'SME' :
              p.PRODUCT_NAME.includes('(Awoof') ? 'Awoof' : 'Direct',
          });
        });
      }
    });

    return flatPlans;
  };

  const currentPlans = getAvailablePlans();
  const filteredPlans = currentPlans.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePurchase = async () => {
    if (!selectedNetwork || !selectedPlan || !phoneNumber) return;

    setIsPurchasing(true);
    setErrorMessage('');

    const result = await buyData(
      selectedNetwork.toString().toUpperCase(),
      selectedPlan.id,
      phoneNumber
    );

    setIsPurchasing(false);

    if (result.success) {
      setStep('SUCCESS');
    } else {
      setErrorMessage(result.error || 'Transaction failed. Please try again.');
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title={step === 'SUCCESS' ? 'Success' : 'Buy Data'}>
      {/* 80svh and w-full applied here */}
      <div className="h-[80svh] w-full flex flex-col">

        {errorMessage && step !== 'SUCCESS' && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-4 flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} className="shrink-0" /> {errorMessage}
          </div>
        )}

        {step === 'NETWORK' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <p className="text-textMuted mb-4 text-sm font-medium">Select a network provider</p>
            {isLoadingPlans ? (
              <div className="flex flex-col items-center justify-center py-10 text-primary h-full">
                <Loader2 size={32} className="animate-spin mb-2" />
                <span className="text-sm font-semibold">Loading networks...</span>
              </div>
            ) : (
              <div className="overflow-y-auto no-scrollbar">
                <NetworkSelector selectedNetwork={selectedNetwork} onSelect={handleNetworkSelect} />
              </div>
            )}
          </motion.div>
        )}

        {step === 'PLAN' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <button onClick={() => setStep('NETWORK')} className="text-sm text-primary mb-4 font-medium flex items-center gap-1 hover:text-primaryDark transition-colors w-fit">
              <ArrowLeft size={16} /> Back to Networks
            </button>

            <div className="mb-4">
              <Input
                placeholder="Search plans (e.g. 1GB)"
                leftIcon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-0"
              />
            </div>

            <p className="text-textMuted mb-2 text-xs uppercase tracking-wider font-semibold">Available Plans</p>

            {/* Swapped fixed height for flex-1 so it fills available space dynamically */}
            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pb-4">
              {filteredPlans.length > 0 ? filteredPlans.map((plan, index) => (
                <div
                  key={`${plan.id}-${index}`}
                  onClick={() => handlePlanSelect(plan)}
                  className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm active:bg-blue-50 active:border-blue-200 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-textMain">{plan.name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wider">
                        {plan.groupName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{CURRENCY}{plan.price.toLocaleString()}</span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  {searchQuery ? "No matching plans found" : "No plans available for this network"}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'PHONE' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <button onClick={() => setStep('PLAN')} className="text-sm text-primary mb-4 font-medium flex items-center gap-1 w-fit">
              <ArrowLeft size={16} /> Change Plan
            </button>

            <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Plan</span>
                <span className="font-semibold text-gray-900">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-primary">{CURRENCY}{selectedPlan?.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="overflow-y-auto no-scrollbar flex-1">
              <Input
                label="Phone Number"
                placeholder="08012345678"
                type="tel"
                maxLength={11}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  setErrorMessage('');
                }}
                leftIcon={<Phone size={18} />}
                autoFocus
              />
            </div>

            {/* Anchored to bottom */}
            <div className="mt-auto pt-4 pb-2">
              <Button
                fullWidth
                disabled={phoneNumber.length < 10}
                onClick={() => setStep('CONFIRM')}
              >
                Proceed
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'CONFIRM' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <button onClick={() => setStep('PHONE')} className="text-sm text-primary mb-4 font-medium flex items-center gap-1 w-fit">
              <ArrowLeft size={16} /> Edit Details
            </button>

            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 text-center mb-6">
              <p className="text-gray-500 text-sm mb-2">You are about to purchase</p>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedPlan?.name}</h3>
              <p className="text-primary font-bold text-2xl mb-6">{CURRENCY}{selectedPlan?.price.toLocaleString()}</p>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Beneficiary</p>
                <p className="text-lg font-mono text-gray-800 tracking-wider font-semibold">{phoneNumber}</p>
                <p className="text-sm text-gray-500 font-medium mt-1 uppercase">{selectedNetwork}</p>
              </div>
            </div>

            {/* Anchored to bottom */}
            <div className="mt-auto pt-4 pb-2">
              <Button
                fullWidth
                onClick={handlePurchase}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </span>
                ) : (
                  'Confirm Purchase'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'SUCCESS' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm">
              <CheckCircle size={48} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Transaction Successful</h3>
            <p className="text-gray-500 mb-8">Your data has been sent to <span className="font-mono text-gray-700 font-semibold">{phoneNumber}</span></p>

            {/* Anchored to bottom */}
            <div className="w-full mt-auto pt-4">
              <Button variant="secondary" fullWidth onClick={handleClose}>
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