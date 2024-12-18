import { renderHook } from '@testing-library/react';
import { usePaymentValidation } from '@/hooks/usePaymentValidation';

describe('usePaymentValidation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderValidationHook = (initialAmount = '') => 
        renderHook(() => usePaymentValidation({ amount: initialAmount }));

    it('should validate valid amounts', () => {
        const { result } = renderValidationHook('0.12345678');
        expect(result.current.isValid).toBe(true);
        expect(result.current.error).toBeUndefined();
    });

    it('should reject amounts with too many decimal places', () => {
        const { result } = renderValidationHook('0.123456789');
        expect(result.current.isValid).toBe(false);
        expect(result.current.error).toBe('Please enter a valid number with maximum 8 decimal places');
    });

    it('should reject zero amounts', () => {
        const { result } = renderValidationHook('0');
        expect(result.current.isValid).toBe(false);
        expect(result.current.error).toBe('Amount must be greater than 0');
    });

    it('should reject negative amounts', () => {
        const { result } = renderValidationHook('-1');
        expect(result.current.isValid).toBe(false);
        expect(result.current.error).toBe('Amount must be greater than 0');
    });

    it('should handle empty input', () => {
        const { result } = renderValidationHook('');
        expect(result.current.isValid).toBe(false);
        expect(result.current.error).toBeUndefined();
    });

    it('should handle invalid input', () => {
        const { result } = renderValidationHook('invalid');
        expect(result.current.isValid).toBe(false);
        expect(result.current.error).toBe('Please enter a valid number with maximum 8 decimal places');
    });
}); 