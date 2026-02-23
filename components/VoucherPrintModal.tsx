import React from 'react';
import { X, Printer } from 'lucide-react';
import Button from '@/components/ui/Button';

const CURRENCY = '₦';

export const VoucherPrintModal = ({ pinsToPrint, onClose }: { pinsToPrint: any[], onClose: () => void }) => {
  if (!pinsToPrint || pinsToPrint.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
     <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { 
            size: A4; 
            margin: 0; 
          }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            background: white; 
            margin: 0;
            padding: 0;
          }
          nav, footer, .no-print { display: none !important; }
          
          #voucher-print-area {
            padding: 3mm; 
          }

          .voucher-card {
            /* Aggressively reduced height to squeeze out white space */
            height: 12vh; 
            border: 1px solid #000;
            margin-top: -1px;
            margin-left: -1px;
            
            display: flex;
            flex-direction: column;
            
            /* Stacks items at the top and adds exactly 4px of space between them */
            justify-content: flex-start; 
            gap: 4px; 
            
            padding: 8px; 
            background: #fff;
            page-break-inside: avoid;
            break-inside: avoid;
            box-sizing: border-box;
          }
        }
      `}} />

      <div className="fixed inset-0 z-[9999] flex flex-col bg-white overflow-hidden print:static print:h-auto print:block print:overflow-visible print:z-auto">
        
        <div className="flex justify-between items-center px-6 py-4 bg-gray-100 border-b print:hidden shrink-0">
          <div>
            <h2 className="text-xl font-bold">Print Preview</h2>
            <p className="text-sm text-gray-600">{pinsToPrint.length} Vouchers</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handlePrint} className="bg-blue-600 text-white">
              <Printer size={18} className="mr-2" /> Print Now
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 print:p-0 print:block print:h-auto print:overflow-visible">
          <div 
            id="voucher-print-area" 
            className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 gap-0 print:gap-0 print:w-full"
          >
            {pinsToPrint.map((pin) => (
              <div key={pin.id} className="voucher-card break-inside-avoid">
                
                {/* 1. Header Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="bg-[#FFCC00] p-1 rounded-sm flex items-center justify-center h-6 w-8">
                       <span className="text-[8px] font-black text-black">MTN</span>
                    </div>
                    <span className="text-[12px] font-black text-black">
                      {CURRENCY}{pin.denomination}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-black">FraNKAPPWeb</span>
                </div>

                {/* 2. PIN Section */}
                <div>
                  <div className="flex items-center">
                    <span className="text-[12px] font-black mr-1">PIN:</span>
                    <span className="text-[16px] font-black tracking-tight font-mono">
                      {pin.pinCode}
                    </span>
                  </div>
                </div>

                {/* 3. Serial Section */}
                <div className="text-[10px] text-black leading-tight">
                  Serial: <span className="font-mono">{pin.serialNumber}</span>
                </div>

                {/* 4. Dial Code Section */}
                {/* Removed mt-auto so the space distributes evenly above and below this block */}
                <div className="pb-1">
                  <p className="text-[10px] font-bold text-black border-t border-black pt-1">
                    Dial *311*{pin.pinCode}#
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};