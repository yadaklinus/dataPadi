import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function TermsOfUsePage() {
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
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Terms of Use</h1>
                    <p className="text-slate-500 font-medium mb-12">Last Updated: March 6, 2026</p>

                    <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Mufti Pay ("the Service"), you agree to abide by these Terms of Use and all applicable laws and regulations. If you do not agree with these terms, you are prohibited from using or accessing this site.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
                        <p>
                            Mufti Pay provides a platform to facilitate the purchase and management of digital products, including but not limited to airtime, data, cable TV subscriptions, and electricity bill payments. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. User Responsibilities</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use or security breach.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Payment and Transactions</h2>
                        <p>
                            All payments made via the platform are final unless stated otherwise in our Refund Policy. It is your responsibility to ensure the accuracy of the recipient information (e.g., phone numbers, smart card numbers) before completing a transaction.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Limitation of Liability</h2>
                        <p>
                            In no event shall Mufti Pay or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Changes to Terms</h2>
                        <p>
                            We may revise these Terms of Use at any time without notice. By using this website, you agree to be bound by the then-current version of these Terms of Use.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
