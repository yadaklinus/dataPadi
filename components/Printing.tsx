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
    <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1 -mx-1">
      {networks.map(net => (
        <button key={net} onClick={() => onSelect(net)}
          className={`flex-1 shrink-0 min-w-[80px] sm:min-w-[90px] py-3 sm:py-4 px-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 active:scale-95
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

  const handlePrintSingle = (tx: any) => {
    const pins = (tx.printedPins || []).map((p: any) => ({
      ...p,
      network: tx.metadata.network,
      denomination: tx.metadata.faceValue
    }));
    setPinsToPrint(pins);
  };

  const handlePrintMultiple = () => {
    const selectedTxs = inventory.filter(tx => selectedTxIds.includes(tx.id));
    const allPins = selectedTxs.flatMap(tx =>
      (tx.printedPins || []).map((p: any) => ({
        ...p,
        network: tx.metadata.network,
        denomination: tx.metadata.faceValue
      }))
    );
    setPinsToPrint(allPins);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-48 p-4 sm:p-6 bg-slate-50/50 relative min-h-screen">

      {pinsToPrint && (
        <VoucherPrintModal pinsToPrint={pinsToPrint} onClose={() => setPinsToPrint(null)} />
      )}

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pt-2 sm:pt-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">PIN Printing</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Generate High-Quality Recharge Vouchers</p>
        </div>
        {activeTab === 'history' && inventory.length > 0 && (
          <button
            onClick={() => { setIsMultiSelect(!isMultiSelect); setSelectedTxIds([]); }}
            className={`w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${isMultiSelect ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
          >
            {isMultiSelect ? 'Cancel Selection' : 'Select Multiple'}
          </button>
        )}
      </div>

      {/* Modern Tabs */}
      <div className="bg-white p-1.5 rounded-2xl flex w-full sm:w-auto sm:max-w-sm mb-6 sm:mb-8 border border-slate-200 shadow-sm print:hidden">
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'new' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <PlusCircle size={14} /> Create
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <History size={14} /> Inventory
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-5 rounded-2xl text-sm font-bold mb-8 flex items-start gap-4 border border-red-100 shadow-sm print:hidden">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="uppercase tracking-widest text-[10px] mb-1">Error Occurred</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="print:hidden max-w-4xl">
        {activeTab === 'new' ? (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <section className="bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-6">1. Select Network</label>
                <NetworkSelector selectedNetwork={selectedNetwork} onSelect={setSelectedNetwork} />
              </section>

              <section className="bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-6">2. Denomination</label>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[100, 200, 500].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className={`group relative py-4 sm:py-6 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${amount === val.toString()
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-black shadow-md shadow-blue-600/10'
                        : 'border-slate-50 bg-slate-50/50 text-slate-400 font-bold hover:border-slate-200 hover:bg-white hover:shadow-sm'
                        }`}
                    >
                      {amount === val.toString() && (
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-0.5 shadow-lg shadow-blue-600/30 animate-in zoom-in">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                      <span className="text-lg sm:text-xl">{CURRENCY}{val}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-2 space-y-6 sm:space-y-8 mt-6 lg:mt-0">
              <section className="bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-6">3. Quantity</label>
                <div className="space-y-6">
                  <Input
                    type="number"
                    placeholder="Batch Size (e.g. 10)"
                    value={quantity}
                    onChange={(e: any) => setQuantity(e.target.value)}
                    className="[&>input]:rounded-2xl [&>input]:h-14 [&>input]:text-lg [&>input]:font-bold"
                  />

                  <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-900/20">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Estimated Cost</span>
                    <span className="text-3xl font-black">{amount && quantity ? `${CURRENCY}${(Number(amount) * Number(quantity)).toLocaleString()}` : `${CURRENCY}0`}</span>
                  </div>

                  <Button
                    fullWidth
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    disabled={!selectedNetwork || !amount || !quantity || Number(quantity) > 100}
                    className="h-16 rounded-2xl bg-blue-600 hover:bg-slate-900 border-none text-white text-lg font-black shadow-xl shadow-blue-600/20"
                  >
                    {isGenerating ? 'Generating...' : 'Confirm & Generate'}
                  </Button>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {isLoadingHistory ? (
              <div className="sm:col-span-2 text-center py-24 flex flex-col items-center">
                <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Accessing Vault...</p>
              </div>
            ) : inventory.length > 0 ? (
              inventory.map((tx, index) => {
                const isSuccess = tx.status === 'SUCCESS';
                const isSelected = selectedTxIds.includes(tx.id);
                return (
                  <div key={`${tx.id}-${index}`} className={`bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden transition-all group ${isSelected ? 'ring-2 ring-blue-600/20 border-blue-100 bg-blue-50/10' : ''}`}>
                    <div className="p-5 sm:p-6">
                      <div className="flex justify-between items-start gap-3 mb-5 sm:mb-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-sm ${getNetworkStyle(tx.metadata.network, true)}`}>
                            {tx.metadata.network.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-base sm:text-lg tracking-tight leading-tight">{tx.metadata.network} {CURRENCY}{tx.metadata.faceValue}</p>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5 sm:mt-1">
                              {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 mt-1">
                          {isMultiSelect ? (
                            <button
                              onClick={() => isSuccess && toggleSelection(tx.id)}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                              {isSelected && <CheckCircle2 size={16} />}
                            </button>
                          ) : (
                            <span className={`px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {isSuccess ? 'READY' : tx.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-5 sm:pt-6 border-t border-slate-100">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Qty: <span className="text-slate-900 font-black ml-1 text-sm sm:text-base">{tx.metadata.quantity} PINS</span></p>
                        {!isMultiSelect && (
                          <button
                            onClick={() => handlePrintSingle(tx)}
                            disabled={!isSuccess || !tx.printedPins?.length}
                            className="flex items-center gap-2 text-blue-600 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-blue-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50 active:scale-95"
                          >
                            <Printer size={16} /> <span className="hidden sm:inline">Print</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="sm:col-span-2 text-center py-16 sm:py-24 bg-white rounded-3xl sm:rounded-[3rem] border-2 border-slate-100 border-dashed mx-2 sm:mx-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <History size={28} className="text-slate-300 sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>
                <p className="text-slate-900 font-black text-lg sm:text-xl mb-2 tracking-tight">Vault is Empty</p>
                <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Your generated batches will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Multi-Select Action */}
      {isMultiSelect && selectedTxIds.length > 0 && activeTab === 'history' && (
        <div className="fixed bottom-20 sm:bottom-24 left-0 w-full flex justify-center z-[900] print:hidden px-4">
          <button
            onClick={handlePrintMultiple}
            className="w-full max-w-sm h-14 sm:h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/40 animate-in slide-in-from-bottom-10 active:scale-95 transition-all"
          >
            <Printer size={18} className="sm:w-5 sm:h-5" /> Print {selectedTxIds.length} Batches
          </button>
        </div>
      )}
    </div>
  );
};

export default PrintPins;