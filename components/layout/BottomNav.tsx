"use client"
import React from 'react';
import { Home, Printer, Clock, User, LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  icon: LucideIcon;
  label: string;
  route: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', route: '/user/dashboard' },
  { icon: Printer, label: 'Print', route: '/user/printing' },
  { icon: Clock, label: 'History', route: '/user/transactions' },
  { icon: User, label: 'Profile', route: '/user/profile' },
];

const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Floating Island Container 
        Centered, slightly elevated from the bottom, max-width matches a phone screen.
      */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
        
        {/* The Glass Panel 
          bg-white/30 + backdrop-blur-2xl creates the deep frosted glass.
        */}
        <div className="bg-white/30 backdrop-blur-2xl border border-white/40 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] rounded-[2rem] p-2 flex justify-between items-center relative overflow-hidden">
          
          {/* Subtle liquid shine gradient across the whole island */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/40 to-transparent opacity-50 pointer-events-none" />

          {navItems.map((item) => {
            const isActive = pathname === item.route;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.label} 
                href={item.route}
                // The group class allows us to trigger the background pill on hover
                className="relative z-10 flex flex-col items-center justify-center w-[4.5rem] py-2.5 transition-all duration-300 outline-none group"
              >
                {/* The Liquid Glass Pill
                  Detached from the DOM flow (absolute) so it expands smoothly 
                  without pushing other icons away.
                */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  isActive 
                    ? 'bg-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-white/60 backdrop-blur-md scale-100 opacity-100' 
                    : 'bg-white/20 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-active:scale-95'
                }`} />
                
                {/* Content Container (Icons & Text) */}
                <div className="relative z-20 transition-transform duration-300 group-active:scale-90 flex flex-col items-center">
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'
                    }`}
                  />
                  <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${
                    isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Spacer to prevent page content from hiding behind the floating island */}
      <div className="h-28" /> 
    </>
  );
};

export default BottomNav;