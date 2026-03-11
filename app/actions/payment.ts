// app/actions/payment.ts
'use server'

import { authorizedFetch } from '@/lib/api-client';
import { FundingResponse } from '@/types/types';

/**
 * Initialize a one-time dynamic bank account for wallet funding.
 * Minimum amount: ₦100.
 */
export async function initializeGatewayFunding(amount: number): Promise<{ success: boolean; data?: FundingResponse; error?: string }> {
  try {
    const response = await authorizedFetch('/api/v1/payment/fund/init', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });

    const result = await response.json();

    if (response.ok && result.status === 'OK') {
      return {
        success: true,
        data: result
      };
    }

    console.log(result)

    return {
      success: false,
      error: result.message || 'Failed to initialize payment'
    };
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to connect to payment gateway' };
  }
}

/**
 * Submit BVN for KYC and create a dedicated virtual bank account[cite: 252, 254].
 */
export async function verifyBVN(bvn: string, firstName: string, lastName: string) {
  try {
    const response = await authorizedFetch('/api/v1/payment/kyc/create', {
      method: 'POST',
      body: JSON.stringify({ bvn }), // [cite: 256]
    });

    const result = await response.json();
    return {
      success: response.ok,
      data: result.data,
      error: result.message || 'Verification failed'
    };
  } catch (error) {
    return { success: false, error: 'Network connection failed' };
  }
}