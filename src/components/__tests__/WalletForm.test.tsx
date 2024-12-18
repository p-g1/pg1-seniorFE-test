import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletForm from '@/components/WalletForm';
import userEvent from '@testing-library/user-event';

// Mock QRCode component
jest.mock('../QRCode', () => {
    return function MockQRCode({ uri, onClose }: { uri: string, onClose?: () => void }) {
        return (
            <div data-testid="qr-code">
                <img alt="QR Code" src="mock-qr-url" />
                <p>{uri}</p>
                {onClose && (
                    <button onClick={onClose} aria-label="Close">
                        Close
                    </button>
                )}
            </div>
        );
    };
});

describe('WalletForm', () => {
    const mockAddress = "test-address";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = {}) => 
        render(<WalletForm address={mockAddress} {...props} />);

    it('should start with disabled submit button', () => {
        renderComponent();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should validate bitcoin amount correctly', async () => {
        renderComponent();
        
        const input = screen.getByPlaceholderText('0');
        fireEvent.change(input, { target: { value: '0.123' } });
        
        await waitFor(() => {
            expect(screen.getByRole('button')).not.toBeDisabled();
        });
    });

    it('should show error for invalid amount', async () => {
        renderComponent();
        
        const input = screen.getByPlaceholderText('0');
        fireEvent.change(input, { target: { value: 'invalid' } });
        
        await waitFor(() => {
            expect(screen.getByText('Please enter a valid number with maximum 8 decimal places')).toBeInTheDocument();
        });
    });

    it('should show error for zero amount', async () => {
        renderComponent();
        
        const input = screen.getByPlaceholderText('0');
        fireEvent.change(input, { target: { value: '0' } });
        
        await waitFor(() => {
            expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
        });
    });

    it('should handle form submission correctly', async () => {
        renderComponent();
        
        const amountInput = screen.getByPlaceholderText('0');
        const messageInput = screen.getByPlaceholderText('Add a message to the payment');
        
        fireEvent.change(amountInput, { target: { value: '0.001' } });
        fireEvent.change(messageInput, { target: { value: 'Test payment' } });
        
        fireEvent.click(screen.getByRole('button'));
        
        await waitFor(() => {
            expect(screen.getByTestId('qr-code')).toBeInTheDocument();
            expect(screen.getByAltText('QR Code')).toBeInTheDocument();
        });
    });

    it('should handle QR code close', async () => {
        renderComponent();
        
        const amountInput = screen.getByPlaceholderText('0');
        fireEvent.change(amountInput, { target: { value: '0.001' } });
        fireEvent.click(screen.getByRole('button'));
        
        await waitFor(() => {
            const closeButton = screen.getByRole('button', { name: /close/i });
            fireEvent.click(closeButton);
        });
        
        expect(screen.queryByAltText('QR Code')).not.toBeInTheDocument();
    });

    it('should handle missing address', () => {
        renderComponent({ address: undefined });
        
        const amountInput = screen.getByPlaceholderText('0');
        fireEvent.change(amountInput, { target: { value: '0.001' } });
        
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should handle form submission with empty message', async () => {
        renderComponent();
        
        await userEvent.type(screen.getByPlaceholderText('0'), '0.001');
        await userEvent.click(screen.getByRole('button', { name: /Generate/i }));
        
        expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });
}); 