"use client"
import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import { Loader2, X, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, url }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Secure Payment">
            <div className="flex flex-col h-[70vh] -mt-4">
                {isLoading && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20">
                        <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading payment gateway...</p>
                    </div>
                )}

                <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative">
                    <iframe
                        src={url}
                        className={`w-full h-full border-none transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setIsLoading(false)}
                        allow="payment; clipboard-write"
                    />
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <ShieldCheck size={12} />
                    Secure Encrypted Payment
                </div>
            </div>
        </BottomSheet>
    );
};

export default PaymentModal;
