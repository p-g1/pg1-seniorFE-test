import { render, screen, act, waitFor } from '@testing-library/react';
import { 
    mockAddress, 
    emptyResponse, 
    mockUnconfirmedTransactionResponse, 
    mockConfirmedTransactionResponse 
} from '@/mockData/mockData';
import QRCodeGenerator from '@/components/QRCode';
import { TextEncoder } from 'util';
import { MEMPOOL_HOST, WALLET_DERIVATION_PATH } from '@/constants/constants';

// Mock setup
jest.mock('qrcode', () => ({
    toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,fake-qr-code')
}));

jest.mock('@/lib/walletGenerator', () => ({
    createWallet: () => ({
        address: mockAddress,
        privateKey: 'mock-private-key',
        mnemonic: 'mock mnemonic',
        path: WALLET_DERIVATION_PATH
    })
}));

// Browser API mocks
global.TextEncoder = TextEncoder;
global.fetch = jest.fn();

const mockScrollTo = jest.fn();
const mockScrollIntoView = jest.fn();

Object.defineProperty(window, 'scrollTo', { value: mockScrollTo });
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: mockScrollIntoView });

describe('Payment Flow Integration', () => {
    const TEST_START_TIME = 1734102780;

    beforeEach(() => {
        jest.useFakeTimers();
        (global.fetch as jest.Mock).mockClear();
        mockScrollTo.mockClear();
        mockScrollIntoView.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const renderComponent = (props = {}) => 
        render(
            <QRCodeGenerator 
                recipientAddress={mockAddress}
                amount="0.0001"
                message="Test Payment"
                onClose={() => {}}
                startTime={TEST_START_TIME}
                {...props}
            />
        );

    const mockTransactionStages = () => {
        let callCount = 0;
        (global.fetch as jest.Mock).mockImplementation(() => {
            callCount++;
            switch (callCount) {
                case 1:
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(emptyResponse)
                    });
                case 2:
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockUnconfirmedTransactionResponse)
                    });
                default:
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockConfirmedTransactionResponse)
                    });
            }
        });
    };

    const advanceToNextStage = async () => {
        await act(async () => {
            jest.advanceTimersByTime(5000);
            // Flush all promises and timers
            await Promise.resolve();
            jest.runOnlyPendingTimers();
            await Promise.resolve();
        });
    };

    it('should handle complete payment flow: no tx -> unconfirmed -> confirmed', async () => {
        mockTransactionStages();
        
        await act(async () => {
            renderComponent();
            await Promise.resolve();
        });

        // Initial state
        expect(screen.getByText('Waiting for payment...')).toBeInTheDocument();

        // Unconfirmed state
        await advanceToNextStage();
        
        await waitFor(() => {
            expect(screen.getByTestId('transaction-status-pending')).toBeInTheDocument();
        }, { timeout: 3000 });

        // Confirmed state
        await advanceToNextStage();
        
        await waitFor(() => {
            const statusLabel = screen.getByText('Status', { selector: 'p.text-sm.text-gray-500' });
            const statusContainer = statusLabel.parentElement;
            const statusValue = statusContainer?.querySelector('.text-green-600');
            expect(statusValue).toHaveTextContent('Confirmed');
        }, { timeout: 3000 });

        // Verify transaction details
        await waitFor(() => {
            expect(screen.getByTestId('transaction-amount-value')).toHaveTextContent('0.0001 BTC');
            expect(screen.getByTestId('transaction-from-value')).toHaveTextContent('tb1q5rsytexct45skxxs5nr5m207hyp03y9cg8rz4p');
            expect(screen.getByText(mockAddress)).toBeInTheDocument();
        }, { timeout: 3000 });

        // Verify explorer link
        const explorerLink = screen.getByText('View').closest('a');
        expect(explorerLink).toHaveAttribute(
            'href',
            `${MEMPOOL_HOST}/tx/${mockUnconfirmedTransactionResponse[0].txid}`
        );
    }, 10000);
}); 