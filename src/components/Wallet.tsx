"use client";

import { WalletData } from '@/types/types';
import PrivateKeyDisplay from '@/components/PrivateKeyDisplay';
import MnemonicDisplay from '@/components/MnemonicDisplay';
import WalletAddress from '@/components/WalletAddress';

interface WalletProps {
    walletData: WalletData;
};

export default function Wallet({ walletData }: WalletProps) {
    return (
        <div className="bg-paper w-full max-w-xl mx-auto rounded-xl shadow-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">BTC Testnet Wallet Created!</h2>
            </div>

            <div className="space-y-3">
                <WalletAddress address={walletData.address}/>
                <MnemonicDisplay mnemonic={walletData.mnemonic}/>
                <PrivateKeyDisplay privateKey={walletData.privateKey}/>
            </div>

            <div className="pt-2">
                <p className="text-xs text-gray-500">
                    This is a testnet wallet. Do not send real Bitcoin to this address.
                </p>
            </div>
        </div>
    );
};