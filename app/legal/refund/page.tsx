import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Image src="/muftiPay.png" alt="Mufti Pay Logo" width={160} height={40} className="object-contain" />
                        </div>
                    </Link>
                    <Link href="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="bg-white p-8 sm:p-16 rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                        <RefreshCcw size={32} />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Refund Policy</h1>
                    <p className="text-slate-500 font-medium mb-12">Last Updated: March 6, 2026</p>

                    <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Overview</h2>
                        <p>
                            At Mufti Pay, we strive to ensure that all transactions are processed smoothly. However, we understand that issues may occasionally arise. This policy outlines our guidelines for refunds.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Eligible for Refund</h2>
                        <p>
                            Refunds will generally be considered under the following circumstances:
                        </p>
                        <ul>
                            <li>You were charged for a service (e.g., data, airtime) but the value was not delivered due to a system error on our end or from our service providers.</li>
                            <li>You experienced duplicate charges for a single transaction attempt.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Not Eligible for Refund</h2>
                        <p>
                            We do not provide refunds for the following situations:
                        </p>
                        <ul>
                            <li>Entering an incorrect phone number or smart card details resulting in successful delivery to the wrong recipient.</li>
                            <li>Changing your mind after a transaction has been successfully processed and delivered.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Refund Process</h2>
                        <p>
                            To request a refund, please contact our support team providing your transaction reference, date, and a description of the issue. Eligible refunds are typically processed back to your Mufti Pay wallet within 24-48 hours. If a payment gateway refund is necessary, it may take 3-7 business days depending on your bank.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions or concerns regarding our Refund Policy, please reach out via our Help Center or the Contact Us page.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
