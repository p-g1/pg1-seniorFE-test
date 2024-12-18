import { render, screen } from '@testing-library/react';
import Wallet from '@/components/Wallet';
import { WALLET_DERIVATION_PATH } from '@/constants/constants';

describe('Wallet', () => {
    const mockWalletData = {
        address: 'testAddress123',
        privateKey: 'testPrivateKey123',
        mnemonic: 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
        path: WALLET_DERIVATION_PATH
    };

    const renderComponent = (props = {}) => 
        render(<Wallet walletData={mockWalletData} {...props} />);

    it('should render wallet information', () => {
        renderComponent();
        expect(screen.getByText('BTC Testnet Wallet Created!')).toBeInTheDocument();
        expect(screen.getByText('testAddress123')).toBeInTheDocument();
    });

    it('should hide sensitive information by default', () => {
        renderComponent();
        
        const privateKeyElement = screen.getByTestId('private-key-text');
        const mnemonicElement = screen.getByTestId('mnemonic-text');
        
        expect(privateKeyElement).toHaveTextContent('•'.repeat(52));
        expect(mnemonicElement).not.toHaveTextContent('word1');
    });

    it('should render copy buttons for sensitive information', () => {
        renderComponent();
        
        expect(screen.getByTestId('copy-address')).toBeInTheDocument();
        expect(screen.getByTestId('copy-private-key')).toBeInTheDocument();
        expect(screen.getByTestId('copy-mnemonic')).toBeInTheDocument();
    });
}); 