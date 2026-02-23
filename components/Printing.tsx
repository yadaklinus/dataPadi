// --- PrintPins.tsx ---
"use client"
import React, { useState, useEffect } from 'react';
import { Printer, Download, History, CheckCircle2, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import { printRechargePins, getPrintInventory } from '@/app/actions/vtu';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { VoucherPrintModal } from './VoucherPrintModal'; // Adjust import if you moved the code above to a new file

type NetworkId = 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE';
const CURRENCY = '₦';

const getNetworkStyle = (network: string, isSelected: boolean = false) => {
  if (!isSelected && network === 'UNSELECTED') return 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50';
  switch (network.toUpperCase()) {
    case 'MTN': return 'border-yellow-400 bg-yellow-50 text-yellow-700 shadow-sm';
    case 'AIRTEL': return 'border-red-500 bg-red-50 text-red-700 shadow-sm';
    case 'GLO': return 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm';
    case '9MOBILE': return 'border-green-800 bg-green-50 text-green-800 shadow-sm';
    default: return 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm';
  }
};

const NetworkSelector: React.FC<any> = ({ selectedNetwork, onSelect }) => {
  const networks: NetworkId[] = ['MTN', 'AIRTEL', 'GLO', '9MOBILE'];
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
      {networks.map(net => (
        <button key={net} onClick={() => onSelect(net)} 
          className={`flex-1 min-w-[80px] py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1
            ${selectedNetwork === net ? getNetworkStyle(net, true) : getNetworkStyle('UNSELECTED')}`}
        >
          {net}
        </button>
      ))}
    </div>
  );
};

const PrintPins: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId | null>(null);
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);
  
  // Triggers the separated print modal
  const [pinsToPrint, setPinsToPrint] = useState<any[] | null>(null);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchInventory();
    } else {
      setIsMultiSelect(false);
      setSelectedTxIds([]);
    }
  }, [activeTab]);

  const fetchInventory = async () => {
    setIsLoadingHistory(true);
    setError('');
    try {
      const result = await getPrintInventory();
      if (result && result.success && Array.isArray(result.data)) setInventory(result.data);
      else if (Array.isArray(result)) setInventory(result);
      else setError(result?.error || 'Failed to fetch inventory.');
    } catch (err: any) {
      setError(err.message || 'Error fetching inventory.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedNetwork || !amount || !quantity) return;
    setIsGenerating(true);
    setError('');
    try {
      const result = await printRechargePins(selectedNetwork.toUpperCase(), amount, Number(quantity));
      if (result.success) {
        setActiveTab('history'); 
        setAmount(''); setQuantity(''); setSelectedNetwork(null);
      } else setError(result.error || 'Failed to generate pins');
    } catch (err: any) {
      setError(err.message || 'Error during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedTxIds(prev => prev.includes(id) ? prev.filter(txId => txId !== id) : [...prev, id]);
  };

  const handlePrintSingle = (tx: any) => setPinsToPrint(tx.printedPins || []);
  
  const handlePrintMultiple = () => {
    const selectedTxs = inventory.filter(tx => selectedTxIds.includes(tx.id));
    setPinsToPrint(selectedTxs.flatMap(tx => tx.printedPins || []));
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-48 p-4 sm:p-6 bg-gray-50 relative min-h-screen">
      
      {/* Separated Print Mechanism */}
      {pinsToPrint && (
        <VoucherPrintModal pinsToPrint={pinsToPrint} onClose={() => setPinsToPrint(null)} />
      )}

      {/* Header Area */}
      <div className="flex justify-between items-end mb-6 pt-2 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Recharge Printing</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and manage physical recharge pins.</p>
        </div>
        {activeTab === 'history' && inventory.length > 0 && (
          <button onClick={() => { setIsMultiSelect(!isMultiSelect); setSelectedTxIds([]); }}
            className="text-sm font-bold text-primary hover:text-blue-700 transition-colors"
          >
            {isMultiSelect ? 'Cancel Selection' : 'Select Multiple'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-gray-200/60 p-1 rounded-xl flex mb-6 print:hidden">
        <button onClick={() => setActiveTab('new')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'new' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <PlusCircle size={16} /> New Print
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <History size={16} /> Pin Inventory
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 flex items-center gap-3 border border-red-100 shadow-sm print:hidden">
          <AlertCircle size={18} className="shrink-0" /> {error}
        </div>
      )}

      {/* Content */}
      <div className="print:hidden">
        {activeTab === 'new' ? (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <section>
                <label className="block text-sm font-bold text-gray-900 mb-3">Select Network</label>
                <NetworkSelector selectedNetwork={selectedNetwork} onSelect={setSelectedNetwork} />
              </section>
              <section>
                <label className="block text-sm font-bold text-gray-900 mb-3">Select Denomination</label>
                <div className="grid grid-cols-3 gap-3">
                  {[100, 200, 500].map((val) => (
                    <div key={val} onClick={() => setAmount(val.toString())} className={`relative py-4 rounded-xl border-2 cursor-pointer text-center transition-all ${amount === val.toString() ? 'border-primary bg-blue-50 text-primary font-extrabold shadow-sm' : 'border-gray-100 bg-white text-gray-600 font-bold hover:border-gray-200 hover:bg-gray-50'}`}>
                      {amount === val.toString() && <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full"><CheckCircle2 size={18} /></div>}
                      {CURRENCY}{val}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <section>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-bold text-gray-900">Quantity</label>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Max 100</span>
                </div>
                <Input type="number" placeholder="E.g. 10" value={quantity} onChange={(e: any) => setQuantity(e.target.value)} className="mt-2" />
              </section>
              <div className="bg-gray-900 p-5 rounded-xl text-white shadow-md flex justify-between items-center">
                <div>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-0.5">Total Billing</span>
                  <span className="text-2xl font-black">{amount && quantity ? `${CURRENCY}${(Number(amount) * Number(quantity)).toLocaleString()}` : `${CURRENCY}0`}</span>
                </div>
              </div>
              <Button fullWidth onClick={handleGenerate} isLoading={isGenerating} disabled={!selectedNetwork || !amount || !quantity || Number(quantity) > 100}>
                {isGenerating ? <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Generating...</span> : 'Generate Pins'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isLoadingHistory ? (
              <div className="text-center py-20 flex flex-col items-center">
                <Loader2 size={32} className="animate-spin text-primary mb-3" />
                <p className="text-sm font-semibold text-gray-500">Loading transactions...</p>
              </div>
            ) : inventory.length > 0 ? (
              inventory.map((tx) => {
                const isSuccess = tx.status === 'SUCCESS';
                const isSelected = selectedTxIds.includes(tx.id);
                return (
                  <div key={tx.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-stretch">
                    {isMultiSelect && (
                      <div onClick={() => isSuccess && toggleSelection(tx.id)} className={`flex items-center justify-center px-4 rounded-l-2xl border-r border-gray-50 transition-colors ${!isSuccess ? 'cursor-not-allowed opacity-40 bg-gray-50' : 'cursor-pointer hover:bg-blue-50/50'} ${isSelected ? 'bg-blue-50' : ''}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                          {isSelected && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                    )}
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${getNetworkStyle(tx.metadata.network, true)}`}>{tx.metadata.network.charAt(0)}</div>
                          <div>
                            <p className="font-bold text-gray-900 text-base">{tx.metadata.network} {CURRENCY}{tx.metadata.faceValue} Pins</p>
                            <p className="text-[11px] text-gray-400 font-medium mt-1">{new Date(tx.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border ${isSuccess ? 'bg-green-50 text-emerald-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{isSuccess ? 'READY' : tx.status}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <p className="text-sm font-medium text-gray-500">Quantity: <span className="text-gray-900 font-bold ml-1">{tx.metadata.quantity}</span></p>
                        {!isMultiSelect && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handlePrintSingle(tx)} disabled={!isSuccess || !tx.printedPins?.length} className="flex items-center gap-1.5 text-primary text-xs sm:text-sm font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                              <Printer size={16} /> View / Print
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                <History size={40} className="mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
                <p className="text-gray-900 font-bold mb-1">No transaction history</p>
                <p className="text-sm text-gray-500">Your generated batches will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Multi-Select Print Button */}
      {isMultiSelect && selectedTxIds.length > 0 && activeTab === 'history' && (
        <div className="fixed bottom-24 left-0 w-full flex justify-center z-[900] print:hidden pointer-events-none">
          <div className="pointer-events-auto w-full max-w-sm px-4 animate-in slide-in-from-bottom-5">
            <Button fullWidth onClick={handlePrintMultiple} className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gray-900 hover:bg-black text-white">
              <Printer size={18} className="mr-2" /> Print Selected Batches
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintPins;