import { NetworkId, DataPlan, Network, Transaction, TransactionType, TransactionStatus, User, UserTier, KYCStatus, PrintBatch } from '@/types/types';

export const CURRENCY = '₦';
export const PLACEHOLDER_AVATAR = "https://picsum.photos/100/100";




export const NETWORKS: Network[] = [
  { id: NetworkId.MTN, name: 'MTN', color: '#FFCC00', logo: 'M' },
  { id: NetworkId.AIRTEL, name: 'Airtel', color: '#FF0000', logo: 'A' },
  { id: NetworkId.GLO, name: 'Glo', color: '#00FF00', logo: 'G' },
  { id: NetworkId.MOBILE_9, name: '9mobile', color: '#006400', logo: '9' },
];
