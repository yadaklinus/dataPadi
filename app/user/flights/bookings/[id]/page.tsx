"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getFlightRequest, selectFlightOption, payForFlight, cancelFlightRequest, FlightPassenger } from '@/app/actions/flight';
import { format } from 'date-fns';
import { Loader2, ArrowLeft, Plane, CheckCircle, AlertCircle, Calendar, Download, Wallet, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BottomNav from '@/components/layout/BottomNav';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function FlightDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Screen 3 State
    const [selectedOptionId, setSelectedOptionId] = useState('');
    const [passengers, setPassengers] = useState<FlightPassenger[]>([]);

    useEffect(() => {
        if (id) fetchRequestDetails();
    }, [id]);

    const fetchRequestDetails = async () => {
        try {
            const res = await getFlightRequest(id as string);



            if (res.success && res.data) {
                setRequest(res.data);

                console.log(res)

                // Initialize passenger forms if not already done
                if (res.data.status === 'OPTIONS_PROVIDED' && passengers.length === 0) {
                    const totalPassengers = (res.data.adults || 0) + (res.data.children || 0) + (res.data.infants || 0);
                    const initialPassengers = Array(totalPassengers).fill({
                        title: 'MR',
                        firstName: '',
                        lastName: '',
                        dateOfBirth: '',
                        gender: 'MALE'
                    });
                    setPassengers(initialPassengers);
                }
            } else {
                toast.error(res.error || 'Failed to open request');
                router.push('/user/flights/bookings');
            }
        } catch (error) {
            toast.error('Could not fetch flight details');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePassengerChange = (index: number, field: keyof FlightPassenger, value: string) => {
        const newPassengers = [...passengers];
        newPassengers[index] = { ...newPassengers[index], [field]: value };
        setPassengers(newPassengers);
    };

    const handleSelectOption = async () => {
        if (!selectedOptionId) {
            toast.error('Please select a flight option');
            return;
        }

        // Validate passengers
        for (let i = 0; i < passengers.length; i++) {
            const p = passengers[i];
            if (!p.firstName || !p.lastName || !p.dateOfBirth) {
                toast.error(`Please fill all details for Passenger ${i + 1}`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const payload = {
                selectedOptionId,
                passengers: passengers.map(p => ({
                    ...p,
                    dateOfBirth: new Date(p.dateOfBirth).toISOString()
                }))
            };
            const res = await selectFlightOption(id as string, payload);
            if (res.success) {
                toast.success('Details submitted successfully!');
                fetchRequestDetails(); // Re-fetch to get updated state
            } else {
                toast.error(res.error || 'Failed to submit selection');
            }
        } catch (error) {
            toast.error('An error occurred while submitting.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayment = async () => {
        setIsSubmitting(true);
        try {
            const res = await payForFlight(id as string);
            if (res.success) {
                toast.success('Payment successful! Processing your ticket.');
                fetchRequestDetails();
            } else {
                toast.error(res.error || 'Payment failed.');
            }
        } catch (error) {
            toast.error('Transaction could not be completed at this time.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this flight request?')) return;
        setIsSubmitting(true);
        try {
            const res = await cancelFlightRequest(id as string);
            if (res.success) {
                toast.success('Flight request cancelled successfully.');
                fetchRequestDetails();
            } else {
                toast.error(res.error || 'Failed to cancel request.');
            }
        } catch (error) {
            toast.error('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !request) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-[3px] border-slate-200 rounded-full" />
                    <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Plane className="text-slate-800" size={20} />
                    </div>
                </div>
                <p className="text-slate-500 text-sm mt-6 font-medium tracking-widest uppercase">Curating Journey...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans selection:bg-slate-800 selection:text-white">
            {/* Premium Header */}
            <div className="relative bg-slate-900 text-white px-5 pt-12 pb-24 shadow-2xl rounded-b-[2.5rem] mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => router.back()} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all">
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                        <h1 className="text-xl font-semibold tracking-wide">Flight Details</h1>
                    </div>

                    <div className="bg-white/5 rounded-3xl p-6 backdrop-blur-lg border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-5">
                            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                                {request.tripType === 'ROUND_TRIP' ? 'Round Trip' : 'One Way'}
                            </span>
                            <span className="text-white font-medium text-[10px] uppercase tracking-wider bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">
                                {request.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 py-2">
                            <span className="text-4xl font-light tracking-tight">{request.origin}</span>
                            <div className="flex-1 flex items-center justify-center relative">
                                <div className="absolute w-full h-px bg-white/20"></div>
                                <Plane size={20} className="text-slate-300 transform rotate-90 relative z-10 bg-slate-800/80 p-1.5 rounded-full backdrop-blur-md box-content border border-white/10" />
                            </div>
                            <span className="text-4xl font-light tracking-tight">{request.destination}</span>
                        </div>
                        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-200 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={15} className="text-slate-400" />
                                <span className="font-medium">{format(new Date(request.targetDate), 'dd MMM, yyyy')}</span>
                            </div>
                            {request.tripType === 'ROUND_TRIP' && request.returnDate && (
                                <div className="flex items-center gap-2">
                                    <span className="opacity-30">—</span>
                                    <Calendar size={15} className="text-slate-400" />
                                    <span className="font-medium">{format(new Date(request.returnDate), 'dd MMM, yyyy')}</span>
                                </div>
                            )}
                            <div className="hidden sm:block w-px h-4 bg-white/20"></div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{(request.adults || 0) + (request.children || 0) + (request.infants || 0)}</span>
                                <span className="opacity-70 text-xs uppercase tracking-wider font-medium">Passenger(s)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 space-y-6 relative z-20 -mt-14">

                {/* Sourcing State */}
                {(request.status === 'FUTURE_HELD' || request.status === 'PENDING') && (
                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10" />
                        <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center mb-6 border border-slate-100">
                            <Loader2 size={24} className="animate-spin text-slate-800" />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-xl mb-3 tracking-tight">Curating Best Options</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                            Our travel experts are manually sourcing the most comfortable and cost-effective flights for your journey. We will notify you shortly.
                        </p>
                    </div>
                )}

                {/* Options State */}
                {request.status === 'OPTIONS_PROVIDED' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex items-start gap-4">
                            <div className="bg-slate-50 p-3 rounded-full mt-0.5 border border-slate-100">
                                <AlertCircle className="text-slate-800" size={20} />
                            </div>
                            <div>
                                <h3 className="text-slate-900 font-semibold text-lg tracking-tight">Select Your Flight</h3>
                                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                                    We have curated these premium options for your route. Please select your preferred flight to continue.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 p-6">
                            <h4 className="font-semibold text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                                <Plane size={18} className="text-slate-400" /> Curated Options
                            </h4>

                            <div className="space-y-4">
                                {request.flightOptions?.map((opt: any) => (
                                    <label
                                        key={opt.id}
                                        className={`group flex items-center gap-5 p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${selectedOptionId === opt.id ? 'border-slate-800 bg-slate-50' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedOptionId === opt.id ? 'border-slate-800' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                            {selectedOptionId === opt.id && <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-slate-900 text-lg">{opt.airline}</span>
                                                <span className="font-medium text-slate-900 text-lg tracking-tight">₦{Number(opt.estPrice).toLocaleString()}</span>
                                            </div>
                                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                                {opt.date && <span className="font-medium">{format(new Date(opt.date), 'dd MMM, yyyy')}</span>}
                                                {opt.date && <span className="w-1 h-1 rounded-full bg-slate-300" />}
                                                <span>{opt.time || opt.timingInfo || 'Timing provided upon ticketing'}</span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {selectedOptionId && (
                            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 p-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="font-semibold text-slate-900 flex items-center gap-3 tracking-tight">
                                        <div className="bg-slate-50 p-2 rounded-full border border-slate-100"><CheckCircle size={18} className="text-slate-800" /></div>
                                        Passenger Details
                                    </h4>
                                </div>

                                <div className="space-y-8">
                                    {passengers.map((p, idx) => (
                                        <div key={idx} className="relative">
                                            {idx > 0 && <div className="absolute -top-4 w-full h-px bg-slate-100" />}
                                            <h5 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-5">Passenger {idx + 1}</h5>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Title</label>
                                                    <select
                                                        value={p.title}
                                                        onChange={(e) => handlePassengerChange(idx, 'title', e.target.value)}
                                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-sm font-medium transition-all"
                                                    >
                                                        <option value="MR">Mr.</option>
                                                        <option value="MRS">Mrs.</option>
                                                        <option value="MS">Ms.</option>
                                                        <option value="MISS">Miss</option>
                                                        <option value="MSTR">Mstr.</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">First Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="As on ID"
                                                        value={p.firstName}
                                                        onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-sm font-medium transition-all placeholder:text-slate-400"
                                                    />
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Last Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="As on ID"
                                                        value={p.lastName}
                                                        onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-sm font-medium transition-all placeholder:text-slate-400"
                                                    />
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Date of Birth</label>
                                                    <input
                                                        type="date"
                                                        value={p.dateOfBirth}
                                                        onChange={(e) => handlePassengerChange(idx, 'dateOfBirth', e.target.value)}
                                                        className="w-full h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-sm font-medium transition-all uppercase text-slate-700"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Gender</label>
                                                    <select
                                                        value={p.gender}
                                                        onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-sm font-medium transition-all"
                                                    >
                                                        <option value="MALE">Male</option>
                                                        <option value="FEMALE">Female</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleSelectOption}
                                    disabled={isSubmitting}
                                    className="w-full mt-8 flex justify-center items-center gap-2 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/20 transition-all duration-300 font-semibold tracking-wide"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                    Confirm Details
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Quoted State */}
                {request.status === 'QUOTED' && (
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2" />

                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                                    <Clock className="text-slate-800" size={28} />
                                </div>
                                <h3 className="text-slate-900 font-semibold text-2xl tracking-tight mb-2">Secure Your Seat</h3>
                                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                                    Your premium seat is temporarily held. Please complete payment within 30 minutes to confirm your reservation.
                                </p>
                            </div>

                            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 mb-8 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Airline</span>
                                    <span className="text-slate-900 font-semibold">{request.airlineName || 'Selected Airline'}</span>
                                </div>
                                <div className="w-full h-px bg-slate-200/60 my-4" />
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">Total Amount</span>
                                    <span className="text-slate-900 font-light text-3xl tracking-tight">₦{Number(request.sellingPrice || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePayment}
                                disabled={isSubmitting}
                                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 text-base font-semibold tracking-wide flex justify-center items-center gap-3 rounded-xl transition-all duration-300"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Wallet size={20} />}
                                Pay Securely
                            </Button>
                        </div>
                    </div>
                )}

                {/* Paid Processing State */}
                {request.status === 'PAID_PROCESSING' && (
                    <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 text-center relative overflow-hidden">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 border-[3px] border-slate-100 rounded-full" />
                            <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full border-t-transparent animate-spin duration-1000" />
                            <div className="absolute inset-0 mx-auto my-auto flex items-center justify-center">
                                <Plane className="text-slate-800" size={28} />
                            </div>
                        </div>
                        <h3 className="text-slate-900 font-semibold text-2xl tracking-tight mb-3">Processing Ticket</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                            Your payment is confirmed. We are currently finalizing your e-ticket with the airline. This usually takes a few moments.
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-xs font-semibold tracking-widest uppercase">
                            <Loader2 size={14} className="animate-spin" /> Finalizing
                        </div>
                    </div>
                )}

                {/* Ticketed State */}
                {request.status === 'TICKETED' && (
                    <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 text-center relative overflow-hidden z-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10 opacity-80 translate-x-1/3 -translate-y-1/3" />
                        <div className="w-20 h-20 bg-slate-900 text-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl shadow-slate-900/20">
                            <CheckCircle size={36} />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-2xl tracking-tight mb-3">Booking Confirmed</h3>
                        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                            Your flight has been successfully booked and ticketed. Your itinerary is ready for your upcoming journey.
                        </p>

                        {request.eTicketUrl ? (
                            <a
                                href={request.eTicketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-3 font-semibold tracking-wide shadow-lg shadow-slate-900/20 transition-all duration-300"
                            >
                                <Download size={20} />
                                Download E-Ticket
                            </a>
                        ) : (
                            <button disabled className="w-full h-14 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center gap-2 font-semibold tracking-wide cursor-not-allowed">
                                Ticket Sent via Email
                            </button>
                        )}
                    </div>
                )}

                {/* Cancelled State */}
                {request.status === 'CANCELLED' && (
                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center mb-5 border border-slate-100">
                            <XCircle className="text-slate-400" size={28} />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-xl tracking-tight mb-2">Request Cancelled</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            This flight request has been cancelled and is no longer active.
                        </p>
                    </div>
                )}

                {/* Refunded State */}
                {request.status === 'REFUNDED' && (
                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center mb-5 border border-slate-100">
                            <Wallet className="text-slate-500" size={28} />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-xl tracking-tight mb-2">Payment Refunded</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            This booking was cancelled and the ticket cost has been refunded to your wallet.
                        </p>
                    </div>
                )}

                {/* Expired State */}
                {request.status === 'EXPIRED' && (
                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center mb-5 border border-slate-100">
                            <Clock className="text-slate-400" size={28} />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-xl tracking-tight mb-2">Quote Expired</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            The ticketing time limit has passed. Please submit a new request to travel.
                        </p>
                    </div>
                )}

                {/* Show Cancel Button for eligible pre-payment active states */}
                {['FUTURE_HELD', 'PENDING', 'OPTIONS_PROVIDED', 'SELECTION_MADE', 'QUOTED'].includes(request.status) && (
                    <div className="pt-4 pb-8 flex justify-center">
                        <button
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="group flex items-center gap-2 px-6 py-3 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all font-semibold text-xs uppercase tracking-widest disabled:opacity-50"
                        >
                            <XCircle size={16} className="transition-colors group-hover:text-slate-800" /> Cancel Reservation
                        </button>
                    </div>
                )}

            </div>

            <BottomNav />
        </div>
    );
}
