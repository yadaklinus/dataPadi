import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center h-5">
                    <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 bg-slate-50 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        {...props}
                    />
                    <svg
                        className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                {label && (
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                        {label}
                    </span>
                )}
            </label>
            {error && <p className="text-xs text-red-500 font-bold ml-8">{error}</p>}
        </div>
    );
};

export default Checkbox;
