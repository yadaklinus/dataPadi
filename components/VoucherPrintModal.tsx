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
            // Force reset variables that might use oklch/lab
            el.style.setProperty('--background', '#ffffff', 'important');
            el.style.setProperty('--foreground', '#000000', 'important');
            el.style.setProperty('--primary', '#000000', 'important');
            el.style.setProperty('--card', '#ffffff', 'important');
            el.style.setProperty('--border', '#cccccc', 'important');

            // Also sanitize all children just in case
            const allElements = el.getElementsByTagName('*');
            for (let i = 0; i < allElements.length; i++) {
              const element = allElements[i] as HTMLElement;
              element.style.borderColor = '#cccccc'; // Avoid oklch borders
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

      pdf.save(`DataPadi_Vouchers_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
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
            background: #ffffff !important; 
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav, footer, .no-print { display: none !important; }
          
          #voucher-print-area {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 1mm !important;
            background: #ffffff !important;
          }

          .voucher-card {
            height: 24mm !important; 
            border: 0.5pt solid #cccccc !important;
            margin: 0 !important;
            display: flex;
            flex-direction: column;
            padding: 4px 6px !important; 
            background: #ffffff !important;
            page-break-inside: avoid;
            break-inside: avoid;
            box-sizing: border-box;
            border-radius: 4px !important;
            color: #000000 !important;
          }

          .voucher-card-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #fafafa !important;
            border-radius: 3px;
            margin: 1px 0;
            border: 0.2pt solid #eeeeee;
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

        <div className="flex-1 overflow-y-auto p-2 bg-slate-100 print:bg-white print:p-0 print:block print:h-auto print:overflow-visible no-scrollbar">
          <div
            id="voucher-print-area"
            style={{ background: '#ffffff', color: '#000000' }}
            className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 gap-1 p-2 print:p-0 mx-auto max-w-5xl"
          >
            {pinsToPrint.map((pin, index) => {
              const config = getNetworkConfig(pin.network || 'MTN');
              return (
                <div
                  key={`${pin.id}-${index}`}
                  className="voucher-card break-inside-avoid"
                  style={{ border: '0.5pt solid #cccccc' }}
                >
                  {/* 1. Header Section */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <div
                        style={{ backgroundColor: config.color }}
                        className="p-0.5 rounded flex items-center justify-center h-4 w-7"
                      >
                        <span style={{ fontSize: '5px', fontWeight: '900', color: config.textColor === 'text-white' ? '#ffffff' : '#000000' }}>{config.text}</span>
                      </div>
                      <span style={{ fontSize: '8px', fontWeight: '900', color: '#000000', letterSpacing: '-0.02em' }}>
                        {CURRENCY}{pin.denomination}
                      </span>
                    </div>
                    <span style={{ fontSize: '5px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>DataPadi</span>
                  </div>

                  {/* 2. PIN Section */}
                  <div className="voucher-card-body" style={{ background: '#fafafa', border: '0.2pt solid #eeeeee' }}>
                    <div className="flex flex-col items-center">
                      <span style={{ fontSize: '4px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', lineHeight: '1.2' }}>Voucher PIN</span>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: '900', color: '#000000', lineHeight: '1.2' }}>
                        {pin.pinCode.replace(/(.{4})/g, '$1 ')}
                      </span>
                    </div>
                  </div>

                  {/* 3. Info Section */}
                  <div
                    className="flex justify-between items-center uppercase tracking-tighter"
                    style={{ fontSize: '4.5px', fontWeight: '700', color: '#64748b', marginBottom: '1px' }}
                  >
                    <span>S/N: {pin.serialNumber}</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>

                  {/* 4. Dial Code Section */}
                  <div className="mt-auto" style={{ borderTop: '0.2pt solid #eeeeee', paddingTop: '1px' }}>
                    <p style={{ fontSize: '5px', fontWeight: '900', color: '#000000', textAlign: 'center', textTransform: 'uppercase' }}>
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