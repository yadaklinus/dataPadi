export interface FlightOffer {
    id: string;
    source?: string;
    instantTicketingRequired?: boolean;
    nonHomogeneous?: boolean;
    oneWay?: boolean;
    lastTicketingDate?: string;
    numberOfBookableSeats?: number;
    itineraries: {
        duration: string;
        segments: {
            departure: {
                iataCode: string;
                terminal?: string;
                at: string;
            };
            arrival: {
                iataCode: string;
                terminal?: string;
                at: string;
            };
            carrierCode: string;
            number: string;
            aircraft?: {
                code: string;
            };
            operating?: {
                carrierCode: string;
            };
            duration: string;
            id: string;
            numberOfStops: number;
            blacklistedInEU: boolean;
        }[];
    }[];
    price: {
        currency: string;
        total: string;
        base: string;
        fees?: {
            amount: string;
            type: string;
        }[];
        grandTotal: string;
    };
    pricingOptions?: {
        fareType: string[];
        includedCheckedBagsOnly: boolean;
    };
    validatingAirlineCodes?: string[];
    travelerPricings?: any[];
}

export interface FlightSearchParams {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    adults: number;
    children?: number;
    infants?: number;
    travelClass?: string;
    nonStop?: boolean;
    currencyCode?: string;
}

export interface FlightSearchResponse {
    data: FlightOffer[];
    dictionaries?: {
        carriers?: Record<string, string>;
        locations?: Record<string, any>;
        aircraft?: Record<string, string>;
        currencies?: Record<string, string>;
    };
    meta?: any;
    warnings?: any[];
}
