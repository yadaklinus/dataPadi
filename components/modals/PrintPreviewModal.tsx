import React from 'react';
import { createPortal } from 'react-dom';
import BottomSheet from './BottomSheet';
import Button from '../ui/Button';
import { PrintBatch, NetworkId } from '@/types/types';
import { CURRENCY } from '@/constants';
import { Printer, AlertCircle, LayoutGrid, Download, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

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

  const [isExporting, setIsExporting] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const printableArea = document.getElementById('printable-area');
    if (!printableArea) return;

    try {
      setIsExporting(true);

      // toPng leverages the browser's native rendering engine via SVG <foreignObject>.
      // The `style` object applies only to the cloned node in memory, bypassing the 
      // need to manipulate the live DOM just to make the hidden element visible.
      const imgData = await toPng(printableArea, {
        pixelRatio: 2, // Higher scale for better quality
        backgroundColor: '#ffffff',
        style: {
          display: 'block',
          position: 'relative',
          left: '0',
          top: '0',
        }
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`DataPadi_Vouchers_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
    } finally {
      setIsExporting(false);
    }
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

  const totalValue = allPins.reduce((sum, item) => sum + item.amount, 0);

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

          <div className="mt-auto flex flex-col gap-3">
            <Button
              fullWidth
              onClick={handleDownloadPDF}
              isLoading={isExporting}
              className="gap-2 h-14 text-lg shadow-xl shadow-primary/20 bg-primary text-white"
            >
              <FileDown size={20} /> Save as PDF
            </Button>

            <Button
              fullWidth
              variant="outline"
              onClick={handlePrint}
              disabled={isExporting}
              className="gap-2 h-12 text-gray-600 border-gray-200"
            >
              <Printer size={18} /> Direct Print
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Portal Printable Area to body */}
      {createPortal(
        <div id="printable-area">
          <div className="header">
            <h1>DATAPADI</h1>
            <p>Automated Recharge Voucher System</p>
            <p>Multi-Batch Run • Total Vouchers: {allPins.length} • Printed: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid">
            {allPins.map((pin, idx) => (
              <div key={`${pin.batchId}-${idx}`} className="card">
                <div className="card-header">
                  <span>DATAPADI</span>
                  <span className="amount">{CURRENCY}{pin.amount}</span>
                </div>

                <div className="card-body">
                  <div className="network">{pin.networkId}</div>
                  <div className="pin-label">Recharge PIN</div>
                  <div className="pin-value">{pin.pin ? formatPin(pin.pin) : 'N/A'}</div>
                </div>

                <div className="footer">
                  <span>SN: {pin.serial}</span>
                  <span>Load: {getUSSD(pin.networkId)}</span>
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