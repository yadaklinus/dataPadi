import React from 'react';
import { createPortal } from 'react-dom';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import { PrintBatch, NetworkId } from '@/types/types';
import { CURRENCY } from '@/constants';
import { Printer, AlertCircle, LayoutGrid } from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: PrintBatch[];
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ isOpen, onClose, batches }) => {
  if (!batches || batches.length === 0) return null;

  const allPins = batches.flatMap(batch => 
    batch.pins.map(pin => ({
      ...pin,
      networkId: batch.networkId,
      amount: batch.amount,
      batchId: batch.id
    }))
  );

  const handlePrint = () => {
    window.print();
  };

  const getUSSD = (networkId: string) => {
    switch(networkId) {
      case 'MTN': return '*555*PIN#';
      case 'AIRTEL': return '*126*PIN#';
      case 'GLO': return '*123*PIN#';
      case '9MOBILE': return '*222*PIN#';
      default: return '*XXX*PIN#';
    }
  };

  const formatPin = (pin: string) => {
    return pin.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const totalValue = allPins.reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          /* Hide everything in the app root */
          #root {
            display: none !important;
          }
          /* Show the printable area which is portaled to body */
          #printable-area {
            display: block !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 9999;
          }
          .print-header-main {
             text-align: center;
             margin-bottom: 20px;
             border-bottom: 2px solid #333;
             padding-bottom: 10px;
          }
          .print-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr); 
            gap: 15px;
          }
          .print-card {
            border: 1px dashed #666;
            padding: 12px;
            font-family: 'Inter', sans-serif;
            page-break-inside: avoid;
            background: white;
            display: flex;
            flex-direction: column;
            min-height: 120px;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          .card-brand {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #000;
          }
          .card-network-badge {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
          }
          .card-amount {
            font-size: 14px;
            font-weight: 900;
            border: 1.5px solid #000;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .card-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px 0;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
          }
          .pin-label {
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 2px;
          }
          .pin-value {
            font-family: 'Courier New', Courier, monospace;
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #000;
          }
          .card-footer {
            margin-top: 8px;
            font-size: 8px;
            color: #333;
          }
          .footer-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          .ussd-box {
            background: #f0f0f0;
            padding: 2px 4px;
            border-radius: 2px;
            font-weight: bold;
          }
        }
        @media screen {
          #printable-area {
            display: none;
          }
        }
      `}</style>

      <BottomSheet isOpen={isOpen} onClose={onClose} title="Inventory Print Preview">
        <div className="flex flex-col h-full">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6 flex gap-3">
             <div className="bg-primary text-white p-2 rounded-xl h-fit">
                <LayoutGrid size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-gray-900">Batch Printing Ready</p>
               <p className="text-xs text-blue-700 font-medium">
                 {batches.length} Batches • {allPins.length} Total Vouchers
               </p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pins</p>
               <p className="text-xl font-black text-gray-900">{allPins.length}</p>
             </div>
             <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
               <p className="text-xl font-black text-primary">{CURRENCY}{totalValue.toLocaleString()}</p>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar mb-6 bg-gray-100 p-4 rounded-3xl border border-gray-200">
             <p className="text-[10px] text-center text-gray-400 mb-4 font-black uppercase tracking-[0.2em]">Live A4 Layout Preview</p>
             <div className="grid grid-cols-2 gap-3 opacity-90">
                {allPins.slice(0, 6).map((pin, i) => (
                  <div key={i} className="bg-white p-3 text-center border border-gray-300 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center text-[8px] font-black mb-2 pb-1 border-b border-gray-50">
                      <span className="text-primary">DATAPADI</span>
                      <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded-sm">{pin.networkId}</span>
                    </div>
                    <div className="text-[7px] text-gray-400 font-bold uppercase mb-0.5">Voucher PIN</div>
                    <div className="font-mono text-xs font-black text-gray-900 mb-2 tracking-tight">
                        {formatPin(pin.pin).substring(0, 14)}...
                    </div>
                    <div className="text-[7px] text-gray-500 font-bold flex justify-between border-t border-gray-50 pt-1">
                      <span>{CURRENCY}{pin.amount}</span>
                      <span>{getUSSD(pin.networkId).substring(0, 5)}#</span>
                    </div>
                  </div>
                ))}
             </div>
             {allPins.length > 6 && (
               <div className="text-center mt-4">
                 <span className="bg-white/50 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-300">
                   + {allPins.length - 6} more vouchers in this run
                 </span>
               </div>
             )}
          </div>

          <div className="mt-auto">
             <Button fullWidth onClick={handlePrint} className="gap-2 h-14 text-lg shadow-xl shadow-primary/20">
                <Printer size={20} /> Print {allPins.length} Vouchers
             </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Portal Printable Area to body */}
      {createPortal(
        <div id="printable-area">
          <div className="print-header-main">
             <h1 style={{fontSize: '22px', fontWeight: '900', margin: 0, textTransform: 'uppercase', letterSpacing: '2px'}}>DATAPADI</h1>
             <p style={{fontSize: '11px', margin: '4px 0', fontWeight: 'bold', color: '#666'}}>Automated Recharge Voucher System</p>
             <p style={{fontSize: '9px', margin: 0}}>Multi-Batch Run • Total Vouchers: {allPins.length} • Printed: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="print-grid">
             {allPins.map((pin, idx) => (
               <div key={`${pin.batchId}-${idx}`} className="print-card">
                 <div className="card-header">
                   <span className="card-brand">DATAPADI</span>
                   <span className="card-amount">{CURRENCY}{pin.amount}</span>
                 </div>
                 
                 <div className="card-body">
                   <span className="card-network-badge">{pin.networkId}</span>
                   <span className="pin-label">Recharge PIN</span>
                   <span className="pin-value">{formatPin(pin.pin)}</span>
                 </div>

                 <div className="card-footer">
                   <div className="footer-row">
                      <span>SN: <strong>{pin.serial}</strong></span>
                      <span>Load: <strong className="ussd-box">{getUSSD(pin.networkId)}</strong></span>
                   </div>
                   <div className="footer-row" style={{opacity: 0.6}}>
                      <span>Valid for 12 months</span>
                      <span>Powered by DataPadi</span>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PrintPreviewModal;