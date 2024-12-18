import { render, screen, waitFor } from '@testing-library/react';
import QRCode from 'qrcode';
import QRCodeGenerator from '@/components/QRCode';

// Mock QRCode library
jest.mock('qrcode', () => ({
    toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,fake-qr-code')
}));

describe('QRCodeGenerator', () => {
    const mockScrollTo = jest.fn();
    const mockScrollIntoView = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        window.scrollTo = mockScrollTo;
        Element.prototype.scrollIntoView = mockScrollIntoView;
    });

    const renderComponent = (props = {}) => 
        render(
            <QRCodeGenerator 
                recipientAddress="testAddress123"
                amount="0.00100000"
                message="Test payment"
                onClose={() => {}}
                {...props} 
            />
        );

    it('should return null when required props are missing', () => {
        const { container } = renderComponent({ 
            recipientAddress: '', 
            amount: '' 
        });
        
        expect(container.firstChild).toBeNull();
    });

    it('should render QR code and payment details', async () => {
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByAltText('QR Code')).toBeInTheDocument();
            expect(screen.getByText('testAddress123')).toBeInTheDocument();
            expect(screen.getByText('0.00100000 BTC')).toBeInTheDocument();
            expect(screen.getByText('Test payment')).toBeInTheDocument();
        });
    });

    it('should generate correct bitcoin URI', async () => {
        renderComponent();
    
            const expectedUri = 'bitcoin:testAddress123?amount=0.00100000&message=Test+payment';
            
            await waitFor(() => {
            // Verify the URI was passed to QRCode.toDataURL
            expect(QRCode.toDataURL).toHaveBeenCalledWith(
                expectedUri,
                expect.any(Object)
            );
        });
    });

    it('should handle QR code generation error', async () => {
        (QRCode.toDataURL as jest.Mock).mockRejectedValueOnce(new Error('QR Generation failed'));
        
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByTestId('qr-error')).toBeInTheDocument();
        });
    });
}); 