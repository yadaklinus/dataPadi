"use client"
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, title }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Glassy Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[4px] z-[60]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-end justify-center z-[70] pointer-events-none">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full sm:max-w-md rounded-t-[2.5rem] p-6 pb-10 shadow-[0_-8px_40px_-15px_rgba(0,0,0,0.15)] pointer-events-auto max-h-[95vh] flex flex-col relative overflow-hidden
                         bg-white/85 backdrop-blur-2xl border-t border-l border-r border-white/60"
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.05}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  onClose();
                }
              }}
            >
              {/* Top Highlight Reflection (Simulates the curve of glass) */}
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

              {/* 2. Liquid Glass Drag Handle */}
              <div className="w-full flex justify-center mb-6 cursor-grab active:cursor-grabbing relative z-10">
                <div className="w-14 h-1.5 rounded-full bg-gray-400/30 shadow-inner backdrop-blur-md border border-white/50" />
              </div>

              {/* 3. Header Area */}
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
                
                {/* Glassy Close Button */}
                <button 
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-md border border-white/50 shadow-sm text-gray-600 transition-all active:scale-95"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Content Area */}
              <div className="overflow-y-auto no-scrollbar flex-1 pb-safe relative z-10">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;