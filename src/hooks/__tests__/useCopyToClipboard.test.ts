import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

describe('useCopyToClipboard', () => {
    const mockClipboard = {
        writeText: jest.fn()
    };

    beforeEach(() => {
        jest.useFakeTimers();
        Object.assign(navigator, {
            clipboard: mockClipboard
        });
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const renderCopyHook = (duration?: number) => 
        renderHook(() => useCopyToClipboard(duration));

    it('should copy text and show success state', async () => {
        mockClipboard.writeText.mockResolvedValueOnce(undefined);
        const { result } = renderCopyHook();

        await act(async () => {
            await result.current.copyToClipboard('test text');
        });

        expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
        expect(result.current.copySuccess).toBe(true);
    });

    it('should handle copy failure', async () => {
        mockClipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));
        const { result } = renderCopyHook();

        await act(async () => {
            await result.current.copyToClipboard('test text');
        });

        expect(result.current.copySuccess).toBe(false);
    });

    it('should reset success state after duration', async () => {
        mockClipboard.writeText.mockResolvedValueOnce(undefined);
        const { result } = renderCopyHook(1000);

        await act(async () => {
            await result.current.copyToClipboard('test text');
        });

        expect(result.current.copySuccess).toBe(true);

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.copySuccess).toBe(false);
    });
}); 