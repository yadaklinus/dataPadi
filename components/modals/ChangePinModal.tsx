"use client"
import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, AlertTriangle, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { changePin } from '@/app/actions/auth/changePin';

interface ChangePinModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose }) => {
    const [password, setPassword] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async () => {
        if (newPin.length !== 4) {
            setErrorMessage('New PIN must be exactly 4 digits');
            return;
        }

        if (newPin !== confirmPin) {
            setErrorMessage('PINs do not match');
            return;
        }

        if (!password) {
            setErrorMessage('Password is required');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('password', password);
        formData.append('newPin', newPin);

        const result = await changePin(formData);

        if (result.success) {
            setIsLoading(false);
            setSuccessMessage(result.message || 'Transaction PIN successfully updated.');
            setTimeout(() => {
                handleClose();
            }, 2000);
        } else {
            setErrorMessage(result.error || 'Failed to change PIN');
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setNewPin('');
        setConfirmPin('');
        setErrorMessage('');
        setSuccessMessage('');
        onClose();
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={handleClose} onBack={handleClose} title="">
            <div className="flex flex-col items-center -mt-2">
                {/* Header Icon */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 opacity-50" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white">
                        <KeyRound size={40} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Change Transaction PIN</h2>
                <p className="text-center text-gray-500 text-sm px-4 mb-6 leading-relaxed">
                    Set a new 4-digit PIN for securing your transactions. You must verify your main login password to proceed.
                </p>

                {errorMessage && (
                    <div className="w-full bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 border border-red-100 flex items-center gap-2">
                        <AlertTriangle size={14} /> {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="w-full bg-green-50 text-green-600 p-3 rounded-xl text-xs font-bold mb-4 border border-green-100 flex items-center gap-2">
                        <CheckCircle2 size={14} /> {successMessage}
                    </div>
                )}

                <div className="w-full space-y-4">
                    <Input
                        label="Login Password"
                        placeholder="Enter current password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock size={18} />}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="New PIN"
                            placeholder="4 digits"
                            type="password"
                            maxLength={4}
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                            leftIcon={<KeyRound size={18} />}
                            className="text-lg tracking-[0.2em] font-mono text-center"
                        />
                        <Input
                            label="Confirm PIN"
                            placeholder="4 digits"
                            type="password"
                            maxLength={4}
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                            leftIcon={<KeyRound size={18} />}
                            className="text-lg tracking-[0.2em] font-mono text-center"
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            fullWidth
                            isLoading={isLoading}
                            disabled={!password || newPin.length !== 4 || confirmPin.length !== 4}
                            onClick={handleSubmit}
                            className="h-14 text-lg shadow-lg shadow-blue-200"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Set New PIN'}
                        </Button>
                    </div>
                </div>
            </div>
        </BottomSheet>
    );
};

export default ChangePinModal;
