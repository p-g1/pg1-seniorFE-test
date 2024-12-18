import { renderHook, act } from '@testing-library/react';
import { useTransactionPolling } from '@/hooks/useTransactionPolling';
import checkTransaction from '@/lib/transactionMonitoring';

jest.mock('@/lib/transactionMonitoring');
const mockCheckTransaction = jest.mocked(checkTransaction);

describe('useTransactionPolling', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        mockCheckTransaction.mockResolvedValue({ received: false });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const renderPollingHook = (props = {}) => 
        renderHook(() => useTransactionPolling({
            address: 'test-address',
            expectedAmount: '0.001',
            startTime: Math.floor(Date.now() / 1000),
            ...props
        }));

    const waitForStateUpdate = async () => {
        await act(async () => {
            await Promise.resolve();
            await Promise.resolve();
        });
    };

    it('should start with initial state', async () => {
        const { result } = renderPollingHook();
        await waitForStateUpdate();
        expect(result.current.status).toEqual({ received: false });
        expect(result.current.polling).toBe(true);
    });

    it('should handle API error response', async () => {
        mockCheckTransaction.mockImplementationOnce(() => 
            Promise.resolve({ 
                received: false, 
                error: 'API connection error. Retrying...' 
            })
        );

        const { result } = renderPollingHook();
        await waitForStateUpdate();

        expect(result.current.status).toEqual({
            received: false,
            error: 'API connection error. Retrying...'
        });
    });

    it('should cleanup timeout on unmount', async () => {
        const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
        const { unmount } = renderPollingHook();
        await waitForStateUpdate();
        unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
    });

    it('should handle network errors', async () => {
        mockCheckTransaction.mockRejectedValueOnce(new Error('API Error'));
        const { result } = renderPollingHook();
        await waitForStateUpdate();

        expect(result.current.status).toEqual({
            received: false,
            error: 'API Error'
        });
        expect(result.current.polling).toBe(true);
    });

    it('should handle invalid response format', async () => {
        mockCheckTransaction.mockRejectedValueOnce(new Error('API Error'));
        const { result } = renderPollingHook();
        await waitForStateUpdate();

        expect(result.current.status).toEqual({
            received: false,
            error: 'API Error'
        });
    });

    it('should cleanup polling on unmount during error state', async () => {
        mockCheckTransaction.mockRejectedValueOnce(new Error('API Error'));
        const { unmount, result } = renderPollingHook();
        await waitForStateUpdate();

        expect(result.current.status).toEqual({
            received: false,
            error: 'API Error'
        });
        
        unmount();
    });
}); 