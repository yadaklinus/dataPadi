export enum UserTier {
  SMART_USER = 'SMART_USER',
  RESELLER = 'RESELLER',
  API_PARTNER = 'API_PARTNER'
}

export enum KYCStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  UNVERIFIED = 'UNVERIFIED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  walletBalance: number;
  todaySpent: number;
  tier: UserTier;
  kycStatus: KYCStatus;
  virtualAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export enum NetworkId {
  MTN = 'MTN',
  AIRTEL = 'AIRTEL',
  GLO = 'GLO',
  MOBILE_9 = '9MOBILE'
}

export interface Network {
  id: NetworkId;
  name: string;
  color: string;
  logo: string;
}

export interface DataPlan {
  id: string;
  networkId: NetworkId;
  name: string;
  price: number;
  validity: string;
}

export enum TransactionType {
  DATA = 'DATA',
  AIRTIME = 'AIRTIME',
  RECHARGE_PIN = 'RECHARGE_PIN',
  WALLET_FUNDING = 'WALLET_FUNDING',
  ELECTRICITY = 'ELECTRICITY',
  CABLE_TV = 'CABLE_TV',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: TransactionStatus;
  description: string;
  reference?: string;
  details?: any;
}

export interface Pin {
  serial: string;
  pin: string;
  status: 'USED' | 'UNUSED';
}

export interface PrintBatch {
  id: string;
  networkId: NetworkId;
  amount: number;
  quantity: number;
  date: string;
  status: TransactionStatus;
  pins: Pin[];
}

export interface NavItem {
  icon: any; // Lucide icon component
  label: string;
  route: string;
}