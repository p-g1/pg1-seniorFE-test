import { useMemo } from 'react';

interface UsePaymentValidationParams {
    amount: string;
    maxDecimals?: number;
};

type ValidationResult = {
    isValid: boolean;
    error?: string;
};

export function usePaymentValidation({ 
    amount, 
    maxDecimals = 8 
}: UsePaymentValidationParams): ValidationResult {
    return useMemo(() => {
        if (!amount) {
            return { isValid: false };
        };

        const numericAmount = parseFloat(amount);
        if (numericAmount <= 0) {
            return {
                isValid: false,
                error: "Amount must be greater than 0"
            };
        };

        const decimalRegex = new RegExp(`^\\d*\\.?\\d{0,${maxDecimals}}$`);
        if (!decimalRegex.test(amount)) {
            return {
                isValid: false,
                error: `Please enter a valid number with maximum ${maxDecimals} decimal places`
            };
        };

        return { isValid: true };
    }, [amount, maxDecimals]);
};