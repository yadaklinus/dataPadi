// app/actions/cable.ts
'use server'

import { authorizedFetch } from '@/lib/api-client';

export interface CablePackage {
  PACKAGE_ID: string;
  PACKAGE_NAME: string;
  PACKAGE_AMOUNT: string;
}

export interface CableGroup {
  ID: string;
  PRODUCT: CablePackage[];
}

export interface CablePackagesResponse {
  [providerName: string]: CableGroup[];
}

export interface CablePaymentPayload {
  cableTV: string;
  packageCode: string;
  smartCardNo: string;
  phoneNo: string;
}

/**
 * Fetch available subscription packages for all cable providers.
 */
export async function getCablePackages() {
  try {
    const response = await authorizedFetch('/api/v1/cable/packages');
    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Failed to fetch cable packages' };
    }

    return { 
      success: true, 
      data: result.data as CablePackagesResponse 
    };
  } catch (error) {
    console.error('Cable Packages Fetch Error:', error);
    return { success: false, error: 'Network connection failed' };
  }
}

/**
 * Verify a cable TV smartcard number and retrieve the customer's name.
 */
export async function verifySmartCard(cableTV: string, smartCardNo: string) {
  try {
    const query = new URLSearchParams({
      cableTV, // dstv | gotv | startimes | showmax
      smartCardNo // 8-15 characters
    });

    const response = await authorizedFetch(`/api/v1/cable/verify?${query.toString()}`);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Invalid smartcard number or mismatching provider' };
    }

    return { 
      success: true, 
      // Handle potential API key variations for customer name
      customerName: result.data["customer name"] || result.data["customer_name"] || 'Unknown Customer' 
    };
  } catch (error) {
    console.error('Smartcard Verification Error:', error);
    return { success: false, error: 'Network connection failed' };
  }
}

/**
 * Subscribe a cable TV card to a package.
 */
export async function payCableSubscription(payload: CablePaymentPayload) {
  try {
    const response = await authorizedFetch('/api/v1/cable/pay', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.message || 'Payment failed' };
    }

    return { 
      success: true, 
      message: result.message,
      transactionId: result.transactionId 
    };
  } catch (error) {
    console.error('Cable Payment Error:', error);
    return { success: false, error: 'Transaction failed due to network error' };
  }
}