"use client"
import React from 'react';
import { Transaction, TransactionStatus } from '@/types/types';
import BottomSheet from './BottomSheet';
import { CheckCircle, XCircle, Clock, Copy, Download, Zap, Wifi, Tv, GraduationCap, Wallet, Plane } from 'lucide-react';
import { CURRENCY } from '@/constants';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const isVal = (v: unknown): v is string =>
    v !== null && v !== undefined && String(v).trim() !== '' && String(v).trim().toLowerCase() !== 'n/a';

const fmt = (v: unknown) => String(v ?? '');

const getStatusStyles = (status: TransactionStatus) => {
    switch (status) {
        case TransactionStatus.SUCCESS:
            return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', dot: '#22c55e' };
        case TransactionStatus.FAILED:
            return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3', dot: '#f43f5e' };
        case TransactionStatus.PENDING:
            return { bg: '#fffbeb', text: '#d97706', border: '#fde68a', dot: '#f59e0b' };
        default:
            return { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb', dot: '#9ca3af' };
    }
};

const TYPE_META: Record<string, { label: string; color: string; lightColor: string }> = {
    AIRTIME:        { label: 'Airtime',           color: '#f59e0b', lightColor: '#fffbeb' },
    DATA:           { label: 'Data',              color: '#6366f1', lightColor: '#eef2ff' },
    ELECTRICITY:    { label: 'Electricity',       color: '#f97316', lightColor: '#fff7ed' },
    CABLE_TV:       { label: 'Cable TV',          color: '#0ea5e9', lightColor: '#f0f9ff' },
    CABLE:          { label: 'Cable TV',          color: '#0ea5e9', lightColor: '#f0f9ff' },
    EDUCATION:      { label: 'Education',         color: '#10b981', lightColor: '#f0fdf4' },
    WALLET_FUNDING: { label: 'Wallet Funding',    color: '#8b5cf6', lightColor: '#f5f3ff' },
    FLIGHT:         { label: 'Flight',            color: '#3b82f6', lightColor: '#eff6ff' },
};

// ─── Electricity lookup maps ─────────────────────────────────────────────────

const DISCO_MAP: Record<string, string> = {
    '01': 'Eko Electric',
    '02': 'Ikeja Electric',
    '03': 'Abuja Electric',
    '04': 'Kano Electric',
    '05': 'Port Harcourt Electric',
    '06': 'Jos Electric',
    '07': 'Ibadan Electric',
    '08': 'Kaduna Electric',
    '09': 'Enugu Electric',
    '10': 'Benin Electric',
    '11': 'Yola Electric',
    '12': 'Aba Electric',
};

const METER_TYPE_MAP: Record<string, string> = {
    '01': 'Prepaid',
    '02': 'Postpaid',
};

/** Resolve a provider code or slug to a display name */
const resolveProvider = (raw: unknown): string => {
    if (!raw) return '';
    const s = String(raw).trim();
    // Numeric code e.g. "03"
    if (DISCO_MAP[s]) return DISCO_MAP[s];
    // Slug e.g. "abuja-electric" → title-case
    return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

/** Resolve a meter type code to Prepaid / Postpaid */
const resolveMeterType = (raw: unknown): string => {
    if (!raw) return '';
    const s = String(raw).trim();
    return METER_TYPE_MAP[s] || s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

// ─── Receipt HTML builder ────────────────────────────────────────────────────

const buildReceiptHTML = (transaction: Transaction, logoDataUrl: string): string => {
    const meta = transaction.metadata as any;
    const type = (transaction.type as string).toUpperCase();
    const tm = TYPE_META[type] || { label: type.replace(/_/g, ' '), color: '#6b7280', lightColor: '#f9fafb' };
    const ss = getStatusStyles(transaction.status);
    const isCredit = type === 'WALLET_FUNDING';
    const amountColor = isCredit ? '#16a34a' : '#111827';
    const amountPrefix = isCredit ? '+' : '-';
    const date = new Date(transaction.date || (transaction as any).createdAt).toLocaleString('en-NG', {
        dateStyle: 'medium', timeStyle: 'short'
    });
    const ref = transaction.reference || transaction.id || 'N/A';

    // Build type-specific rows
    const rows: Array<{ label: string; value: string; mono?: boolean; highlight?: boolean }> = [];

    const add = (label: string, value: unknown, mono = false, highlight = false) => {
        if (isVal(value)) rows.push({ label, value: fmt(value), mono, highlight });
    };

    switch (type) {
        case 'AIRTIME':
            add('Network', meta?.network);
            add('Beneficiary', meta?.phoneNumber, true);
            break;
        case 'DATA':
            add('Network', meta?.network);
            add('Plan', meta?.plan);
            add('Beneficiary', meta?.phoneNumber, true);
            break;
        case 'ELECTRICITY':
            add('Provider', resolveProvider(meta?.provider || meta?.discoCode));
            add('Meter Type', resolveMeterType(meta?.meterType));
            add('Meter Number', meta?.meterNumber || meta?.meterNo, true);
            add('Customer Name', meta?.customerName);
            add('Address', meta?.address);
            if (isVal(meta?.token)) add('Token', meta.token, true, true);
            if (isVal(meta?.units))  add('Units', meta.units + ' kWh');
            break;
        case 'CABLE_TV':
        case 'CABLE':
            add('Provider', meta?.provider);
            add('Package', meta?.plan || meta?.planName);
            add('Smart Card / IUC', meta?.smartCardNumber, true);
            add('Customer Name', meta?.customerName);
            break;
        case 'EDUCATION':
            const examLabel = meta?.examType === 'utme-mock' ? 'JAMB UTME (With Mock)'
                            : meta?.examType === 'utme-no-mock' ? 'JAMB UTME (No Mock)'
                            : meta?.provider || 'Education PIN';
            add('Exam Body', examLabel);
            add('Customer Name', meta?.customerName);
            add('Plan', meta?.plan);
            add('Quantity', meta?.quantity);
            add('Profile ID', meta?.profileId);
            add('Phone Number', meta?.phoneNumber, true);
            break;
        case 'WALLET_FUNDING':
            add('Funding Source', meta?.source || meta?.bankName);
            add('Account Number', meta?.accountNumber, true);
            add('Account Name', meta?.accountName);
            break;
        default:
            if (meta && typeof meta === 'object') {
                Object.entries(meta).forEach(([k, v]) => {
                    if (isVal(v) && typeof v !== 'object') {
                        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                        add(label, v);
                    }
                });
            }
    }

    // Education PINs
    let pinsHTML = '';
    if (type === 'EDUCATION') {
        if (meta?.pins && Array.isArray(meta.pins) && meta.pins.length > 0) {
            const pinRows = meta.pins.map((p: any) => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:10px 14px; font-size:12px; color:#64748b; vertical-align:top;">${p.serial || p.Serial || '—'}</td>
                    <td style="padding:10px 14px; font-family:'Courier New',monospace; font-size:14px; font-weight:900; color:#0f172a; letter-spacing:2px;">${p.pin || p.Pin || ''}</td>
                </tr>`).join('');
            pinsHTML = `
                <div style="margin-top:24px; border:2px solid #d1fae5; border-radius:12px; overflow:hidden;">
                    <div style="background:#ecfdf5; padding:12px 16px; display:flex; align-items:center; gap:8px;">
                        <span style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:#059669;">Purchased PINs (${meta.pins.length})</span>
                    </div>
                    <table style="width:100%; border-collapse:collapse; background:#fff;">
                        <thead>
                            <tr style="background:#f0fdf4;">
                                <th style="padding:9px 14px; font-size:11px; text-align:left; color:#6ee7b7; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Serial</th>
                                <th style="padding:9px 14px; font-size:11px; text-align:left; color:#6ee7b7; font-weight:700; text-transform:uppercase; letter-spacing:1px;">PIN</th>
                            </tr>
                        </thead>
                        <tbody>${pinRows}</tbody>
                    </table>
                </div>`;
        } else if (meta?.cardDetails && typeof meta.cardDetails === 'string') {
            // Fallback: raw card details string
            pinsHTML = `
                <div style="margin-top:24px; border:2px solid #d1fae5; border-radius:12px; overflow:hidden;">
                    <div style="background:#ecfdf5; padding:12px 16px;">
                        <span style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:#059669;">PIN Details</span>
                    </div>
                    <div style="padding:14px 16px; font-family:'Courier New',monospace; font-size:14px; font-weight:700; color:#0f172a; word-break:break-all; letter-spacing:1px; background:#fff;">
                        ${meta.cardDetails}
                    </div>
                </div>`;
        }
    }

    const rowsHTML = rows.map(r => `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; padding:12px 0; border-bottom:1px solid #f1f5f9; gap:16px;">
            <span style="font-size:13px; color:#94a3b8; font-weight:500; white-space:nowrap; shrink:0;">${r.label}</span>
            <span style="font-size:13px; font-weight:${r.highlight ? '900' : '700'}; color:${r.highlight ? tm.color : '#0f172a'}; text-align:right; word-break:break-all;
                ${r.mono ? "font-family:'Courier New',monospace; letter-spacing:1px;" : ''}
                ${r.highlight ? `background:${tm.lightColor}; padding:4px 10px; border-radius:6px;` : ''}">
                ${r.value}
            </span>
        </div>`).join('');

    const logoRow = logoDataUrl ? `<img src="${logoDataUrl}" style="height:36px; display:block;" alt="MuftiPay" />` : `<div style="font-size:20px; font-weight:900; color:#7c3aed;">MuftiPay</div>`;

    return `
    <div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background:#ffffff; width:600px; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, ${tm.color} 100%); padding:32px 36px 24px; position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px;">
                ${logoRow}
                <div style="text-align:right;">
                    <div style="font-size:11px; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:2px; margin-bottom:4px;">Receipt</div>
                    <div style="font-size:11px; color:rgba(255,255,255,0.5); font-family:'Courier New',monospace;">#${ref.slice(-12).toUpperCase()}</div>
                </div>
            </div>

            <!-- Amount -->
            <div style="margin-bottom:4px; font-size:13px; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:2px;">Total Amount</div>
            <div style="font-size:48px; font-weight:900; color:#ffffff; letter-spacing:-1px; line-height:1;">${amountPrefix}₦${Number(transaction.amount).toLocaleString()}</div>

            <!-- Status chip -->
            <div style="margin-top:16px; display:flex; align-items:center; gap:8px;">
                <span style="display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:20px;
                    background:${ss.bg}; color:${ss.text}; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; border:1px solid ${ss.border};">
                    <span style="width:7px; height:7px; border-radius:50%; background:${ss.dot}; display:inline-block;"></span>
                    ${transaction.status ?? 'UNKNOWN'}
                </span>
                <span style="padding:5px 14px; border-radius:20px; background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.8); font-size:12px; font-weight:700; letter-spacing:0.5px;">
                    ${tm.label}
                </span>
            </div>
        </div>

        <!-- Body -->
        <div style="padding:28px 36px;">

            <!-- Core details -->
            <div style="margin-bottom:4px; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:2.5px; color:#94a3b8;">Transaction Details</div>
            <div style="border-bottom:1px solid #f1f5f9; margin-bottom:0;">
                <div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #f1f5f9;">
                    <span style="font-size:13px; color:#94a3b8; font-weight:500;">Date</span>
                    <span style="font-size:13px; font-weight:700; color:#0f172a;">${date}</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #f1f5f9; gap:16px;">
                    <span style="font-size:13px; color:#94a3b8; font-weight:500; white-space:nowrap;">Reference</span>
                    <span style="font-size:12px; font-weight:700; color:#0f172a; font-family:'Courier New',monospace; word-break:break-all; text-align:right;">${ref}</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #f1f5f9;">
                    <span style="font-size:13px; color:#94a3b8; font-weight:500;">Description</span>
                    <span style="font-size:13px; font-weight:700; color:#0f172a; text-align:right; max-width:55%;">${transaction.description || '-'}</span>
                </div>

                ${rowsHTML}
            </div>

            ${pinsHTML}

            <!-- Footer -->
            <div style="margin-top:32px; padding-top:20px; border-top:1px dashed #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-size:13px; font-weight:800; color:#1e1b4b;">MuftiPay</div>
                    <div style="font-size:11px; color:#94a3b8; margin-top:2px;">Secure · Fast · Reliable</div>
                </div>
                <div style="text-align:right; font-size:11px; color:#cbd5e1;">
                    <div>Generated ${new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                    <div style="margin-top:2px; color:#e2e8f0;">This is an automated receipt</div>
                </div>
            </div>
        </div>
    </div>`;
};

// ─── Component ───────────────────────────────────────────────────────────────

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onClose, transaction }) => {
    if (!transaction) return null;

    const [isExporting, setIsExporting] = React.useState(false);
    const [copied, setCopied] = React.useState<string | null>(null);

    const meta = transaction.metadata as any;
    const type = (transaction.type as string).toUpperCase();
    const tm = TYPE_META[type] || { label: type.replace(/_/g, ' '), color: '#6b7280', lightColor: '#f9fafb' };
    const ss = getStatusStyles(transaction.status);
    const isCredit = type === 'WALLET_FUNDING';

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const TypeIcon = () => {
        const cls = "shrink-0";
        switch (type) {
            case 'AIRTIME':         return <Zap size={22} className={cls} />;
            case 'DATA':            return <Wifi size={22} className={cls} />;
            case 'ELECTRICITY':     return <Zap size={22} className={cls} />;
            case 'CABLE_TV':
            case 'CABLE':           return <Tv size={22} className={cls} />;
            case 'EDUCATION':       return <GraduationCap size={22} className={cls} />;
            case 'WALLET_FUNDING':  return <Wallet size={22} className={cls} />;
            case 'FLIGHT':          return <Plane size={22} className={cls} />;
            default:                return <Zap size={22} className={cls} />;
        }
    };

    const StatusIcon = () => {
        switch (transaction.status) {
            case TransactionStatus.SUCCESS: return <CheckCircle size={44} style={{ color: ss.dot }} />;
            case TransactionStatus.FAILED:  return <XCircle size={44} style={{ color: ss.dot }} />;
            default:                         return <Clock size={44} style={{ color: ss.dot }} />;
        }
    };

    const handleDownloadPDF = async () => {
        setIsExporting(true);
        try {
            // Fetch the logo and convert to data URL so it embeds into the PDF
            let logoDataUrl = '';
            try {
                const resp = await fetch('/muftiPay.png');
                const blob = await resp.blob();
                logoDataUrl = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
            } catch { /* logo optional */ }

            const container = document.createElement('div');
            container.style.cssText = [
                'position:fixed', 'top:0', 'left:0', 'width:640px',
                'background:#f8fafc', 'z-index:-9999', 'opacity:1',
                'pointer-events:none', 'padding:20px',
            ].join(';');
            container.innerHTML = buildReceiptHTML(transaction, logoDataUrl);
            document.body.appendChild(container);

            // Give browser a frame to paint
            await new Promise(r => requestAnimationFrame(() => setTimeout(r, 80)));

            const imgData = await toPng(container, { pixelRatio: 2, backgroundColor: '#f8fafc' });
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`MuftiPay_Receipt_${transaction.reference || transaction.id}.pdf`);

            document.body.removeChild(container);
        } catch (err) {
            console.error('PDF Error:', err);
        } finally {
            setIsExporting(false);
        }
    };

    // ── Screen detail panels per type ─────────────────────────────────────
    const renderDetails = () => {
        const flightBooking = (transaction as any).flightBooking;

        switch (type) {
            case 'AIRTIME':
                return (
                    <div className="space-y-0 divide-y divide-gray-50">
                        <DetailRow label="Network" value={meta?.network} />
                        <DetailRow label="Beneficiary" value={meta?.phoneNumber} mono />
                    </div>
                );

            case 'DATA':
                return (
                    <div className="space-y-0 divide-y divide-gray-50">
                        <DetailRow label="Network" value={meta?.network} />
                        <DetailRow label="Plan" value={meta?.plan} />
                        <DetailRow label="Beneficiary" value={meta?.phoneNumber} mono />
                    </div>
                );

            case 'ELECTRICITY':
                return (
                    <div className="space-y-0 divide-y divide-gray-50">
                        <DetailRow label="Provider" value={resolveProvider(meta?.provider || meta?.discoCode)} />
                        <DetailRow label="Meter Type" value={resolveMeterType(meta?.meterType)} />
                        <DetailRow label="Meter Number" value={meta?.meterNumber || meta?.meterNo} mono />
                        <DetailRow label="Customer Name" value={meta?.customerName} />
                        <DetailRow label="Address" value={meta?.address} />
                        {isVal(meta?.token) && (
                            <div className="pt-4">
                                <div style={{ background: tm.lightColor, border: `1px solid ${tm.color}30` }} className="rounded-2xl p-4">
                                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: tm.color }}>Electricity Token</p>
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-mono font-black text-lg text-gray-900 tracking-widest break-all">{meta.token}</p>
                                        <button onClick={() => copyToClipboard(meta.token, 'token')} className="p-2 rounded-xl transition-colors" style={{ background: `${tm.color}15` }}>
                                            <Copy size={15} style={{ color: tm.color }} />
                                        </button>
                                    </div>
                                    {isVal(meta?.units) && (
                                        <p className="text-sm mt-2 font-semibold" style={{ color: tm.color }}>Units: <strong>{meta.units} kWh</strong></p>
                                    )}
                                    {copied === 'token' && <p className="text-xs mt-1 text-emerald-600 font-bold">✓ Copied!</p>}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'CABLE_TV':
            case 'CABLE':
                return (
                    <div className="space-y-0 divide-y divide-gray-50">
                        <DetailRow label="Provider" value={meta?.provider} />
                        <DetailRow label="Package" value={meta?.plan || meta?.planName} />
                        <DetailRow label="Smart Card / IUC" value={meta?.smartCardNumber} mono />
                        <DetailRow label="Customer Name" value={meta?.customerName} />
                    </div>
                );

            case 'EDUCATION':
                const examLabel = meta?.examType === 'utme-mock' ? 'JAMB UTME (With Mock)'
                                : meta?.examType === 'utme-no-mock' ? 'JAMB UTME (No Mock)'
                                : meta?.provider || 'Education PIN';
                return (
                    <div className="space-y-0 divide-y divide-gray-50">
                        <DetailRow label="Exam Body" value={examLabel} />
                        <DetailRow label="Customer Name" value={meta?.customerName} />
                        <DetailRow label="Plan" value={meta?.plan} />
                        <DetailRow label="Quantity" value={meta?.quantity} />
                        <DetailRow label="Profile ID" value={meta?.profileId} />
                        <DetailRow label="Phone Number" value={meta?.phoneNumber} mono />
                        {meta?.pins && Array.isArray(meta.pins) && meta.pins.length > 0 && (
                            <div className="pt-4">
                                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Purchased PINs</p>
                                <div className="space-y-2">
                                    {meta.pins.map((pin: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                            <div>
                                                <p className="text-xs text-emerald-600 font-semibold">Serial: {pin.serial || pin.Serial}</p>
                                                <p className="font-mono font-bold text-gray-900 tracking-wider">{pin.pin || pin.Pin}</p>
                                            </div>
                                            <button onClick={() => copyToClipboard(pin.pin || pin.Pin, `pin_${i}`)} className="p-1.5 hover:bg-emerald-100 rounded-lg">
                                                <Copy size={14} className="text-emerald-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {meta?.cardDetails && typeof meta.cardDetails === 'string' && (
                            <div className="pt-4">
                                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">PIN Details</p>
                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <span className="font-mono font-bold text-gray-800 tracking-wider break-all">{meta.cardDetails}</span>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'WALLET_FUNDING':
                return (
                    <div className="space-y-0 divide-y divide-gray-50">
                        <DetailRow label="Funding Source" value={meta?.source || meta?.bankName} />
                        <DetailRow label="Account Number" value={meta?.accountNumber} mono />
                        <DetailRow label="Account Name" value={meta?.accountName} />
                    </div>
                );

            case 'FLIGHT':
                const flight = flightBooking?.flight;
                const passengers = flightBooking?.passengers;
                return (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="font-bold text-gray-800 mb-3 text-sm">Flight Information</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    { label: 'Airline', value: flight?.airline },
                                    { label: 'Flight No', value: flight?.flightNumber },
                                    { label: 'Route', value: flight ? `${flight?.departure?.code} → ${flight?.arrival?.code}` : null },
                                    { label: 'PNR', value: flightBooking?.pnr, mono: true },
                                ].filter(r => isVal(r.value)).map(r => (
                                    <div key={r.label}>
                                        <span className="text-gray-400 text-xs block">{r.label}</span>
                                        <span className={`font-bold text-gray-900 ${r.mono ? 'font-mono tracking-wider' : ''}`}>{r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {passengers && passengers.length > 0 && (
                            <div>
                                <p className="font-bold text-gray-800 mb-2 text-sm">Passengers</p>
                                <div className="space-y-2">
                                    {passengers.map((p: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 text-sm">
                                            <span className="font-medium text-gray-700">{p.title} {p.firstName} {p.lastName}</span>
                                            <span className="text-blue-600 font-bold">{p.seatNumber || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return meta ? (
                    <div className="space-y-0 divide-y divide-gray-50">
                        {Object.entries(meta).filter(([, v]) => isVal(v) && typeof v !== 'object').map(([k, v]) => (
                            <DetailRow key={k} label={k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} value={String(v)} />
                        ))}
                    </div>
                ) : <p className="text-gray-400 text-sm text-center">No additional details.</p>;
        }
    };

    // ── Screen render ─────────────────────────────────────────────────────
    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Transaction Details">
            {/* Header hero */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl overflow-hidden mb-5"
                style={{ background: `linear-gradient(135deg, #1e1b4b, #312e81 60%, ${tm.color})` }}
            >
                <div className="p-5">
                    {/* Type badge */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-3 py-1.5" style={{ color: 'white' }}>
                            <TypeIcon />
                            <span className="text-xs font-bold uppercase tracking-wider text-white/90">{tm.label}</span>
                        </div>
                        {/* Status */}
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                            style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.border}` }}>
                            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: ss.dot }}></span>
                            {transaction.status}
                        </span>
                    </div>

                    {/* Amount */}
                    <p className="text-sm text-white/50 uppercase tracking-widest mb-1">
                        {isCredit ? 'Amount Received' : 'Amount Paid'}
                    </p>
                    <p className={`text-4xl font-black tracking-tight ${isCredit ? 'text-emerald-300' : 'text-white'}`}>
                        {isCredit ? '+' : '-'}{CURRENCY}{Number(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-white/50 text-sm mt-1.5">{transaction.description}</p>
                </div>
            </motion.div>

            {/* Core meta card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
                <div className="divide-y divide-gray-50">
                    <DetailRow label="Date" value={new Date(transaction.date || (transaction as any).createdAt).toLocaleString()} />
                    <DetailRow
                        label="Reference"
                        value={transaction.reference || transaction.id}
                        mono
                        action={() => copyToClipboard(transaction.reference || transaction.id || '', 'ref')}
                        actionLabel={copied === 'ref' ? '✓' : undefined}
                    />
                    <DetailRow label="Type" value={tm.label} />
                </div>
            </div>

            {/* Type-specific details */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Additional Details</p>
                {renderDetails()}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2 h-13 rounded-2xl"
                    onClick={handleDownloadPDF}
                    isLoading={isExporting}
                >
                    <Download size={17} /> Save PDF
                </Button>
                <Button onClick={onClose} className="flex-1 h-13 rounded-2xl" fullWidth={false}>
                    Close
                </Button>
            </div>
        </BottomSheet>
    );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const DetailRow: React.FC<{
    label: string;
    value?: string | number;
    mono?: boolean;
    action?: () => void;
    actionLabel?: string;
}> = ({ label, value, mono, action, actionLabel }) => {
    if (!isVal(value)) return null;
    return (
        <div className="flex justify-between items-start py-3 gap-4">
            <span className="text-gray-400 text-sm shrink-0">{label}</span>
            <div className="flex items-center gap-2 min-w-0">
                <span className={`text-sm font-bold text-gray-900 text-right break-words ${mono ? 'font-mono tracking-wide' : ''}`}>
                    {value}
                </span>
                {action && (
                    <button onClick={action} className="p-1 rounded-lg hover:bg-gray-100 shrink-0 transition-colors">
                        {actionLabel
                            ? <span className="text-xs text-emerald-600 font-bold">{actionLabel}</span>
                            : <Copy size={13} className="text-gray-400" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransactionDetailsModal;
