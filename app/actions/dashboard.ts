'use server'

import { authorizedFetch } from '@/lib/api-client';

export interface DashboardData {
  user: {
    fullName: string;
    tier: string;
    walletBalance: number;
    lifetimeSpent: number;
  };
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
    metadata?: any;
  }>;
  todaySpent: number;
}

export async function getDashboardData() {
  try {
    const response = await authorizedFetch('/api/v1/user/dashboard');
    
    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Failed to fetch dashboard' };
    }

    return { success: true, data: result.data as DashboardData };
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    return { success: false, error: 'Network connection failed' };
  }
}