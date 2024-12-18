import { renderHook } from '@testing-library/react';
import { useBitcoinUri } from '@/hooks/useBitcoinUri';

describe('useBitcoinUri', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderUriHook = (props = {}) => 
        renderHook(() => useBitcoinUri({
            address: 'test123',
            amount: '0.001',
            message: 'Test Payment',
            ...props
        }));

    it('should generate valid bitcoin URI', () => {
        const { result } = renderUriHook();
        expect(result.current).toBe('bitcoin:test123?amount=0.00100000&message=Test+Payment');
    });

    it('should handle missing message', () => {
        const { result } = renderUriHook({ message: undefined });
        expect(result.current).toBe('bitcoin:test123?amount=0.00100000');
    });

    it('should handle no params', () => {
        const { result } = renderUriHook({ 
            amount: undefined, 
            message: undefined 
        });
        expect(result.current).toBe('bitcoin:test123');
    });
}); 