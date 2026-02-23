import Link from 'next/link';
import { ArrowRight, Zap, Shield, Smartphone, Menu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      
      {/* --- NAVIGATION --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600">
            <Zap size={24} className="fill-blue-600" />
            <span>DataPadi</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-bold text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <button className="md:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="mx-auto max-w-4xl font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight text-slate-900 mb-6">
              The fastest way to buy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Airtime & Data.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed">
              Top up your phone, pay bills, and print recharge cards instantly. Experience seamless transactions with bank-grade security and zero hidden fees.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/register" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-base font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95"
              >
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link 
                href="#features" 
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-slate-700 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                See how it works
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to stay connected</h2>
              <p className="mt-4 text-lg text-slate-500">Built for speed, reliability, and everyday convenience.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Delivery</h3>
                <p className="text-slate-500 leading-relaxed">
                  No more waiting. Your data, airtime, and utility payments are processed and delivered in milliseconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="text-emerald-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-Grade Security</h3>
                <p className="text-slate-500 leading-relaxed">
                  Your funds are secured with industry-standard encryption. We never store your card details directly.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Mobile Optimized</h3>
                <p className="text-slate-500 leading-relaxed">
                  Manage your wallet and perform transactions seamlessly from any device, anywhere in the world.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <Zap size={20} className="fill-blue-600 text-blue-600" />
            <span>DataPadi</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} DataPadi Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}