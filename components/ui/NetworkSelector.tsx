import React from 'react';
import { Network, NetworkId } from '@/types/types';
import { NETWORKS } from '@/constants';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface NetworkSelectorProps {
  selectedNetwork: NetworkId | null;
  onSelect: (networkId: NetworkId) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ selectedNetwork, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {NETWORKS.map((network) => {
        const isSelected = selectedNetwork === network.id;
        return (
          <motion.button
            key={network.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(network.id)}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all
              ${isSelected
                ? 'border-primary bg-blue-50 ring-1 ring-primary ring-offset-1'
                : 'border-gray-100 bg-white hover:bg-gray-50'
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                <Check size={10} />
              </div>
            )}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 shadow-sm"
              style={{ backgroundColor: network.color }}
            >
              {network.logo}
            </div>
            <span className="text-xs font-medium text-gray-700">{network.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default NetworkSelector;