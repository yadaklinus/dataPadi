import React from 'react';
import { X } from 'lucide-react';

interface FlightFiltersProps {
    onFilterChange: (filters: any) => void;
    className?: string;
}

const FlightFilters: React.FC<FlightFiltersProps> = ({ onFilterChange, className }) => {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">Filter</h3>
                <button className="text-sm text-blue-600 hover:underline">Clear all</button>
            </div>

            {/* Price Range */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <label className="font-semibold text-sm text-gray-700">Price</label>
                    <button className="text-xs text-blue-600">Clear</button>
                </div>
                <input
                    type="range"
                    min="50000"
                    max="500000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>₦50,000</span>
                    <span>₦500,000</span>
                </div>
            </div>

            {/* Stops */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <label className="font-semibold text-sm text-gray-700">Stops</label>
                    <button className="text-xs text-blue-600">Clear</button>
                </div>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">Non-stop</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">1 Stop</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">2+ Stops</span>
                    </label>
                </div>
            </div>

            {/* Airlines */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <label className="font-semibold text-sm text-gray-700">Airlines</label>
                    <button className="text-xs text-blue-600">Clear</button>
                </div>
                <div className="space-y-3">
                    {['NG Eagle', 'Air Peace', 'Ibom Air', 'Max Air', 'Rano Air'].map((airline) => (
                        <label key={airline} className="flex items-center gap-3 cursor-pointer group justify-between w-full">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900">{airline}</span>
                            </div>
                            <span className="text-xs text-gray-400">from ₦85k</span>
                        </label>
                    ))}
                </div>
            </div>

            <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-md">
                Apply Filters
            </button>
        </div>
    );
};

export default FlightFilters;
