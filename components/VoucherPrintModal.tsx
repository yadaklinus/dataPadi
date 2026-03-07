import React from 'react';
import { X, Printer, FileDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CURRENCY = '₦';

export const VoucherPrintModal = ({ pinsToPrint, onClose }: { pinsToPrint: any[], onClose: () => void }) => {
  if (!pinsToPrint || pinsToPrint.length === 0) return null;

  const [isExporting, setIsExporting] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const printableArea = document.getElementById('voucher-print-area');
    if (!printableArea) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(printableArea, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('voucher-print-area');
          if (el) {
            el.style.setProperty('--background', '#ffffff', 'important');
            el.style.setProperty('--foreground', '#000000', 'important');
            el.style.setProperty('--primary', '#000000', 'important');
            el.style.setProperty('--card', '#ffffff', 'important');
            el.style.setProperty('--border', '#cccccc', 'important');

            const allElements = el.getElementsByTagName('*');
            for (let i = 0; i < allElements.length; i++) {
              const element = allElements[i] as HTMLElement;
              element.style.borderColor = '#cccccc';
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`MuftiPay_Vouchers_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getUSSD = (networkId: string) => {
    switch (networkId?.toUpperCase()) {
      case 'MTN': return '*555*PIN#';
      case 'AIRTEL': return '*126*PIN#';
      case 'GLO': return '*123*PIN#';
      case '9MOBILE': return '*222*PIN#';
      default: return '*XXX*PIN#';
    }
  };

  const formatPin = (pin: string) => {
    if (!pin) return 'No Pins available';
    return pin.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 10mm; 
          }
          body { 
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: #ffffff;
            color: #000000;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          nav, footer, .no-print, .print-hidden { display: none !important; }

          #voucher-print-area {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 3mm !important;
            width: 100% !important;
          }

          .card {
            border: 0.5pt solid #ccc !important;
            padding: 6px !important;
            border-radius: 4px !important;
            display: flex !important;
            flex-direction: column !important;
            height: 24mm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            box-sizing: border-box !important;
            color: #000 !important;
            background: #fff !important;
          }

          .card-header {
            display: flex !important;
            justify-content: space-between !important;
            font-size: 8px !important;
            font-weight: 800 !important;
          }

          .amount {
            border: 1px solid #000 !important;
            padding: 1px 4px !important;
            font-weight: 900 !important;
          }

          .card-body {
            flex: 1 !important;
            text-align: center !important;
            background: #fafafa !important;
            border-radius: 4px !important;
            margin: 3px 0 !important;
            padding: 3px 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .network {
            font-size: 8px !important;
            font-weight: 900 !important;
            background: #000 !important;
            color: #fff !important;
            padding: 2px 4px !important;
            border-radius: 2px !important;
            display: inline-block !important;
            margin-bottom: 2px !important;
          }

          .pin-label {
            font-size: 7px !important;
            font-weight: bold !important;
            color: #666 !important;
          }

          .pin-value {
            font-family: monospace !important;
            font-size: 14px !important;
            font-weight: 900 !important;
            letter-spacing: 0.5px !important;
            color: #000 !important;
          }

          .voucher-footer {
            font-size: 6.5px !important;
            display: flex !important;
            justify-content: space-between !important;
            font-weight: bold !important;
          }
        }

        /* Non-print styles for preview */
        .card {
          border: 0.5pt solid #ccc;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          height: 24mm;
          background: white;
          color: #000;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          font-weight: 800;
        }

        .amount {
          border: 1px solid #000;
          padding: 1px 4px;
          font-weight: 900;
        }

        .card-body {
          flex: 1;
          text-align: center;
          background: #fafafa;
          border-radius: 4px;
          margin: 3px 0;
          padding: 3px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .network {
          font-size: 8px;
          font-weight: 900;
          background: #000;
          color: #fff;
          padding: 2px 4px;
          border-radius: 2px;
          display: inline-block;
          margin-bottom: 2px;
        }

        .pin-label {
          font-size: 7px;
          font-weight: bold;
          color: #666;
        }

        .pin-value {
          font-family: monospace;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.5px;
          color: #000;
        }

        .voucher-footer {
          font-size: 6.5px;
          display: flex;
          justify-content: space-between;
          color: #000;
        }
      `}} />

      <div className="fixed inset-0 z-[9999] flex flex-col bg-white overflow-hidden print:static print:h-auto print:block print:overflow-visible print:z-auto">

        <div className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white border-b print-hidden shrink-0">
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
            <Button
              onClick={handleDownloadPDF}
              isLoading={isExporting}
              className="bg-white text-slate-900 px-6 h-12 rounded-xl font-bold hover:bg-slate-100 shadow-lg"
            >
              <FileDown size={18} className="mr-2" /> Save PDF
            </Button>
            <Button
              onClick={handlePrint}
              disabled={isExporting}
              className="bg-blue-600 text-white px-6 h-12 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20"
            >
              <Printer size={18} className="mr-2" /> Print
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-100 print:bg-white print:p-0 print:block print:h-auto print:overflow-visible no-scrollbar">
          <div
            id="voucher-print-area"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 print:grid-cols-4 gap-[3mm] p-2 print:p-0 mx-auto w-fit"
          >
            {pinsToPrint.map((pin, index) => {
              const nw = pin.network || 'N/A';
              const amt = pin.denomination || 0;
              return (
                <div key={`${pin.id}-${index}`} className="card">
                  <div className="card-header">
                    <span>MUFTI PAY</span>
                    <span className="amount">{CURRENCY}{amt}</span>
                  </div>

                  <div className="card-body">
                    <div className="network">{nw.toUpperCase()}</div>
                    <div className="pin-label">Recharge PIN</div>
                    <div className="pin-value">{pin.pinCode ? formatPin(pin.pinCode) : 'No Pins available'}</div>
                  </div>

                  <div className="voucher-footer">
                    <span>SN: {pin.serialNumber || 'N/A'}</span>
                    <span>Load: {getUSSD(nw)}</span>
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