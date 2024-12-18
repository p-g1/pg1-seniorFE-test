"use client";

import { useState } from "react";
import WalletCreator from "@/components/WalletCreator";
import WalletForm from "@/components/WalletForm";
import Wallet from "@/components/Wallet";
import { Address, WalletData } from "@/types/types";

interface ContainerProps {
    initialWalletCreated?: boolean;
};

export default function Container({ initialWalletCreated = false }: ContainerProps) {
    const [address, setAddress] = useState<Address>('');
    const [isWalletCreated, setIsWalletCreated] = useState(initialWalletCreated);
    const [error, setError] = useState<string | null>(null);
    const [walletData, setWalletData] = useState<WalletData | null>(null);

    const handleWalletCreated = (wallet: WalletData) => {
        setWalletData(wallet);
        setAddress(wallet.address);
        setIsWalletCreated(true);
        setError(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <header className="relative mb-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Bitcoin Testnet Payment Portal</h1>
                    <p className="text-gray-200">Create a wallet and receive Bitcoin payments</p>
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-50 rounded-lg mb-4">
                    <p className="text-red-600 text-center" data-testid="wallet-error">{error}</p>
                </div>
            )}

            {!isWalletCreated ? (
                <WalletCreator 
                    onWalletCreated={handleWalletCreated}
                    onError={setError}
                />
            ) : (
                <>
                    {walletData && <Wallet walletData={walletData} />}
                    {address && <WalletForm address={address} />}
                </>
            )}
        </div>
    );
};