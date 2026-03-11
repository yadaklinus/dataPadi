"use client"
import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import {
    Copy, CheckCircle2, AlertCircle, Info,
    Banknote, Landmark, User, Hash, ArrowRight
} from 'lucide-react';
import { FundingResponse } from '@/types/types';
import { CURRENCY } from '@/constants';

interface FundingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: FundingResponse | null;
}

const FundingDetailsModal: React.FC<FundingDetailsModalProps> = ({ isOpen, onClose, data }) => {
    const [copied, setCopied] = useState(false);

    if (!data) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Bank Transfer Details">
            <div className="flex flex-col gap-6 pb-8">
                {/* Amount Section */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col items-center justify-center text-center">
                    <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">Transfer Exact Amount</p>
                    <h3 className="text-4xl font-black text-blue-900 flex items-center gap-1">
                        <span className="text-2xl opacity-50">{CURRENCY}</span>
                        {data.amount.toLocaleString()}
                    </h3>
                    <p className="text-blue-500 text-[10px] mt-2 font-medium flex items-center gap-1">
                        <Info size={12} /> Transfers of incorrect amounts may fail automated verification
                    </p>
                </div>

                {/* Bank Details Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 space-y-5">
                        {/* Account Number */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500">
                                    <Hash size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Account Number</p>
                                    <p className="text-lg font-mono font-bold text-gray-900 tracking-wider">{data.accountNumber}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleCopy(data.accountNumber)}
                                className={`p-3 rounded-2xl transition-all active:scale-90 ${copied ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    }`}
                            >
                                {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                            </button>
                        </div>

                        {/* Bank Name */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500">
                                <Landmark size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Bank Name</p>
                                <p className="text-sm font-bold text-gray-800">{data.bankName}</p>
                            </div>
                        </div>

                        {/* Account Name */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Account Name</p>
                                <p className="text-sm font-bold text-gray-800">{data.accountName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <span>Reference</span>
                            <span className="text-gray-600 font-mono">{data.reference}</span>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                    <div className="flex gap-3 items-start p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                        <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-orange-800 font-medium leading-relaxed">
                            This account number is primary for this transaction and expires after a single use.
                            Do not save it for future transfers.
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-200"
                >
                    Confirm Payment <ArrowRight size={18} />
                </button>
            </div>
        </BottomSheet>
    );
};

export default FundingDetailsModal;
