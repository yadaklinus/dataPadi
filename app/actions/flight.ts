'use server';

import { authorizedFetch } from '@/lib/api-client';

export interface FlightRequestPayload {
    origin: string;
    destination: string;
    targetDate: string; // ISO String format
    returnDate?: string; // Optional ISO String for round trips
    tripType: 'ONE_WAY' | 'ROUND_TRIP';
    flightClass: string;
    adults: number;
    children: number;
    infants: number;
}

export interface FlightPassenger {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO string format
    gender: 'MALE' | 'FEMALE';
}

export interface FlightSelectionPayload {
    selectedOptionId: string;
    passengers: FlightPassenger[];
}

/**
 * Screen 1: Submit a new flight request
 */
export async function requestFlight(payload: FlightRequestPayload) {
    try {
        const response = await authorizedFetch('/api/v1/flights/user/request', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to submit flight request.' };
        }

        return {
            success: true,
            data: result.data,
            message: result.message,
        };
    } catch (error) {
        console.error('Request Flight Error:', error);
        return { success: false, error: 'Network connection failed' };
    }
}

/**
 * Screen 3: User selects an option and provides passenger details
 */
export async function selectFlightOption(requestId: string, payload: FlightSelectionPayload) {
    try {
        const response = await authorizedFetch(`/api/v1/flights/user/${requestId}/select`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to select flight option.' };
        }

        return {
            success: true,
            data: result.data,
            message: result.message,
        };
    } catch (error) {
        console.error('Select Flight Option Error:', error);
        return { success: false, error: 'Network connection failed' };
    }
}

/**
 * Screen 4: User pays for the flight
 */
export async function payForFlight(requestId: string) {
    try {
        const response = await authorizedFetch(`/api/v1/flights/user/${requestId}/pay`, {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Payment failed.' };
        }

        return {
            success: true,
            data: result.data,
            message: result.message,
        };
    } catch (error) {
        console.error('Pay for Flight Error:', error);
        return { success: false, error: 'Network connection failed' };
    }
}

/**
 * Utility: Fetch all user's flight requests for the dashboard
 */
export async function getUserFlights() {
    try {
        const response = await authorizedFetch('/api/v1/flights/user/requests');
        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to fetch flight requests.' };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Get User Flights Error:', error);
        return { success: false, error: 'Network connection failed' };
    }
}

/**
 * Utility: Fetch a single flight request by ID to display options and details
 */
export async function getFlightRequest(requestId: string) {
    try {
        const response = await authorizedFetch(`/api/v1/flights/user/requests/${requestId}`);
        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to fetch flight request details.' };
        }

        console.log(result.data)

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Get Flight Request Error:', error);
        return { success: false, error: 'Network connection failed' };
    }
}

/**
 * Screen Edge: User Cancels a request
 */
export async function cancelFlightRequest(requestId: string) {
    try {
        const response = await authorizedFetch(`/api/v1/flights/user/${requestId}/cancel`, {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to cancel flight request.' };
        }

        return {
            success: true,
            data: result.data,
            message: result.message,
        };
    } catch (error) {
        console.error('Cancel Flight Error:', error);
        return { success: false, error: 'Network connection failed' };
    }
}

/**
 * Utility: Fetch available airports from the backend API
 */
export async function getAirports() {
    try {
        const response = await authorizedFetch('/api/v1/flights/user/airports');
        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.status || 'Failed to fetch airports.' };
        }

        const airportsList = Array.isArray(result.data) ? result.data : (result.data?.airports || []);

        return {
            success: true,
            data: airportsList,
        };
    } catch (error) {
        console.error('Get Airports Error:', error);
        return { success: false, error: 'Network connection failed' };
    }
}
