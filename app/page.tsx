'use client'

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, Zap, Shield, Smartphone, Menu, Wifi,
  Tv, CreditCard, Printer, CheckCircle2, ChevronRight,
  Globe, Clock, Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';

const Services = [
  {
    icon: Wifi,
    title: 'Data Top-up',
    desc: 'Cheap data plans for all networks (MTN, Airtel, Glo, 9mobile).',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: Smartphone,
    title: 'Airtime VTU',
    desc: 'Instant airtime recharge with discount on every purchase.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    icon: Tv,
    title: 'Cable TV',
    desc: 'Renew your DStv, GOtv, and Startimes subscriptions instantly.',
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    icon: Zap,
    title: 'Electricity Bills',
    desc: 'Pay electricity bills for all major DISCOs without stress.',
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    icon: Printer,
    title: 'Card Printing',
    desc: 'Print recharge cards and data pins for resale at profit.',
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  }
];

const Features = [
  { icon: Clock, title: '99.9% Uptime', desc: 'Our services are available 24/7 for your convenience.' },
  { icon: Shield, title: 'Secure Payments', desc: 'Bank-grade security for all your financial transactions.' },
  { icon: Headphones, title: 'Premium Support', desc: 'Dedicated team to assist you with any inquiries.' }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

      {/* --- NAVIGATION --- */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">DataPadi</span>
          </Link>

          <nav className="hidden lg:flex gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#services" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link href="#features" className="hover:text-blue-600 transition-colors">Why Us</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 px-4">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-slate-900 text-white text-sm font-bold px-7 py-3 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Get Started
            </Link>
            <button className="lg:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">

        {/* --- HERO SECTION --- */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-300 rounded-full blur-[120px] mix-blend-multiply animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-300 rounded-full blur-[150px] mix-blend-multiply animate-pulse delay-1000" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-[0.2em] bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                    Trusted by 50,000+ Nigerians
                  </span>
                  <h1 className="font-extrabold text-6xl sm:text-7xl lg:text-8xl tracking-tighter text-slate-900 leading-[0.9] mb-8">
                    Smart Way <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">to Connect.</span>
                  </h1>
                  <p className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-slate-500 mb-12 leading-relaxed font-medium">
                    The ultimate platform for instant Data, Airtime, Cable TV, and Utility payments. Fast, secure, and built for your daily needs.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Link
                      href="/auth/register"
                      className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-[2rem] text-lg font-bold hover:bg-slate-900 transition-all active:scale-95 shadow-2xl shadow-blue-600/30"
                    >
                      Start For Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="#services"
                      className="w-full sm:w-auto px-10 py-5 rounded-[2rem] text-lg font-bold text-slate-700 bg-white border-2 border-slate-100 hover:border-blue-600 hover:text-blue-600 transition-all"
                    >
                      Our Services
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Dynamic Service Preview Cards */}
              <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-4 pt-8">
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Wifi size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">Data SME</h4>
                      <p className="text-sm text-slate-500 font-medium">1GB from ₦260</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform cursor-default">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                        <Smartphone size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">Airtime VTU</h4>
                      <p className="text-sm text-slate-500 font-medium">3% Discount</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl shadow-slate-900/20 text-white transform rotate-3 hover:rotate-0 transition-transform cursor-default">
                      <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-4">
                        <Printer size={24} />
                      </div>
                      <h4 className="font-bold mb-1">Pins Printing</h4>
                      <p className="text-sm text-blue-200 font-medium">Instant Generation</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                        <Zap size={24} fill="currentColor" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">Utilities</h4>
                      <p className="text-sm text-slate-500 font-medium">Zero Fee</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SERVICES SECTION --- */}
        <section id="services" className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900/[0.02] -z-10" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 underline decoration-blue-600 decoration-8 underline-offset-8">All Your Services in One Place</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">Everything you need to keep your digital life running smoothly. Reliable, fast, and automated.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Services.map((service, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 transition-all group"
                >
                  <div className={`w-14 h-14 ${service.bg} ${service.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-6">
                    {service.desc}
                  </p>
                  <Link href="/auth/register" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:gap-3 transition-all">
                    Get Started <ChevronRight size={18} />
                  </Link>
                </motion.div>
              ))}

              {/* Wallet Funding Teaser */}
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/30 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                    <CreditCard size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Instant Wallet Funding</h3>
                  <p className="text-blue-100 font-medium leading-relaxed">
                    Fund your wallet via dedicated virtual accounts or card payments. Your balance updates in seconds.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/20 flex items-center justify-between">
                  <span className="font-bold">Automated & Secure</span>
                  <CheckCircle2 size={24} className="text-emerald-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- FEATURES / WHY US SECTION --- */}
        <section id="features" className="py-32 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 mb-8 leading-tight">
                  Engineered for <br />
                  <span className="text-blue-600">Pure Performance.</span>
                </h2>
                <div className="space-y-8">
                  {Features.map((f, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900">
                        <f.icon size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 mb-1">{f.title}</h4>
                        <p className="text-slate-500 font-medium">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="bg-slate-50 rounded-[3rem] p-8 lg:p-12 border border-slate-100 relative">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl rotate-12">
                    +3%
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-8">Member Benefits</h3>
                  <ul className="space-y-4">
                    {['Wholesale prices for resellers', 'Dedicated API for developers', 'Detailed transaction history', 'Email & SMS notifications', 'Referral bonuses on every user'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4 text-slate-600 font-bold">
                        <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                          <CheckCircle2 size={14} fill="currentColor" className="text-emerald-100" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-12">
                    <Link
                      href="/auth/register"
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors"
                    >
                      Join Now <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PRICING TEASER --- */}
        <section id="pricing" className="py-32 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Unbeatable Rates</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Save more on every transaction</p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-8 text-sm font-bold uppercase tracking-widest">Network</th>
                      <th className="p-8 text-sm font-bold uppercase tracking-widest">Plan</th>
                      <th className="p-8 text-sm font-bold uppercase tracking-widest">Price</th>
                      <th className="p-8 text-sm font-bold uppercase tracking-widest">Validity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { net: 'MTN', plan: '1GB SME', price: '₦260', valid: '30 Days' },
                      { net: 'Airtel', plan: '1GB Corporate', price: '₦255', valid: '30 Days' },
                      { net: 'Glo', plan: '1GB Gift', price: '₦245', valid: '14 Days' },
                      { net: '9mobile', plan: '1GB SME', price: '₦200', valid: '30 Days' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-8 font-black text-slate-900 group-hover:text-blue-600">{row.net}</td>
                        <td className="p-8 font-bold text-slate-500">{row.plan}</td>
                        <td className="p-8 font-black text-slate-900">{row.price}</td>
                        <td className="p-8 font-bold text-slate-500">{row.valid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-blue-50/50 text-center">
                <Link href="/auth/register" className="font-bold text-blue-600 hover:underline">View all plans and rates &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600 -z-10" />
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-4xl sm:text-6xl font-black mb-10 tracking-tight leading-tight">
              Ready to automate your <br />
              Digital Lifestyle?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto bg-white text-blue-600 px-12 py-6 rounded-[2rem] text-xl font-bold hover:bg-slate-900 hover:text-white transition-all shadow-2xl active:scale-95"
              >
                Create Account Now
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto bg-blue-700 text-white px-12 py-6 rounded-[2rem] text-xl font-bold hover:bg-blue-800 transition-all border border-white/20"
              >
                Sign In Instead
              </Link>
            </div>
            <p className="mt-12 text-blue-100 font-medium">Join 50,000+ users who trust DataPadi daily.</p>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <Zap size={28} className="text-blue-500 fill-blue-500" />
                <span className="font-black text-2xl tracking-tight">DataPadi</span>
              </Link>
              <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-8">
                DataPadi is Nigeria's leading automated airtime, data and utility payment platform. We empower individuals and businesses with fast digital solutions.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                    <Globe size={18} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-black text-sm uppercase tracking-widest mb-8">Services</h5>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Buy Data</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Buy Airtime</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Cable TV</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Electricity</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Cards Printing</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-sm uppercase tracking-widest mb-8">Support</h5>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">WhatsApp Support</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">API Channels</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-sm uppercase tracking-widest mb-8">Legal</h5>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-sm font-bold">
            <p>© {new Date().getFullYear()} DataPadi Inc. Made for Nigeria. 🇳🇬</p>
            <div className="flex gap-8">
              <span>Secure by Cloudflare</span>
              <span>Encrypted SSL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}