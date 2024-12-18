import { render, screen, act, waitFor } from '@testing-library/react';
import TransactionStatus from '@/components/TransactionStatus';
import checkTransaction from '@/lib/transactionMonitoring';

jest.mock('@/lib/transactionMonitoring', () => {
    return jest.fn(() => Promise.resolve({ received: false }));
});

describe('TransactionStatus', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        const mockCheckTransaction = jest.requireMock('@/lib/transactionMonitoring');
        mockCheckTransaction.mockClear();
        mockCheckTransaction.mockImplementation(() => 
            Promise.resolve({ received: false })
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const renderComponent = (props = {}) => 
        render(<TransactionStatus 
            address="test123" 
            expectedAmount="0.001" 
            {...props} 
        />);

    it('should show initial waiting state', async () => {
        renderComponent();
        expect(screen.getByText('Waiting for payment...')).toBeInTheDocument();
    });

    it('should show confirmed transaction status', async () => {
        (checkTransaction as jest.Mock).mockImplementation(() => 
            Promise.resolve({
                received: true,
                status: 'confirmed',
                txid: 'mock-txid',
                amount: '0.001',
                timestamp: 1234567890,
                senderAddress: 'mock-sender'
            })
        );

        await act(async () => {
            renderComponent();
            await Promise.resolve();
        });

        jest.runOnlyPendingTimers();

        await waitFor(() => {
            expect(screen.getByText(/Received!/i)).toBeInTheDocument();
        });
    });

    it('should handle API error response', async () => {
        (checkTransaction as jest.Mock).mockImplementation(() => 
            Promise.resolve({ 
                received: false, 
                error: 'API connection error.' 
            })
        );

        await act(async () => {
            renderComponent();
            await Promise.resolve();
        });

        jest.runOnlyPendingTimers();

        await waitFor(() => {
            expect(screen.getByText('API connection error.')).toBeInTheDocument();
        });
    });

    it('should handle empty timestamp', async () => {
        (checkTransaction as jest.Mock).mockImplementation(() => 
            Promise.resolve({
                received: true,
                status: 'confirmed',
                txid: 'mock-txid',
                amount: '0.001',
                senderAddress: 'mock-sender'
            })
        );

        await act(async () => {
            renderComponent();
            await Promise.resolve();
        });

        jest.runOnlyPendingTimers();

        await waitFor(() => {
            expect(screen.queryByText(/\d{1,2}\/\d{1,2}\/\d{4}/)).not.toBeInTheDocument();
        });
    });

    it('should show unconfirmed state', async () => {
        (checkTransaction as jest.Mock).mockImplementation(() => 
            Promise.resolve({
                received: true,
                status: 'unconfirmed',
                txid: 'mock-txid',
                amount: '0.001'
            })
        );

        await act(async () => {
            renderComponent();
            await Promise.resolve();
        });

        jest.runOnlyPendingTimers();

        await waitFor(() => {
            expect(screen.getByText(/Received!/i)).toBeInTheDocument();
            expect(screen.getByText(/Pending confirmation/i)).toBeInTheDocument();
        });
    });
}); 