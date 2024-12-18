import { render, screen, fireEvent } from '@testing-library/react';
import MnemonicDisplay from '@/components/MnemonicDisplay';
import PrivateKeyDisplay from '@/components/PrivateKeyDisplay';

const mockToggle = jest.fn();
const mockCopyToClipboard = jest.fn();

jest.mock('@/hooks/useVisibilityToggle', () => ({
    useVisibilityToggle: jest.fn(() => ({
        isVisible: true,
        toggle: mockToggle,
    }))
}));

jest.mock('@/hooks/useCopyToClipboard', () => ({
    useCopyToClipboard: jest.fn(() => ({
        copySuccess: false,
        copyToClipboard: mockCopyToClipboard,
    }))
}));

describe('Sensitive Information Displays', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('MnemonicDisplay', () => {
        const renderMnemonic = (props = { mnemonic: "test mnemonic" }) => 
            render(<MnemonicDisplay {...props} />);

        it('should render mobile layout', () => {
            renderMnemonic({ mnemonic: "word1 word2 word3 word4" });
            const mobileView = screen.getByTestId('mnemonic-mobile-view');
            expect(mobileView).toHaveClass('sm:hidden');
        });

        it('should handle copy functionality', async () => {
            renderMnemonic({ mnemonic: "test mnemonic" });
            const copyButton = screen.getByTestId('copy-mnemonic');
            await fireEvent.click(copyButton);
            expect(mockCopyToClipboard).toHaveBeenCalledWith('test mnemonic');
        });
    });

    describe('PrivateKeyDisplay', () => {
        const renderPrivateKey = (props = { privateKey: "test-key" }) => 
            render(<PrivateKeyDisplay {...props} />);

        it('should render hidden state correctly', () => {
            const useVisibilityToggleMock = jest.requireMock('@/hooks/useVisibilityToggle').useVisibilityToggle;
            useVisibilityToggleMock.mockImplementation(() => ({
                isVisible: false,
                toggle: mockToggle,
            }));
            
            renderPrivateKey({ privateKey: "test-key" });
            expect(screen.getByTestId('private-key-text')).toHaveTextContent('•'.repeat(52));
        });

        it('should handle copy functionality', async () => {
            renderPrivateKey({ privateKey: "test-key" });
            const copyButton = screen.getByTestId('copy-private-key');
            await fireEvent.click(copyButton);
            expect(mockCopyToClipboard).toHaveBeenCalledWith('test-key');
        });
    });
}); 