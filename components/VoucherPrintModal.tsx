import React from 'react';
import { X, Printer } from 'lucide-react';
import Button from '@/components/ui/Button';

const CURRENCY = '₦';

export const VoucherPrintModal = ({ pinsToPrint, onClose }: { pinsToPrint: any[], onClose: () => void }) => {
  if (!pinsToPrint || pinsToPrint.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const getNetworkConfig = (network: string) => {
    const net = network.toUpperCase();
    switch (net) {
      case 'MTN': return { color: '#FFCC00', text: 'MTN', textColor: 'text-black' };
      case 'AIRTEL': return { color: '#FF0000', text: 'AIRTEL', textColor: 'text-white' };
      case 'GLO': return { color: '#1ab31a', text: 'GLO', textColor: 'text-white' };
      case '9MOBILE': return { color: '#006400', text: '9MOBILE', textColor: 'text-white' };
      default: return { color: '#2563eb', text: net, textColor: 'text-white' };
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 0; 
          }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            background: white; 
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm;
            height: 297mm;
          }
          nav, footer, .no-print { display: none !important; }
          
          #voucher-print-area {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
          }

          .voucher-card {
            height: 48mm !important; 
            border: 0.5pt solid #e2e8f0 !important;
            margin: 0 !important;
            display: flex;
            flex-direction: column;
            justify-content: flex-start; 
            padding: 8px !important; 
            background: #fff;
            page-break-inside: avoid;
            break-inside: avoid;
            box-sizing: border-box;
          }
        }
      `}} />

      <div className="fixed inset-0 z-[9999] flex flex-col bg-white overflow-hidden print:static print:h-auto print:block print:overflow-visible print:z-auto">

        <div className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white border-b print:hidden shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Printer size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black">Voucher Print Preview</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{pinsToPrint.length} Items Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <X size={24} />
            </button>
            <Button onClick={handlePrint} className="bg-blue-600 text-white px-8 h-12 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20">
              <Printer size={18} className="mr-2" /> Print Vouchers
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-100 print:bg-white print:p-0 print:block print:h-auto print:overflow-visible no-scrollbar">
          <div
            id="voucher-print-area"
            className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 gap-0 print:gap-0 print:w-full bg-white shadow-2xl print:shadow-none mx-auto max-w-5xl print:max-w-none p-8 print:p-0"
          >
            {pinsToPrint.map((pin, index) => {
              const config = getNetworkConfig(pin.network || 'MTN');
              return (
                <div key={`${pin.id}-${index}`} className="voucher-card break-inside-avoid border-slate-200">

                  {/* 1. Header Section */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <div
                        style={{ backgroundColor: config.color }}
                        className={`p-0.5 rounded flex items-center justify-center h-4 w-7`}
                      >
                        <span className={`text-[5px] font-black ${config.textColor}`}>{config.text}</span>
                      </div>
                      <span className="text-[8px] font-black text-slate-900 tracking-tight">
                        {CURRENCY}{pin.denomination}
                      </span>
                    </div>
                    <span className="text-[5px] font-black text-slate-400 uppercase">DataPadi</span>
                  </div>

                  {/* 2. PIN Section */}
                  <div className="bg-slate-50 border border-slate-100 p-1 rounded-lg mb-1">
                    <div className="flex items-center justify-center">
                      <span className="text-[10px] font-mono font-black tracking-[0.05em] text-slate-900 text-center">
                        {pin.pinCode.replace(/(.{4})/g, '$1 ')}
                      </span>
                    </div>
                  </div>

                  {/* 3. Info Section */}
                  <div className="flex justify-between items-center text-[5px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                    <span>S/N: {pin.serialNumber}</span>
                    <span>Date: {new Date().toLocaleDateString()}</span>
                  </div>

                  {/* 4. Dial Code Section */}
                  <div className="mt-auto border-t border-dashed border-slate-200 pt-0.5">
                    <p className="text-[5px] font-black text-slate-900 text-center">
                      Recharge: *311*{pin.pinCode}#
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};