import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-slate-500 font-medium mb-12">Last Updated: March 6, 2026</p>

                    <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Introduction</h2>
                        <p>
                            Mufti Pay respects your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Information We Collect</h2>
                        <p>
                            We collect information that you manually provide to us (such as name, email address, phone number, and transaction details) and information we automatically collect when you interact with our platform (such as IP address, browser type, and device information).
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. How We Use Your Information</h2>
                        <p>
                            Your data is used to process your transactions, manage your account, provide customer support, improve our services, and send you important updates or promotional materials (which you can opt out of).
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Data Security</h2>
                        <p>
                            We implement robust security measures, including encryption and secure server hosting, to protect your personal data from unauthorized access, alteration, disclosure, or destruction. We do not store your full payment card details on our servers.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Third-Party Sharing</h2>
                        <p>
                            We may share your information with trusted third-party service providers (like payment gateways and notification services) strictly for the purpose of operating our service. We do not sell your personal data to third parties.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal data. If you wish to exercise these rights or have any privacy-related questions, please contact our support team.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
