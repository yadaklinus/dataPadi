"use client"
import React from 'react';
import { Transaction, TransactionType, TransactionStatus } from '@/types/types';
import BottomSheet from './BottomSheet';
import { CheckCircle, XCircle, Clock, Copy, Share2, Zap, Download } from 'lucide-react';
import { CURRENCY } from '@/constants';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { createPortal } from 'react-dom';
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

    const [isExporting, setIsExporting] = React.useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleDownloadPDF = async () => {
        const printableArea = document.getElementById('receipt-printable-area');
        if (!printableArea) return;

        try {
            setIsExporting(true);
            const imgData = await toPng(printableArea, {
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                style: {
                    display: 'block',
                    position: 'relative',
                    left: '0',
                    top: '0',
                }
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`MuftiPay_Receipt_${transaction.reference || transaction.id}.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const renderDetails = () => {
        const details = transaction.metadata;
        console.log(details)
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
                        <DetailRow label="Address" value={details?.address} />
                        {details?.token && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                                <p className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">Token</p>
                                <div className="flex items-center justify-center gap-2">
                                    <p className="text-2xl font-mono font-bold text-gray-800 tracking-widest">{details.token}</p>
                                    <button onClick={() => copyToClipboard(details.token)} className="p-1 hover:bg-amber-100 rounded">
                                        <Copy size={16} className="text-amber-600" />
                                    </button>
                                </div>
                                <p className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">Units</p>
                                <div className="flex items-center justify-center gap-2">
                                    <p className="text-2xl font-mono font-bold text-gray-800 tracking-widest">{details.units}</p>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'EDUCATION':
                return (
                    <div className="space-y-3">
                        <DetailRow label="Exam Body" value={(() => {
                            if (details?.examType === 'utme-mock') return 'JAMB UTME (With Mock)';
                            if (details?.examType === 'utme-no-mock') return 'JAMB UTME (No Mock)';
                            return details?.provider || 'Education PIN';
                        })()} />
                        {details?.customerName && <DetailRow label="Customer Name" value={details.customerName} />}
                        {details?.plan && <DetailRow label="Plan" value={details.plan} />}
                        <DetailRow label="Quantity" value={details?.quantity} />
                        {details?.profileId && <DetailRow label="Profile ID" value={details.profileId} />}
                        <DetailRow label="Phone Number" value={details?.phoneNumber} />
                        {details?.pins && Array.isArray(details.pins) && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Purchased PINs</p>
                                {details.pins.map((pin: any, index: number) => (
                                    <div key={index} className="p-3 bg-teal-50 border border-teal-100 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-teal-600 font-medium">Serial: {pin.serial || pin.Serial}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-mono font-bold text-gray-800 tracking-wider">{pin.pin || pin.Pin}</span>
                                            <button onClick={() => copyToClipboard(pin.pin || pin.Pin)} className="p-1 hover:bg-teal-100 rounded">
                                                <Copy size={14} className="text-teal-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Fallback if it's encoded in cardDetails instead */}
                        {details?.cardDetails && typeof details.cardDetails === 'string' && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">PIN Details</p>
                                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl">
                                    <span className="font-mono font-bold text-gray-800 tracking-wider break-all">{details.cardDetails}</span>
                                </div>
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
                <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={handleDownloadPDF}
                    isLoading={isExporting}
                >
                    <Download size={18} /> Save PDF
                </Button>
                <Button onClick={onClose} className="flex-1" fullWidth={false}>
                    Close
                </Button>
            </div>

            {/* Hidden Printable Receipt Template */}
            {createPortal(
                <div id="receipt-printable-area" style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    width: '600px',
                    padding: '40px',
                    background: 'white',
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
                }}>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .receipt-container { max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 8px; }
                        .header { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 20px; }
                        .header h1 { margin: 0; color: #111827; font-size: 24px; }
                        .header p { margin: 5px 0 0; color: #6b7280; font-size: 14px; }
                        .amount-section { text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
                        .amount-label { font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; }
                        .amount-value { font-size: 36px; font-weight: bold; margin: 10px 0; }
                        .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; text-transform: uppercase; }
                        .status-success { background-color: #def7ec; color: #03543f; }
                        .status-pending { background-color: #fef3c7; color: #92400e; }
                        .status-failed { background-color: #fde8e8; color: #9b1c1c; }
                        .details { margin-top: 20px; }
                        .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
                        .row:last-child { border-bottom: none; }
                        .label { color: #6b7280; font-weight: 500; }
                        .value { font-weight: 600; color: #111827; text-align: right; max-width: 60%; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; }
                        `
                    }} />

                    <div className="receipt-container">
                        <div className="header">
                            <h1>Transaction Receipt</h1>
                            <p>Generated on {new Date().toLocaleString()}</p>
                        </div>

                        <div className="amount-section">
                            <div className="amount-label">Amount</div>
                            <div className="amount-value" style={{ color: transaction.type === 'WALLET_FUNDING' ? '#059669' : '#111827' }}>
                                {transaction.type === 'WALLET_FUNDING' ? '+' : '-'}₦{Number(transaction.amount).toLocaleString()}
                            </div>
                            <div className={`status status-${transaction.status?.toLowerCase() || ''}`}>
                                {transaction.status || 'UNKNOWN'}
                            </div>
                        </div>

                        <div className="details">
                            <div className="row">
                                <span className="label">Type</span>
                                <span className="value">{transaction.type.replace('_', ' ')}</span>
                            </div>
                            <div className="row">
                                <span className="label">Date</span>
                                <span className="value">{new Date(transaction.date || (transaction as any).createdAt).toLocaleString()}</span>
                            </div>
                            <div className="row">
                                <span className="label">Reference</span>
                                <span className="value">{transaction.reference || transaction.id || 'No Reference'}</span>
                            </div>

                            {transaction.type === 'ELECTRICITY' && (
                                <div style={{ marginTop: '16px', marginBottom: '16px', padding: '20px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '16px' }}>
                                    <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
                                        DETAILS
                                    </div>
                                    {transaction.metadata?.token && (
                                        <div className="row" style={{ padding: '8px 0', borderBottom: 'none' }}>
                                            <span className="label" style={{ color: '#64748B' }}>Token</span>
                                            <span className="value" style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '16px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.5px' }}>
                                                {transaction.metadata.token}
                                            </span>
                                        </div>
                                    )}
                                    {transaction.metadata?.units && (
                                        <div className="row" style={{ padding: '8px 0', borderBottom: 'none' }}>
                                            <span className="label" style={{ color: '#64748B' }}>Units</span>
                                            <span className="value" style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                                                {transaction.metadata.units}
                                            </span>
                                        </div>
                                    )}
                                    {(transaction.metadata?.meterNumber || (transaction.metadata as any)?.meterNo) && (
                                        <div className="row" style={{ padding: '8px 0', borderBottom: 'none' }}>
                                            <span className="label" style={{ color: '#64748B' }}>Meter No</span>
                                            <span className="value" style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                                                {transaction.metadata.meterNumber || (transaction.metadata as any).meterNo}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {transaction.metadata?.planName && (
                                <div className="row">
                                    <span className="label">Plan</span>
                                    <span className="value">{transaction.metadata.planName}</span>
                                </div>
                            )}

                            {transaction.metadata?.network && (
                                <div className="row">
                                    <span className="label">Network</span>
                                    <span className="value">{transaction.metadata.network}</span>
                                </div>
                            )}

                            {/* Additional metadata fallbacks */}
                            {transaction.metadata && Object.entries(transaction.metadata).map(([key, value]) => {
                                if (!value || typeof value === 'object') return null;
                                if (['token', 'units', 'meterNumber', 'meterNo', 'planName', 'network'].includes(key)) return null;

                                const displayLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                return (
                                    <div key={key} className="row">
                                        <span className="label">{displayLabel}</span>
                                        <span className="value">{String(value)}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="footer">
                            <p>Thank you for using our service.</p>
                            <p style={{ color: '#cbd5e1', fontSize: '10px', marginTop: '5px' }}>This is an automated receipt.</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
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
