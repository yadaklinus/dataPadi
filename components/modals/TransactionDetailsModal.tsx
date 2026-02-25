"use client"
import React from 'react';
import { Transaction, TransactionType, TransactionStatus } from '@/types/types';
import BottomSheet from './BottomSheet';
import { CheckCircle, XCircle, Clock, Copy, Share2 } from 'lucide-react';
import { CURRENCY } from '@/constants';
import Button from '../ui/Button';

interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onClose, transaction }) => {
    if (!transaction) return null;

    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case TransactionStatus.SUCCESS: return 'text-green-600 bg-green-50 border-green-100';
            case TransactionStatus.FAILED: return 'text-red-600 bg-red-50 border-red-100';
            case TransactionStatus.PENDING: return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getStatusIcon = (status: TransactionStatus) => {
        switch (status) {
            case TransactionStatus.SUCCESS: return <CheckCircle size={48} className="text-green-500" />;
            case TransactionStatus.FAILED: return <XCircle size={48} className="text-red-500" />;
            case TransactionStatus.PENDING: return <Clock size={48} className="text-amber-500" />;
            default: return <Clock size={48} className="text-gray-500" />;
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const renderDetails = () => {
        const details = transaction.details;
        const type = transaction.type as any; // Cast for raw API types

        if (!details && type !== 'FLIGHT') return <p className="text-gray-500 text-center">No additional details available.</p>;

        switch (type) {
            case 'ELECTRICITY':
                return (
                    <div className="space-y-3">
                        <DetailRow label="Provider" value={details?.provider} />
                        <DetailRow label="Meter Type" value={details?.meterType} />
                        <DetailRow label="Meter Number" value={details?.meterNumber} />
                        <DetailRow label="Customer Name" value={details?.customerName} />
                        {details?.token && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                                <p className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">Token</p>
                                <div className="flex items-center justify-center gap-2">
                                    <p className="text-2xl font-mono font-bold text-gray-800 tracking-widest">{details.token}</p>
                                    <button onClick={() => copyToClipboard(details.token)} className="p-1 hover:bg-amber-100 rounded">
                                        <Copy size={16} className="text-amber-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'EDUCATION':
                return (
                    <div className="space-y-3">
                        <DetailRow label="Exam Body" value={details?.provider} />
                        <DetailRow label="Plan" value={details?.plan} />
                        <DetailRow label="Quantity" value={details?.quantity} />
                        {details?.pins && Array.isArray(details.pins) && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Purchased PINs</p>
                                {details.pins.map((pin: any, index: number) => (
                                    <div key={index} className="p-3 bg-teal-50 border border-teal-100 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-teal-600 font-medium">Serial: {pin.serial}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-mono font-bold text-gray-800 tracking-wider">{pin.pin}</span>
                                            <button onClick={() => copyToClipboard(pin.pin)} className="p-1 hover:bg-teal-100 rounded">
                                                <Copy size={14} className="text-teal-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'CABLE':
            case 'CABLE_TV':
                return (
                    <div className="space-y-3">
                        <DetailRow label="Provider" value={details?.provider} />
                        <DetailRow label="Package" value={details?.plan} />
                        <DetailRow label="Smart Card / IUC" value={details?.smartCardNumber} />
                        <DetailRow label="Customer Name" value={details?.customerName} />
                    </div>
                );

            case 'DATA':
                return (
                    <div className="space-y-3">
                        <DetailRow label="Network" value={details?.network} />
                        <DetailRow label="Plan" value={details?.plan} />
                        <DetailRow label="Beneficiary" value={details?.phoneNumber} />
                    </div>
                );

            case 'AIRTIME':
                return (
                    <div className="space-y-3">
                        <DetailRow label="Network" value={details?.network} />
                        <DetailRow label="Beneficiary" value={details?.phoneNumber} />
                    </div>
                );

            case 'FLIGHT':
                const flightBooking = (transaction as any).flightBooking;
                const flight = flightBooking?.flight;
                const passengers = flightBooking?.passengers;
                return (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="font-bold text-gray-800 mb-2 text-sm">Flight Information</p>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                                <div>
                                    <span className="text-gray-400 block">Airline</span>
                                    <span className="font-medium">{flight?.airline}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block">Flight No</span>
                                    <span className="font-medium">{flight?.flightNumber}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block">Route</span>
                                    <span className="font-medium">{flight?.departure?.code} → {flight?.arrival?.code}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block">PNR</span>
                                    <span className="font-mono font-bold text-gray-800">{flightBooking?.pnr}</span>
                                </div>
                            </div>
                        </div>

                        {passengers && (
                            <div>
                                <p className="font-bold text-gray-800 mb-2 text-sm">Passengers</p>
                                <div className="space-y-2">
                                    {passengers.map((p: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-gray-100 text-xs">
                                            <span className="font-medium text-gray-700">
                                                {p.title} {p.firstName} {p.lastName}
                                            </span>
                                            <span className="text-blue-600 font-bold">{p.seatNumber || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="space-y-3">
                        {details && Object.entries(details).map(([key, value]) => (
                            <DetailRow key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={String(value)} />
                        ))}
                    </div>
                );
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Transaction Details">
            <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                    {getStatusIcon(transaction.status)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {CURRENCY}{Number(transaction.amount).toLocaleString()}
                </h2>
                <p className="text-gray-500 text-sm mb-4 text-center">{transaction.description}</p>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                </span>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
                <div className="space-y-3">
                    <DetailRow label="Date" value={new Date(transaction.date || (transaction as any).createdAt).toLocaleString()} />
                    <DetailRow label="Reference" value={transaction.reference || transaction.id} />
                    <DetailRow label="Type" value={transaction.type} />
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Transaction Info</h3>
                {renderDetails()}
            </div>

            <div className="flex gap-3">
                <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                    <Share2 size={18} /> Share Receipt
                </Button>
                <Button onClick={onClose} className="flex-1" fullWidth={false}>
                    Close
                </Button>
            </div>
        </BottomSheet>
    );
};

const DetailRow: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-start text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-900 text-right max-w-[60%] break-words">{value}</span>
        </div>
    );
};

export default TransactionDetailsModal;
