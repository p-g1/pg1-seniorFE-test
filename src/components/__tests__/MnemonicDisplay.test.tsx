import { render, screen, within } from '@testing-library/react';
import MnemonicDisplay from '@/components/MnemonicDisplay';

jest.mock('@/hooks/useVisibilityToggle', () => ({
    useVisibilityToggle: () => ({
        isVisible: true,
        toggle: jest.fn()
    })
}));

jest.mock('@/hooks/useCopyToClipboard', () => ({
    useCopyToClipboard: () => ({
        copySuccess: false,
        copyToClipboard: jest.fn()
    })
}));

describe('MnemonicDisplay', () => {
    const mockMnemonic = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12';

    it('should render line breaks correctly in desktop view', () => {
        render(<MnemonicDisplay mnemonic={mockMnemonic} />);
        
        const words = mockMnemonic.split(' ');
        const desktopContainer = screen.getByTestId('mnemonic-text').querySelector('.sm\\:inline') as HTMLElement;
        const desktopView = within(desktopContainer).getByText(words[5]);
        
        expect(desktopView.parentElement?.innerHTML).toContain(`${words[5]}<br>`);
        
        const word5 = within(desktopContainer).getByText(words[4]);
        expect(word5.parentElement?.innerHTML).toContain(`${words[4]} `);
    });
}); 