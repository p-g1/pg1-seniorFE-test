import createWallet from "@/lib/walletGenerator";
import { WalletData } from "@/types/types";

interface WalletCreatorProps {
    onWalletCreated: (wallet: WalletData) => void;
    onError: (error: string) => void;
};

export default function WalletCreator({ onWalletCreated, onError }: WalletCreatorProps) {
    const handleCreateWallet = (): void => {
        try {
            const wallet = createWallet();
            if (!wallet.address) {
                throw new Error("No address generated");
            }
            onWalletCreated(wallet);
        } catch (err) {
            onError("Failed to create wallet. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="p-8 pt-0 text-center">
            <button 
                onClick={handleCreateWallet}
                className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Wallet</span>
            </button>
        </div>
    );
}; 