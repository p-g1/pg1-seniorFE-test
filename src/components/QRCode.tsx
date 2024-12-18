"use client";

import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import TransactionStatus from '@/components/TransactionStatus';
import generateBitcoinUri from '@/lib/generateBitcoinUri';
import { Address } from '@/types/types';

interface QRCodeGeneratorProps {
    recipientAddress: Address;
    amount: string;
    message: string;
    onClose: () => void;
    startTime?: number;
};

export default function QRCodeGenerator({
    recipientAddress, 
    amount, 
    message,
    onClose,
    startTime
}: QRCodeGeneratorProps) {
    const [qrUrl, setQrUrl] = useState<string>('');
    const qrRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (recipientAddress && amount) {
            const uri = generateBitcoinUri({
                address: recipientAddress,
                amount: amount,
                message: message
            });
            
            QRCode.toDataURL(uri, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000',
                    light: '#fff',
                },
            })
            .then(setQrUrl)
            .catch(err => {
                console.error('Error generating QR code:', err);
                setError('Error generating QR code');
            });
        }
    }, [recipientAddress, amount, message]);

    useEffect(() => {
        if (qrRef.current) {
            qrRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [qrUrl]); // Only scroll when QR code is ready

    if (!recipientAddress || !amount) {
        return null;
    };

    return (
        <div 
            ref={qrRef}
            className="bg-paper rounded-xl shadow-lg p-6 space-y-4 mb-16 relative"
        >
            {error && (
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                    <p className="text-red-600" data-testid="qr-error">{error}</p>
                </div>
            )}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex flex-col items-center space-y-4">
                {qrUrl && (
                    <div className="p-4 bg-white rounded-lg shadow-inner">
                        <div className="relative w-64 h-64">
                            <Image
                                src={qrUrl}
                                alt="QR Code"
                                fill
                                sizes="256px"
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>
                )}
                
                <div className="w-full space-y-2">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Receiving address</p>
                        <p className="font-mono text-sm break-all text-gray-900">{recipientAddress}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-mono text-sm text-gray-900">{amount} BTC</p>
                    </div>
                    
                    {message && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Message</p>
                            <p className="font-mono text-sm text-gray-900">{message}</p>
                        </div>
                    )}
                </div>

                <TransactionStatus 
                    address={recipientAddress} 
                    expectedAmount={amount}
                    startTime={startTime || Math.floor(Date.now() / 1000)}
                />
            </div>
        </div>
    );
};