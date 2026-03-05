import React from 'react';
import { FlightOffer } from '../../types/flight';
import { getAirlineName, getAirportName } from '../../services/amadeusService';
import { format, parseISO } from 'date-fns';
import { Plane, Clock, ArrowRight } from 'lucide-react';

interface FlightCardProps {
    flight: FlightOffer;
    onSelect: (flight: FlightOffer) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect }) => {
    const itinerary = flight.itineraries[0];
    const segment = itinerary.segments[0];
    const airlineName = getAirlineName(segment.carrierCode);
    const departureTime = parseISO(segment.departure.at);
    const arrivalTime = parseISO(segment.arrival.at);
    const duration = itinerary.duration.replace('PT', '').toLowerCase();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Airline Info */}
                <div className="flex items-center gap-4 w-full md:w-1/4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">
                        {segment.carrierCode}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">{airlineName}</h4>
                        <p className="text-xs text-gray-500">{segment.carrierCode} {segment.number}</p>
                    </div>
                </div>

                {/* Flight Times */}
                <div className="flex items-center justify-between w-full md:w-2/4 gap-4 text-center">
                    <div>
                        <p className="text-xl font-bold text-gray-900">{format(departureTime, 'HH:mm')}</p>
                        <p className="text-xs text-gray-500">{getAirportName(segment.departure.iataCode)}</p>
                    </div>

                    <div className="flex flex-col items-center flex-1 px-4">
                        <p className="text-xs text-gray-500 mb-1">{duration}</p>
                        <div className="w-full h-[2px] bg-gray-200 relative flex items-center justify-center">
                            <Plane className="w-4 h-4 text-amber-500 absolute bg-white px-1 transform rotate-90" />
                        </div>
                        <p className="text-xs text-green-600 mt-1 font-medium">Non-stop</p>
                    </div>

                    <div>
                        <p className="text-xl font-bold text-gray-900">{format(arrivalTime, 'HH:mm')}</p>
                        <p className="text-xs text-gray-500">{getAirportName(segment.arrival.iataCode)}</p>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end w-full md:w-1/4 gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Economy</p>
                    <h3 className="text-2xl font-bold text-blue-900">
                        ₦{parseFloat(flight.price.total).toLocaleString()}
                    </h3>
                    <button
                        onClick={() => onSelect(flight)}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-sm mt-2"
                    >
                        View Deal
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FlightCard;
