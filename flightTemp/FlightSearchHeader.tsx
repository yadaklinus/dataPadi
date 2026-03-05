import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ArrowRightLeft, Calendar, User, Plane, Search } from 'lucide-react';
import { FlightSearchParams } from '../../types/flight';
import { format } from 'date-fns';

// Inline utility for now if lib/utils doesn't exist
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface FlightSearchHeaderProps {
    onSearch: (params: FlightSearchParams) => void;
    initialParams?: Partial<FlightSearchParams>;
}

const FlightSearchHeader: React.FC<FlightSearchHeaderProps> = ({ onSearch, initialParams }) => {
    const { register, handleSubmit, control, watch, setValue } = useForm<FlightSearchParams>({
        defaultValues: {
            originLocationCode: 'ABV',
            destinationLocationCode: 'LOS',
            departureDate: format(new Date(), 'yyyy-MM-dd'),
            adults: 1,
            travelClass: 'ECONOMY',
            ...initialParams
        }
    });

    const onSubmit = (data: FlightSearchParams) => {
        onSearch(data);
    };

    const swapLocations = () => {
        const origin = watch('originLocationCode');
        const dest = watch('destinationLocationCode');
        setValue('originLocationCode', dest);
        setValue('destinationLocationCode', origin);
    };

    return (
        <div className="bg-[#0a1045] p-4 md:p-6 rounded-xl shadow-lg text-white">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Top Row: Trip Type, Passengers, Class */}
                <div className="flex flex-wrap gap-4 text-sm font-medium mb-4">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
                        <Plane className="w-4 h-4" />
                        <span>One way</span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
                        <User className="w-4 h-4" />
                        <select
                            {...register('adults', { valueAsNumber: true })}
                            className="bg-transparent border-none outline-none cursor-pointer appearance-none"
                        >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num} className="text-black">{num} Adult{num > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
                        <User className="w-4 h-4" />
                        <select
                            {...register('children', { valueAsNumber: true })}
                            className="bg-transparent border-none outline-none cursor-pointer appearance-none"
                        >
                            {[0, 1, 2, 3, 4].map(num => (
                                <option key={num} value={num} className="text-black">{num} Child{num !== 1 ? 'ren' : ''}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
                        <select
                            {...register('travelClass')}
                            className="bg-transparent border-none outline-none cursor-pointer appearance-none uppercase"
                        >
                            <option value="ECONOMY" className="text-black">Economy</option>
                            <option value="PREMIUM_ECONOMY" className="text-black">Premium Economy</option>
                            <option value="BUSINESS" className="text-black">Business</option>
                            <option value="FIRST" className="text-black">First Class</option>
                        </select>
                    </div>
                </div>

                {/* Main Search Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">

                    {/* Origin */}
                    <div className="md:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <Plane className="w-5 h-5 transform -rotate-45" />
                        </div>
                        <div className="bg-white text-black rounded-lg p-3 pl-10 h-16 flex flex-col justify-center relative">
                            <label className="text-xs text-gray-500 font-semibold uppercase">From</label>
                            <input
                                {...register('originLocationCode')}
                                className="font-bold text-lg outline-none w-full bg-transparent placeholder-gray-300"
                                placeholder="City or Airport"
                            />
                        </div>
                    </div>

                    {/* Swap Button */}
                    <div className="md:col-span-1 flex justify-center -my-3 md:my-0 z-10">
                        <button
                            type="button"
                            onClick={swapLocations}
                            className="bg-[#1D4ED8] p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors border-2 border-[#0a1045]"
                        >
                            <ArrowRightLeft className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Destination */}
                    <div className="md:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <Plane className="w-5 h-5 transform rotate-45" />
                        </div>
                        <div className="bg-white text-black rounded-lg p-3 pl-10 h-16 flex flex-col justify-center">
                            <label className="text-xs text-gray-500 font-semibold uppercase">To</label>
                            <input
                                {...register('destinationLocationCode')}
                                className="font-bold text-lg outline-none w-full bg-transparent placeholder-gray-300"
                                placeholder="City or Airport"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="md:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="bg-white text-black rounded-lg p-3 pl-10 h-16 flex flex-col justify-center">
                            <label className="text-xs text-gray-500 font-semibold uppercase">Departure</label>
                            <input
                                type="date"
                                {...register('departureDate')}
                                className="font-bold text-lg outline-none w-full bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-2 h-16">
                        <button
                            type="submit"
                            className="w-full h-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                            <span>Search</span>
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default FlightSearchHeader;
