import { render, screen, fireEvent } from '@testing-library/react';
import WalletAddress from '@/components/WalletAddress';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

jest.mock('@/hooks/useCopyToClipboard', () => ({
    useCopyToClipboard: jest.fn()
}));

describe('WalletAddress', () => {
    const mockCopyToClipboard = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useCopyToClipboard as jest.Mock).mockReturnValue({
            copySuccess: false,
            copyToClipboard: mockCopyToClipboard
        });
    });

    const renderComponent = (props = {}) => 
        render(<WalletAddress address="test-address" {...props} />);

    it('should handle copy functionality', async () => {
        renderComponent();
        
        const copyButton = screen.getByTestId('copy-address');
        await fireEvent.click(copyButton);
        
        expect(mockCopyToClipboard).toHaveBeenCalledWith('test-address');
    });

    it('should show success state', () => {
        (useCopyToClipboard as jest.Mock).mockReturnValue({
            copySuccess: true,
            copyToClipboard: mockCopyToClipboard
        });

        renderComponent();
        
        const copyButton = screen.getByTestId('copy-address');
        expect(copyButton.querySelector('path')).toHaveAttribute(
            'd',
            'M5 13l4 4L19 7'
        );
    });
}); 