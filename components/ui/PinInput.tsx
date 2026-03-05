import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface PinInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    error?: string | null;
    disabled?: boolean;
}

const PinInput: React.FC<PinInputProps> = ({
    length = 4,
    value,
    onChange,
    onComplete,
    error,
    disabled = false,
}) => {
    const [activeInput, setActiveInput] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const controls = useAnimation();

    useEffect(() => {
        if (error) {
            controls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.4, ease: "easeInOut" }
            });
            // Optionally clear the pin on error
            // onChange('');
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
                setActiveInput(0);
            }
        }
    }, [error, controls, onChange]);

    const focusInput = (index: number) => {
        if (index >= 0 && index < length) {
            inputRefs.current[index]?.focus();
            setActiveInput(index);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newValue = value.split('');

            if (value[index]) {
                // Clear current value
                newValue[index] = '';
                onChange(newValue.join(''));
            } else if (index > 0) {
                // Move back and clear previous value
                newValue[index - 1] = '';
                onChange(newValue.join(''));
                focusInput(index - 1);
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusInput(index + 1);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value.replace(/\D/g, ''); // Numbers only
        if (!val) return;

        // Use only the last character typed
        const singleChar = val.slice(-1);

        const newValue = value.split('');
        newValue[index] = singleChar;

        const stringValue = newValue.join('');
        onChange(stringValue);

        if (stringValue.length === length && onComplete) {
            onComplete(stringValue);
        }

        if (index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);

        if (pastedData) {
            onChange(pastedData);

            if (pastedData.length === length && onComplete) {
                onComplete(pastedData);
            }

            const nextIndex = Math.min(pastedData.length, length - 1);
            focusInput(nextIndex);
        }
    };

    // Generate an array representing the current characters or empty strings
    const pinArray = Array.from({ length }, (_, i) => value[i] || '');

    return (
        <div className="w-full">
            <motion.div
                animate={controls}
                className="flex justify-between items-center gap-2 sm:gap-4 w-full"
            >
                {pinArray.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={2} // Allow 2 so we can grab the last char in onChange
                        disabled={disabled}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={() => setActiveInput(index)}
                        onPaste={handlePaste}
                        className={`
              w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl outline-none transition-all duration-200
              ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-white text-slate-900'}
              ${error ? 'border-2 border-red-500 bg-red-50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}
              ${!error && index === activeInput ? 'border-2 border-blue-600 shadow-[0_4px_20px_rgba(37,99,235,0.15)] scale-105 z-10' : ''}
              ${!error && index !== activeInput && digit ? 'border-2 border-slate-800' : ''}
              ${!error && index !== activeInput && !digit ? 'border-2 border-slate-200 hover:border-slate-300' : ''}
            `}
                    />
                ))}
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 mt-3 text-red-600 justify-center"
                >
                    <AlertCircle size={14} />
                    <p className="text-xs font-bold">{error}</p>
                </motion.div>
            )}
        </div>
    );
};

export default PinInput;
