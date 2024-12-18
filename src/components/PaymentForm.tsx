"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { FormData, Address } from '@/types/types';
import { usePaymentValidation } from '@/hooks/usePaymentValidation';

interface PaymentFormProps {
    address: Address;
    onSubmit: (data: FormData) => void;
};

export default function PaymentForm({ address, onSubmit }: PaymentFormProps) {
    const {
        register,
        handleSubmit,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            amount: '',
            message: ''
        },
        mode: "onChange"
    });

    const amount = watch("amount");
    const { isValid, error } = usePaymentValidation({ amount });

    const handleFormSubmit: SubmitHandler<FormData> = (data): void => {
        const formattedAmount = data.amount.replace(/^0+(?=\d)/, '');
        onSubmit({ 
            amount: formattedAmount,
            message: data.message || ''
        });
    };

    return (
        <div className="bg-paper max-w-xl mx-auto rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Request Payment</h2>
            
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                    <label 
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="amount"
                    >
                        Amount (BTC)
                    </label>
                    <input 
                        id="amount"
                        {...register("amount")} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900" 
                        placeholder="0"
                        inputMode="decimal"
                    />
                    {error && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (optional)
                    </label>
                    <input 
                        {...register("message")} 
                        data-testid="message-input"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900" 
                        placeholder="Add a message to the payment"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
                    disabled={!address || !isValid}
                >
                    Generate Payment QR
                </button>
            </form>
        </div>
    );
}; 