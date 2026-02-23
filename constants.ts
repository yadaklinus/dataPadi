import { NetworkId, DataPlan, Network, Transaction, TransactionType, TransactionStatus, User, UserTier, KYCStatus, PrintBatch } from '@/types/types';

export const CURRENCY = '₦';
export const PLACEHOLDER_AVATAR = "https://picsum.photos/100/100";

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Yadak',
  email: 'yadak@datapadi.com',
  avatarUrl: PLACEHOLDER_AVATAR,
  walletBalance: 45200,
  todaySpent: 1260,
  tier: UserTier.RESELLER,
  kycStatus: KYCStatus.UNVERIFIED, // Change to VERIFIED to test verified state
  // virtualAccount will be undefined when unverified
};

export const MOCK_VERIFIED_ACCOUNT = {
  bankName: 'Wema Bank',
  accountNumber: '8234567890',
  accountName: 'DataPadi - Yadak'
};

export const NETWORKS: Network[] = [
  { id: NetworkId.MTN, name: 'MTN', color: '#FFCC00', logo: 'M' },
  { id: NetworkId.AIRTEL, name: 'Airtel', color: '#FF0000', logo: 'A' },
  { id: NetworkId.GLO, name: 'Glo', color: '#00FF00', logo: 'G' },
  { id: NetworkId.MOBILE_9, name: '9mobile', color: '#006400', logo: '9' },
];

export const DATA_PLANS: DataPlan[] = [
  { id: '1', networkId: NetworkId.MTN, name: '1GB SME Data', price: 260, validity: '30 Days' },
  { id: '2', networkId: NetworkId.MTN, name: '2GB SME Data', price: 520, validity: '30 Days' },
  { id: '3', networkId: NetworkId.MTN, name: '5GB SME Data', price: 1300, validity: '30 Days' },
  { id: '4', networkId: NetworkId.MTN, name: '10GB SME Data', price: 2500, validity: '30 Days' },
  { id: '5', networkId: NetworkId.AIRTEL, name: '1GB Corporate', price: 250, validity: '30 Days' },
  { id: '6', networkId: NetworkId.AIRTEL, name: '5GB Corporate', price: 1200, validity: '30 Days' },
  { id: '7', networkId: NetworkId.GLO, name: '1GB Gift', price: 240, validity: '14 Days' },
  { id: '8', networkId: NetworkId.MOBILE_9, name: '1GB SME', price: 200, validity: '30 Days' },
];

export const MOCK_HISTORY: Transaction[] = [
  { id: 't1', type: TransactionType.DATA, amount: 260, date: '2023-10-25T10:30:00', status: TransactionStatus.SUCCESS, description: 'MTN 1GB SME to 0803...', reference: 'DP-20231025-001' },
  { id: 't2', type: TransactionType.PRINT, amount: 1000, date: '2023-10-24T14:15:00', status: TransactionStatus.SUCCESS, description: 'Printed 10 MTN N100 Pins', reference: 'DP-20231024-002' },
  { id: 't3', type: TransactionType.FUNDING, amount: 5000, date: '2023-10-23T09:00:00', status: TransactionStatus.SUCCESS, description: 'Wallet Funding via Transfer', reference: 'DP-20231023-003' },
  { id: 't4', type: TransactionType.AIRTIME, amount: 500, date: '2023-10-22T18:45:00', status: TransactionStatus.FAILED, description: 'Airtime to 0902...', reference: 'DP-20231022-004' },
];

export const MOCK_PIN_BATCHES: PrintBatch[] = [
  {
    id: 'b1',
    networkId: NetworkId.MTN,
    amount: 100,
    quantity: 5,
    date: '2023-10-24T14:30:00',
    status: TransactionStatus.SUCCESS,
    pins: [
      { serial: '829384719238', pin: '1234 5678 9012 3456', status: 'UNUSED' },
      { serial: '829384719239', pin: '9876 5432 1098 7654', status: 'UNUSED' },
      { serial: '829384719240', pin: '4567 8901 2345 6789', status: 'UNUSED' },
      { serial: '829384719241', pin: '2345 6789 0123 4567', status: 'UNUSED' },
      { serial: '829384719242', pin: '6789 0123 4567 8901', status: 'UNUSED' },
    ]
  },
  {
    id: 'b2',
    networkId: NetworkId.AIRTEL,
    amount: 200,
    quantity: 3,
    date: '2023-10-23T09:15:00',
    status: TransactionStatus.SUCCESS,
    pins: [
       { serial: '777384719238', pin: '1111 2222 3333 4444', status: 'UNUSED' },
       { serial: '777384719239', pin: '5555 6666 7777 8888', status: 'UNUSED' },
       { serial: '777384719240', pin: '9999 0000 1111 2222', status: 'UNUSED' },
    ]
  }
];