'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Zap, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Dynamic Header */}
            <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
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

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative hidden-scrollbar">
                {/* Animated Background Gradients */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30 -z-10">
                    <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-primary rounded-full blur-[100px] mix-blend-multiply animate-pulse" />
                    <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-success rounded-full blur-[120px] mix-blend-multiply animate-pulse delay-700" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-[0.2em] bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        Get in touch
                    </span>
                    <h1 className="font-extrabold text-5xl sm:text-7xl tracking-tighter text-slate-900 leading-[0.9] mb-6">
                        We'd love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">hear from you.</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Have a question, feedback, or need assistance? Drop us a message below and our team will get back to you shortly.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-6xl mx-auto">
                    {/* Contact Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <MapPin size={100} />
                            </div>
                            <div className="w-14 h-14 bg-white text-primary rounded-2xl shadow-sm flex items-center justify-center mb-6">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Our Headquarters</h3>
                            <p className="text-slate-500 font-medium">
                                123 Innovation Drive, Tech District<br />
                                Lagos, Nigeria 100001
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-4">
                                    <Mail size={20} />
                                </div>
                                <h4 className="font-bold mb-1">Email Us</h4>
                                <a href="mailto:support@muftipay.com" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">support@muftipay.com</a>
                            </div>
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:border-green-200 transition-colors">
                                <div className="w-12 h-12 bg-green-50 text-success rounded-xl flex items-center justify-center mb-4">
                                    <Phone size={20} />
                                </div>
                                <h4 className="font-bold mb-1">Call Us</h4>
                                <a href="tel:+2348000000000" className="text-sm font-medium text-slate-500 hover:text-success transition-colors">+234 (0) 800 000 0000</a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex-1 bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100"
                    >
                        <h3 className="text-2xl font-bold mb-8">Send a Message</h3>
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">First Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Last Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email Address</label>
                                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Subject</label>
                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium" placeholder="How can we help?" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Message</label>
                                <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium resize-none" placeholder="Your message here..."></textarea>
                            </div>
                            <button className="w-full bg-primary text-white font-bold rounded-2xl py-5 px-8 flex items-center justify-center gap-2 hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-blue-600/20 group">
                                Send Message <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
