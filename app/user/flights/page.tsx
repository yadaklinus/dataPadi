"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Calendar, User, Search, Loader2, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { requestFlight, getAirports } from '@/app/actions/flight';
import BottomNav from '@/components/layout/BottomNav';
import { toast } from 'react-hot-toast';

export default function FlightSearchPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [tripType, setTripType] = useState<'ONE_WAY' | 'ROUND_TRIP'>('ONE_WAY');

    // Form State
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flightClass, setFlightClass] = useState('ECONOMY');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);

    // Airports Data Setup
    const [airports, setAirports] = useState<any[]>([]);
    const [isAirportsLoading, setIsAirportsLoading] = useState(true);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const result = await getAirports();
                if (result.success && result.data) {
                    setAirports(result.data);
                } else {
                    toast.error(result.error || 'Failed to fetch airports');
                }
            } catch (err) {
                console.error('Error fetching airports:', err);
            } finally {
                setIsAirportsLoading(false);
            }
        };

        fetchAirports();
    }, []);

    const safeAirports = Array.isArray(airports) ? airports : [];

    const filteredOriginAirports = safeAirports.filter(ap =>
        ap?.name?.toLowerCase().includes((origin || '').toLowerCase()) ||
        ap?.code?.toLowerCase().includes((origin || '').toLowerCase()) ||
        ap?.location?.toLowerCase().includes((origin || '').toLowerCase())
    );

    const filteredDestAirports = safeAirports.filter(ap =>
        ap?.name?.toLowerCase().includes((destination || '').toLowerCase()) ||
        ap?.code?.toLowerCase().includes((destination || '').toLowerCase()) ||
        ap?.location?.toLowerCase().includes((destination || '').toLowerCase())
    );

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!origin || !destination || !targetDate) {
            toast.error('Please fill in all required fields (Origin, Destination, Date).');
            return;
        }

        if (tripType === 'ROUND_TRIP' && !returnDate) {
            toast.error('Please select a return date for your round trip.');
            return;
        }

        if (tripType === 'ROUND_TRIP' && new Date(returnDate) <= new Date(targetDate)) {
            toast.error('Return date must be after departure date.');
            return;
        }

        setIsLoading(true);

        try {
            const payload: any = {
                origin: origin.toUpperCase(),
                destination: destination.toUpperCase(),
                targetDate: new Date(targetDate).toISOString(),
                tripType,
                flightClass,
                adults,
                children,
                infants,
            };

            if (tripType === 'ROUND_TRIP' && returnDate) {
                payload.returnDate = new Date(returnDate).toISOString();
            }

            const result = await requestFlight(payload);

            if (result.success) {
                toast.success('Flight request submitted! We are sourcing the best prices.');
                router.push('/user/flights/bookings');
            } else {
                toast.error(result.error || 'Failed to submit request.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] relative pb-32 font-sans selection:bg-slate-800 selection:text-white">
            {/* Premium Header */}
            <div className="relative bg-slate-900 pt-16 pb-28 px-6 overflow-hidden rounded-b-[2.5rem] shadow-2xl z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2" />

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h1 className="text-3xl font-light text-white tracking-tight mb-2 flex items-center gap-3 mt-4">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                <Plane className="text-white" size={24} />
                            </div>
                            <span className="font-semibold">Where to next?</span>
                        </h1>
                        <p className="text-slate-300 font-medium text-sm mt-3 max-w-xs leading-relaxed tracking-wide">
                            Book your premium flights seamlessly. Tell us your destination.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/user/flights/bookings')}
                        className="mt-4 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all flex items-center gap-2 border border-white/10 backdrop-blur-md shadow-lg group"
                    >
                        <Clock size={16} className="text-slate-300 group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">My Bookings</span>
                    </button>
                </div>
            </div>

            <div className="px-5 -mt-20 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 p-6 md:p-8"
                >
                    {/* Trip Type Tabs */}
                    <div className="flex p-1.5 bg-slate-50/80 rounded-2xl mb-8 border border-slate-100">
                        <button
                            type="button"
                            onClick={() => setTripType('ONE_WAY')}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${tripType === 'ONE_WAY'
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            One Way
                        </button>
                        <button
                            type="button"
                            onClick={() => setTripType('ROUND_TRIP')}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${tripType === 'ROUND_TRIP'
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Round Trip
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-6">

                        <div className="space-y-4 relative">
                            {/* Origin */}
                            <div className="relative group z-20">
                                <label className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 block ml-1">From</label>
                                <div className="absolute top-9 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-800 transition-colors">
                                    <Plane size={18} className="transform -rotate-45" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={isAirportsLoading ? "Loading Airports..." : "Origin (e.g., LOS)"}
                                    value={origin}
                                    onChange={(e) => {
                                        setOrigin(e.target.value.toUpperCase());
                                        setShowOriginDropdown(true);
                                    }}
                                    onFocus={() => setShowOriginDropdown(true)}
                                    // Custom blur handler to allow click to register
                                    onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                                    required
                                    disabled={isAirportsLoading}
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-base font-semibold tracking-wide placeholder:text-slate-300 placeholder:font-medium transition-all uppercase disabled:opacity-50"
                                />
                                {showOriginDropdown && filteredOriginAirports.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl max-h-60 overflow-y-auto overflow-x-hidden z-50 py-2 custom-scrollbar">
                                        {filteredOriginAirports.map(ap => (
                                            <div
                                                key={`from-${ap?.code}`}
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // crucial to prevent the input from losing focus immediately
                                                    setOrigin(ap?.code || '');
                                                    setShowOriginDropdown(false);
                                                }}
                                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group/item border-b border-slate-50 last:border-0"
                                            >
                                                <div className="flex items-start gap-3 overflow-hidden">
                                                    <MapPin size={16} className="text-slate-300 mt-0.5 group-hover/item:text-slate-500 transition-colors shrink-0" />
                                                    <div className="truncate">
                                                        <div className="text-sm font-semibold text-slate-800 truncate pr-2">{ap?.name}</div>
                                                        <div className="text-[11px] text-slate-500 font-medium truncate">{ap?.location}</div>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0">{ap?.code}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Decorative Line between inputs */}
                            <div className="absolute left-[23px] top-[74px] bottom-[74px] w-[1.5px] bg-slate-200 z-0 border-l border-dashed border-slate-300 opacity-60" />

                            {/* Destination */}
                            <div className="relative group z-10">
                                <label className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 block ml-1">To</label>
                                <div className="absolute top-9 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-800 transition-colors">
                                    <Plane size={18} className="transform rotate-45" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={isAirportsLoading ? "Loading Airports..." : "Destination (e.g., ABV)"}
                                    value={destination}
                                    onChange={(e) => {
                                        setDestination(e.target.value.toUpperCase());
                                        setShowDestDropdown(true);
                                    }}
                                    onFocus={() => setShowDestDropdown(true)}
                                    // Custom blur handler to allow click to register
                                    onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
                                    required
                                    disabled={isAirportsLoading}
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-base font-semibold tracking-wide placeholder:text-slate-300 placeholder:font-medium transition-all uppercase disabled:opacity-50"
                                />
                                {showDestDropdown && filteredDestAirports.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl max-h-60 overflow-y-auto overflow-x-hidden z-50 py-2 custom-scrollbar">
                                        {filteredDestAirports.map(ap => (
                                            <div
                                                key={`to-${ap?.code}`}
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // crucial to prevent the input from losing focus immediately
                                                    setDestination(ap?.code || '');
                                                    setShowDestDropdown(false);
                                                }}
                                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group/item border-b border-slate-50 last:border-0"
                                            >
                                                <div className="flex items-start gap-3 overflow-hidden">
                                                    <MapPin size={16} className="text-slate-300 mt-0.5 group-hover/item:text-slate-500 transition-colors shrink-0" />
                                                    <div className="truncate">
                                                        <div className="text-sm font-semibold text-slate-800 truncate pr-2">{ap?.name}</div>
                                                        <div className="text-[11px] text-slate-500 font-medium truncate">{ap?.location}</div>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0">{ap?.code}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`grid ${tripType === 'ROUND_TRIP' ? 'grid-cols-2' : 'grid-cols-1'} gap-5`}>
                            <div className="relative group">
                                <label className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 block ml-1">Date</label>
                                <div className="absolute top-9 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-800 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="date"
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-sm font-semibold text-slate-700 transition-all uppercase tracking-wide flex items-center"
                                />
                            </div>

                            {tripType === 'ROUND_TRIP' && (
                                <div className="relative group animate-in fade-in slide-in-from-right-4 duration-300">
                                    <label className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 block ml-1">Return</label>
                                    <div className="absolute top-9 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-800 transition-colors">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        required
                                        className="w-full h-14 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-sm font-semibold text-slate-700 transition-all uppercase tracking-wide flex items-center"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 block ml-1">Cabin Class</label>
                            <div className="absolute top-9 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-800 transition-colors">
                                <Plane size={18} />
                            </div>
                            <select
                                value={flightClass}
                                onChange={(e) => setFlightClass(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-sm font-semibold text-slate-900 transition-all appearance-none"
                            >
                                <option value="ECONOMY">Economy</option>
                                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                <option value="BUSINESS">Business Class</option>
                                <option value="FIRST">First Class</option>
                            </select>
                        </div>

                        {/* Passengers */}
                        <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/60">
                            <div className="flex items-center gap-3 mb-5 text-slate-800">
                                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                    <User size={16} />
                                </div>
                                <span className="font-semibold text-sm tracking-tight">Travelers</span>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm transition-all hover:shadow-md">
                                    <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-2">Adults (12+)</div>
                                    <div className="flex items-center justify-between px-1">
                                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-95">-</button>
                                        <span className="font-semibold text-slate-900 text-lg">{adults}</span>
                                        <button type="button" onClick={() => setAdults(Math.min(9, adults + 1))} className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95">+</button>
                                    </div>
                                </div>

                                <div className="text-center bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm transition-all hover:shadow-md">
                                    <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-2">Children (2-11)</div>
                                    <div className="flex items-center justify-between px-1">
                                        <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-95">-</button>
                                        <span className="font-semibold text-slate-900 text-lg">{children}</span>
                                        <button type="button" onClick={() => setChildren(Math.min(9, children + 1))} className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95">+</button>
                                    </div>
                                </div>

                                <div className="text-center bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm transition-all hover:shadow-md">
                                    <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-2">Infants (&lt;2)</div>
                                    <div className="flex items-center justify-between px-1">
                                        <button type="button" onClick={() => setInfants(Math.max(0, infants - 1))} className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-95">-</button>
                                        <span className="font-semibold text-slate-900 text-lg">{infants}</span>
                                        <button type="button" onClick={() => setInfants(Math.min(adults, infants + 1))} className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-semibold tracking-wide rounded-2xl shadow-xl shadow-slate-900/20 mt-6 text-base flex justify-center items-center gap-3 transition-all duration-300 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <Search size={20} /> Find Premium Flights
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>

            <BottomNav />
        </div>
    );
}
