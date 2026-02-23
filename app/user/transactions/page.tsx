"use client"
import React, { useState, useEffect } from 'react';
import { 
  ArrowDownLeft, Printer, Wifi, Smartphone, FileText, Loader2, AlertCircle, 
  Tv, Zap, CreditCard, Receipt, Clock 
} from 'lucide-react';
import { getTransactionHistory } from '@/app/actions/user';
import { CURRENCY } from '@/constants';

// Backend Enum Mapping 
enum TransactionType {
  DATA = 'DATA',
  AIRTIME = 'AIRTIME',
  RECHARGE_PIN = 'RECHARGE_PIN',
  WALLET_FUNDING = 'WALLET_FUNDING',
  CABLE_TV = 'CABLE_TV',
  ELECTRICITY = 'ELECTRICITY'
}

const History: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 1. Added Cable and Electricity to the UI filters
  const filters = ['All', 'Data', 'Airtime', 'Pins', 'Funding', 'Cable', 'Electricity'];

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError('');
    
    // 2. Used a mapping object for cleaner, more scalable translations to backend Enums
    const filterToApiMap: Record<string, string> = {
      'All': 'All', 
      'Data': TransactionType.DATA,
      'Airtime': TransactionType.AIRTIME,
      'Pins': TransactionType.RECHARGE_PIN,
      'Funding': TransactionType.WALLET_FUNDING,
      'Cable': TransactionType.CABLE_TV,
      'Electricity': TransactionType.ELECTRICITY
    };

    const apiType = filterToApiMap[filter] || filter;

    const result = await getTransactionHistory(1, 50, apiType);

    if (result.success) {
      setTransactions(result.data);
    } else {
      setError(result.error || 'Failed to fetch transactions.');
    }
    setIsLoading(false);
  };

  // Helper for dynamic icon styling based on transaction type
  const getTransactionConfig = (type: string) => {
    switch (type) {
      case TransactionType.DATA: 
        return { icon: <Wifi size={20} />, bg: 'bg-blue-50', color: 'text-blue-600' };
      case TransactionType.AIRTIME: 
        return { icon: <Smartphone size={20} />, bg: 'bg-emerald-50', color: 'text-emerald-600' };
      case TransactionType.CABLE_TV: 
        return { icon: <Tv size={20} />, bg: 'bg-purple-50', color: 'text-purple-600' };
      case TransactionType.ELECTRICITY: 
        return { icon: <Zap size={20} />, bg: 'bg-amber-50', color: 'text-amber-600' };
      case TransactionType.WALLET_FUNDING: 
        return { icon: <CreditCard size={20} />, bg: 'bg-indigo-50', color: 'text-indigo-600' };
      case TransactionType.RECHARGE_PIN: 
        return { icon: <Printer size={20} />, bg: 'bg-cyan-50', color: 'text-cyan-600' };
      default: 
        return { icon: <Receipt size={20} />, bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  // Helper for Status Badge
  const getStatusBadge = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'SUCCESS':
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Success</span>;
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Pending</span>;
      case 'FAILED':
        return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      {/* Header Area */}
      <div className="mb-6 pt-2">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Transaction History</h1>
        <p className="text-sm text-gray-500 mt-1">Review your recent activity and purchases.</p>
      </div>

      {/* Filter Chips - Horizontal Scroll */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              filter === f 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
          <p className="text-sm font-semibold text-gray-500">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 border border-red-100 shadow-sm">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx) => {
                const config = getTransactionConfig(tx.type);
                const isFunding = tx.type === TransactionType.WALLET_FUNDING;
                
                return (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Dynamic Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                        {config.icon}
                      </div>
                      
                      {/* Details */}
                      <div>
                        <p className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1">
                          {tx.metadata?.planName || tx.metadata?.network || tx.type.replace('_', ' ')}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500 font-medium">
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {tx.type === TransactionType.RECHARGE_PIN && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Pins</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Amount & Status */}
                    <div className="text-right flex flex-col justify-center shrink-0">
                      <span className={`font-bold block text-sm mb-1 ${isFunding ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {isFunding ? '+' : '-'}{CURRENCY}{Number(tx.amount).toLocaleString()}
                      </span>
                      <div className="flex justify-end">
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-900 font-bold mb-1">No transactions yet</p>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                {filter === 'All' 
                  ? "When you make purchases or fund your wallet, they will appear here." 
                  : `You don't have any recent ${filter.toLowerCase()} transactions.`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;