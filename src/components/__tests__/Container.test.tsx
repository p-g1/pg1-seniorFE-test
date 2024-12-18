import { render, screen, fireEvent } from '@testing-library/react';
import Container from '@/components/Container';
import createWallet from '@/lib/walletGenerator';
import { WalletData } from '@/types/types';

jest.mock('@/lib/walletGenerator', () => jest.fn());

jest.mock('@/components/Wallet', () => {
    return function MockWallet({ walletData }: { walletData: WalletData }) {
        return (
            <div data-testid="mock-wallet">
                <p>Address: {walletData.address}</p>
            </div>
        );
    };
});

jest.mock('@/components/WalletForm', () => {
    return function MockWalletForm({ address }: { address: string | undefined }) {
        return <div data-testid="mock-wallet-form">Wallet Form: {address}</div>;
    };
});

describe('Container', () => {
    const mockWallet = {
        address: 'test-address',
        privateKey: 'test-private-key',
        mnemonic: 'test mnemonic',
        path: 'test/path'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (createWallet as jest.Mock).mockReturnValue(mockWallet);
    });

    const renderComponent = (props = {}) => 
        render(<Container {...props} />);

    it('should render initial state with create wallet button', () => {
        renderComponent();
        
        expect(screen.getByText('Bitcoin Testnet Payment Portal')).toBeInTheDocument();
        expect(screen.getByText('Create a wallet and receive Bitcoin payments')).toBeInTheDocument();
        expect(screen.getByText('Create Wallet')).toBeInTheDocument();
    });

    it('should handle successful wallet creation', () => {
        renderComponent();
        
        fireEvent.click(screen.getByText('Create Wallet'));
        
        expect(screen.getByTestId('mock-wallet')).toBeInTheDocument();
        expect(screen.getByText(`Address: ${mockWallet.address}`)).toBeInTheDocument();
        expect(screen.getByTestId('mock-wallet-form')).toBeInTheDocument();
        expect(screen.getByText(`Wallet Form: ${mockWallet.address}`)).toBeInTheDocument();
    });

    it('should handle wallet creation failure', () => {
        (createWallet as jest.Mock).mockImplementation(() => {
            throw new Error('Wallet creation failed');
        });

        renderComponent();
        
        fireEvent.click(screen.getByText('Create Wallet'));
        
        expect(screen.getByTestId('wallet-error')).toHaveTextContent('Failed to create wallet. Please try again.');
        expect(screen.queryByTestId('mock-wallet')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-wallet-form')).not.toBeInTheDocument();
    });

    it('should handle missing address in created wallet', () => {
        (createWallet as jest.Mock).mockReturnValue({
            ...mockWallet,
            address: ''
        });

        renderComponent();
        
        fireEvent.click(screen.getByText('Create Wallet'));
        
        expect(screen.getByTestId('wallet-error')).toHaveTextContent('Failed to create wallet. Please try again.');
        expect(screen.queryByTestId('mock-wallet')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-wallet-form')).not.toBeInTheDocument();
    });

    it('should allow retrying after failure', () => {
        (createWallet as jest.Mock)
            .mockImplementationOnce(() => { throw new Error('Wallet creation failed'); })
            .mockImplementationOnce(() => mockWallet);

        renderComponent();
        
        // First attempt fails
        fireEvent.click(screen.getByText('Create Wallet'));
        expect(screen.getByTestId('wallet-error')).toBeInTheDocument();
        
        // Second attempt succeeds
        fireEvent.click(screen.getByText('Create Wallet'));
        expect(screen.queryByTestId('wallet-error')).not.toBeInTheDocument();
        expect(screen.getByTestId('mock-wallet')).toBeInTheDocument();
    });
}); 