"use client"
import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CURRENCY } from '@/constants';
import { Phone, CheckCircle, ArrowLeft, AlertCircle, Loader2, GraduationCap, FileText, User, Lock } from 'lucide-react';
import PinInput from '../ui/PinInput';
import { motion } from 'framer-motion';
import { verifyJambProfile, buyEducationPin } from '@/app/actions/vtu';

interface BuyEducationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Provider = 'WAEC' | 'JAMB' | 'JAMB_MOCK';
type Step = 'PROVIDER' | 'DETAILS' | 'CONFIRM' | 'PIN' | 'SUCCESS';

const EDUCATION_PRODUCTS = {
    WAEC: { name: 'WAEC Result Checker', price: 3500, examType: 'waecdirect', icon: FileText },
    JAMB: { name: 'JAMB UTME (No Mock)', price: 6200, examType: 'utme-no-mock', icon: GraduationCap },
    JAMB_MOCK: { name: 'JAMB UTME (With Mock)', price: 7700, examType: 'utme-mock', icon: GraduationCap },
};

const BuyEducationModal: React.FC<BuyEducationModalProps> = ({ isOpen, onClose }) => {
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

    const handleClose = () => {
        onClose();
        setTimeout(reset, 300);
    };

    const handleProviderSelect = (selected: Provider) => {
        setProvider(selected);
        setErrorMessage('');
        setStep('DETAILS');
    };

    // Verify JAMB Profile ID when it reaches 10 digits
    useEffect(() => {
        const isJambProvider = provider === 'JAMB' || provider === 'JAMB_MOCK';
        if (isJambProvider && profileId.length === 10 && !verifiedName && !isVerifying) {
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
            setErrorMessage(result.error || 'Failed to verify profile ID.');
        }
    };

    const handleProceedToConfirm = () => {
        setErrorMessage('');
        if (phoneNo.length < 10) {
            setErrorMessage('Please enter a valid phone number');
            return;
        }
        const isJambProvider = provider === 'JAMB' || provider === 'JAMB_MOCK';
        if (isJambProvider && (!verifiedName || profileId.length !== 10)) {
            setErrorMessage('Please enter and verify a valid JAMB Profile ID first');
            return;
        }
        setStep('CONFIRM');
    };

    const handlePurchase = async (pinToUse: string) => {
        if (!provider) return;
        if (pinToUse.length !== 4) {
            setErrorMessage("Please enter a valid 4-digit PIN");
            return;
        }

        setIsPurchasing(true);
        setErrorMessage('');

        const product = EDUCATION_PRODUCTS[provider];
        const isJambProvider = provider === 'JAMB' || provider === 'JAMB_MOCK';
        // Use 'JAMB' provider explicitly for backend endpoint when calling buyEducationPin 
        // to match backend expectations "JAMB" / "WAEC"
        const backendProvider = isJambProvider ? 'JAMB' : 'WAEC';
        const passedProfileId = isJambProvider ? profileId : undefined;

        const result = await buyEducationPin(backendProvider, product.examType, phoneNo, pinToUse, passedProfileId);

        setIsPurchasing(false);

        if (result.success) {
            setTransactionData({
                status: result.status, // 'OK' or 'PENDING'
                details: result.data?.cardDetails, // The PIN/Serial string
                message: result.message // For PENDING: "Connection delay... etc."
            });
            setStep('SUCCESS');
        } else {
            setErrorMessage(result.error || 'Transaction failed. Please try again.');
            setTransactionPin('');
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={handleClose} title={step === 'SUCCESS' ? 'Success' : 'Education PINs'}>
            <div className="h-[75svh] w-full flex flex-col">
                {errorMessage && step !== 'SUCCESS' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-4 flex items-center gap-2 border border-red-100">
                        <AlertCircle size={16} className="shrink-0" /> {errorMessage}
                    </div>
                )}

                {step === 'PROVIDER' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col flex-1 h-full w-full"
                    >
                        <p className="text-textMuted mb-4 text-sm font-medium">Select an Education body</p>
                        <div className="space-y-4">
                            {(Object.keys(EDUCATION_PRODUCTS) as Provider[]).map((prov) => {
                                const info = EDUCATION_PRODUCTS[prov];
                                const Icon = info.icon;
                                return (
                                    <div
                                        key={prov}
                                        onClick={() => handleProviderSelect(prov)}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm active:bg-indigo-50 active:border-indigo-200 cursor-pointer transition-all hover:shadow-md group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{prov}</h3>
                                            <p className="text-sm text-gray-500">{info.name}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {step === 'DETAILS' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col flex-1 h-full w-full"
                    >
                        <button onClick={() => setStep('PROVIDER')} className="text-sm text-primary mb-4 font-medium flex items-center gap-1 hover:text-primaryDark transition-colors w-fit">
                            <ArrowLeft size={16} /> Change Provider
                        </button>

                        <div className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-4">

                            {(provider === 'JAMB' || provider === 'JAMB_MOCK') && (
                                <div className="space-y-1">
                                    <Input
                                        label="JAMB Profile ID"
                                        placeholder="Enter 10-digit Profile ID"
                                        type="text"
                                        maxLength={10}
                                        value={profileId}
                                        onChange={(e) => {
                                            setProfileId(e.target.value.replace(/\D/g, ''));
                                            setErrorMessage('');
                                        }}
                                        leftIcon={<User size={18} />}
                                    />

                                    {isVerifying ? (
                                        <div className="flex items-center gap-2 text-primary text-sm font-medium px-2">
                                            <Loader2 size={14} className="animate-spin" /> Verifying Profile ID...
                                        </div>
                                    ) : verifiedName ? (
                                        <div className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <CheckCircle size={16} />
                                                <span className="text-sm font-semibold">{verifiedName}</span>
                                            </div>
                                        </div>
                                    ) : profileId.length === 10 && !verifiedName && !errorMessage ? (
                                        <Button variant="outline" className="mt-2 text-xs py-1.5" onClick={handleVerifyProfile}>
                                            Verify Manually
                                        </Button>
                                    ) : null}
                                </div>
                            )}

                            <Input
                                label="Phone Number"
                                placeholder="08012345678"
                                type="tel"
                                maxLength={11}
                                value={phoneNo}
                                onChange={(e) => {
                                    setPhoneNo(e.target.value.replace(/\D/g, ''));
                                    setErrorMessage('');
                                }}
                                leftIcon={<Phone size={18} />}
                            />
                        </div>

                        <div className="mt-auto pt-4 pb-2">
                            <Button
                                fullWidth
                                disabled={phoneNo.length < 10 || ((provider === 'JAMB' || provider === 'JAMB_MOCK') && !verifiedName)}
                                onClick={handleProceedToConfirm}
                            >
                                Proceed
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'CONFIRM' && provider && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col flex-1 h-full w-full"
                    >
                        <button onClick={() => setStep('DETAILS')} className="text-sm text-primary mb-4 font-medium flex items-center gap-1 w-fit">
                            <ArrowLeft size={16} /> Edit Details
                        </button>

                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-6">
                            <div className="text-center mb-6">
                                <p className="text-gray-500 text-sm mb-1">You are about to purchase</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{EDUCATION_PRODUCTS[provider].name}</h3>
                                <p className="text-primary font-bold text-2xl">{CURRENCY}{EDUCATION_PRODUCTS[provider].price.toLocaleString()}</p>
                            </div>

                            <div className="space-y-3 border-t border-gray-100 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Provider</span>
                                    <span className="font-semibold text-gray-900">{provider === 'JAMB_MOCK' ? 'JAMB' : provider}</span>
                                </div>
                                {(provider === 'JAMB' || provider === 'JAMB_MOCK') && (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Profile ID</span>
                                            <span className="font-semibold text-gray-900">{profileId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Name</span>
                                            <span className="font-semibold text-gray-900 text-right">{verifiedName}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Phone Number</span>
                                    <span className="font-semibold text-gray-900">{phoneNo}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 pb-2">
                            <Button
                                fullWidth
                                onClick={() => setStep('PIN')}
                                disabled={isPurchasing}
                            >
                                Proceed
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'PIN' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col flex-1 h-full w-full"
                    >
                        <button
                            onClick={() => {
                                setStep('CONFIRM');
                                setTransactionPin('');
                                setErrorMessage('');
                            }}
                            className="text-sm text-primary mb-5 font-bold flex items-center gap-1.5 w-fit hover:text-blue-800 transition-colors"
                            disabled={isPurchasing}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>

                        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <Lock size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enter Transaction PIN</h3>
                            <p className="text-sm text-slate-500 mb-8 text-center px-4">
                                Please enter your 4-digit PIN to authorize this payment of <span className="font-bold text-slate-700">{CURRENCY}{EDUCATION_PRODUCTS[provider!].price.toLocaleString()}</span>
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
                                disabled={isPurchasing}
                                error={errorMessage}
                            />
                        </div>

                        <div className="mt-auto pt-4 shrink-0">
                            <Button
                                fullWidth
                                onClick={() => handlePurchase(transactionPin)}
                                disabled={isPurchasing || transactionPin.length !== 4}
                                className="h-14 text-base rounded-2xl shadow-md"
                            >
                                {isPurchasing ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <Loader2 size={20} className="animate-spin" /> Verifying...
                                    </span>
                                ) : (
                                    'Confirm PIN'
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'SUCCESS' && provider && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center flex-1 h-full w-full text-center pb-8"
                    >
                        {transactionData?.status === 'PENDING' ? (
                            <>
                                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-500 shadow-sm">
                                    <Loader2 size={48} className="animate-spin" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Accepted</h3>
                                <p className="text-gray-500 mb-4 px-4">{transactionData.message || 'Connection delay with the board. Your PIN is being generated.'}</p>
                                <p className="text-sm text-gray-400">You will receive the PIN shortly.</p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm">
                                    <CheckCircle size={48} strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful</h3>
                                <p className="text-gray-500 mb-6">Your {provider.replace('_', ' ')} PIN has been generated.</p>

                                {transactionData?.details && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full mb-6">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">PIN Details</p>
                                        <p className="font-mono text-sm text-gray-800 break-all">{transactionData.details}</p>
                                    </div>
                                )}
                            </>
                        )}

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

export default BuyEducationModal;
