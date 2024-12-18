import { renderHook, act, waitFor } from '@testing-library/react';
import { useQRCode } from '@/hooks/useQRCode';
import QRCode from 'qrcode';

// Mock QRCode library
jest.mock('qrcode', () => ({
    toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,fake-qr-code')
}));

describe('useQRCode', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderQRHook = (text: string) => 
        renderHook(() => useQRCode({ text }));

    it('should generate QR code URL', async () => {
        const { result } = renderQRHook('test-text');

        await act(async () => {
            await Promise.resolve();
        });
        
        expect(result.current.qrCode).toBe('data:image/png;base64,fake-qr-code');
    });

    it('should handle empty text', () => {
        const { result } = renderQRHook('');
        expect(result.current.qrCode).toBe('');
    });

    it('should handle QR code generation error', async () => {
        // Mock QRCode.toDataURL to throw an error
        (QRCode.toDataURL as jest.Mock).mockRejectedValueOnce(new Error('QR Code generation failed'));
        
        const { result } = renderQRHook('bitcoin:test123');
        
        await waitFor(() => {
            expect(result.current.error).toBe('Error generating QR code');
        });
    });
}); 