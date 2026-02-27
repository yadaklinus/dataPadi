import React from 'react';
import { createPortal } from 'react-dom';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import { PrintBatch } from '@/types/types';
import { CURRENCY } from '@/constants';
import { Printer, Copy, Check, Info } from 'lucide-react';

interface PinBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: PrintBatch | null;
}

const PinBatchModal: React.FC<PinBatchModalProps> = ({ isOpen, onClose, batch }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!batch) return null;

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getUSSD = (networkId: string) => {
    switch (networkId) {
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

  return (
    <>
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: A4;
            margin: 0;
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
            background: #ffffff !important;
            z-index: 9999;
          }
        }
        @media screen {
          #printable-area {
            position: absolute;
            left: -9999px;
            top: -9999px;
            width: 210mm; /* A4 width */
            background: white;
            color: black;
          }
        }

        #printable-area {
          font-family: Arial, sans-serif;
          padding: 20px;
          box-sizing: border-box;
        }
        #printable-area .header {
          text-align: center;
          margin-bottom: 10px;
          border-bottom: 1px solid #333;
          padding-bottom: 5px;
        }
        #printable-area .header h1 {
          font-size: 22px;
          font-weight: 900;
          margin: 0;
          letter-spacing: 2px;
        }
        #printable-area .header p {
          margin: 4px 0;
          font-size: 10px;
          color: #555;
        }
        #printable-area .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3mm;
        }
        #printable-area .card {
          border: 0.5pt solid #ccc;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          height: 24mm;
          page-break-inside: avoid;
          background: #ffffff;
          box-sizing: border-box;
        }
        #printable-area .card-header {
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          font-weight: 800;
        }
        #printable-area .amount {
          border: 1px solid #000;
          padding: 1px 4px;
          font-weight: 900;
          border-radius: 2px;
        }
        #printable-area .card-body {
          flex: 1;
          text-align: center;
          background: #fafafa;
          border-radius: 4px;
          margin: 3px 0;
          padding: 3px 0;
        }
        #printable-area .network {
          font-size: 8px;
          font-weight: 900;
          background: #000;
          color: #fff;
          padding: 2px 4px;
          border-radius: 2px;
          display: inline-block;
          margin-bottom: 2px;
        }
        #printable-area .pin-label {
          font-size: 7px;
          font-weight: bold;
          color: #666;
        }
        #printable-area .pin-value {
          font-family: monospace;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }
        #printable-area .footer {
          font-size: 6.5px;
          display: flex;
          justify-content: space-between;
        }
      `}</style>

      <BottomSheet isOpen={isOpen} onClose={onClose} title="Card Preview & Print">
        <div className="flex flex-col h-full">
          {/* Summary Info */}
          <div className="bg-primaryDark/5 p-4 rounded-2xl mb-6 border border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${batch.networkId === 'MTN' ? 'bg-yellow-400 text-yellow-900' : 'bg-red-500 text-white'}`}>
                {batch.networkId[0]}
              </div>
              <div>
                <p className="font-extrabold text-textMain text-lg">{batch.networkId} {CURRENCY}{batch.amount}</p>
                <p className="text-xs text-textMuted">{batch.quantity} Cards generated</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Value</p>
              <p className="text-xl font-black text-primary">{CURRENCY}{(batch.amount * batch.quantity).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold text-gray-700">Voucher Previews</h3>
              <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                <Info size={12} /> Click PIN to Copy
              </span>
            </div>

            <div className="space-y-4">
              {batch.pins.map((pin, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
                  onClick={() => copyToClipboard(pin.pin, idx)}
                >
                  {/* Decorative Card Header */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-primary tracking-tighter uppercase">DataPadi Voucher</span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-600">SN: {pin.serial}</span>
                  </div>

                  <div className="flex flex-col items-center py-2 border-y border-dashed border-gray-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">Recharge PIN</span>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-black text-gray-900 tracking-widest text-xl">
                        {formatPin(pin.pin)}
                      </p>
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 group-hover:text-primary group-hover:bg-blue-50 transition-colors">
                        {copiedIndex === idx ? <Check size={18} className="text-green-500" /> : <Copy size={16} />}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-[10px]">
                    <span className="text-gray-500 font-medium">To Load: <span className="text-gray-900 font-bold">{getUSSD(batch.networkId)}</span></span>
                    <span className="font-bold text-primary">{batch.networkId} • {CURRENCY}{batch.amount}</span>
                  </div>

                  {/* Copy feedback overlay */}
                  {copiedIndex === idx && (
                    <div className="absolute inset-0 bg-primary/5 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Copied!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <Button fullWidth onClick={handlePrint} className="gap-2 h-14 text-lg">
              <Printer size={20} /> Print All Vouchers
            </Button>
            <p className="text-center text-[10px] text-gray-400 font-medium">
              A4 Layout: 3 Columns • Landscape or Portrait • Set Margin to "None" for best results
            </p>
          </div>
        </div>
      </BottomSheet>

      {/* Portal Printable Area to body to avoid layout constraints */}
      {createPortal(
        <div id="printable-area">
          <div className="header">
            <h1>DATAPADI</h1>
            <p>Automated Recharge Voucher System</p>
            <p>Batch ID: {batch.id} • Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid">
            {batch.pins.map((pin, idx) => (
              <div key={`${batch.id}-${idx}`} className="card">
                <div className="card-header">
                  <span>DATAPADI</span>
                  <span className="amount">{CURRENCY}{batch.amount}</span>
                </div>

                <div className="card-body">
                  <div className="network">{batch.networkId}</div>
                  <div className="pin-label">Recharge PIN</div>
                  <div className="pin-value">{pin.pin ? formatPin(pin.pin) : 'N/A'}</div>
                </div>

                <div className="footer">
                  <span>SN: {pin.serial}</span>
                  <span>Load: {getUSSD(batch.networkId)}</span>
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

export default PinBatchModal;