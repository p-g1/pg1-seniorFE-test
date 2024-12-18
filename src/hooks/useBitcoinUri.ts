import { useState, useEffect } from 'react';
import { Address } from '@/types/types';

interface BitcoinUriHookParams {
  address: Address;
  amount: string;
  message?: string;
};

export function useBitcoinUri({ 
  address, 
  amount, 
  message 
}: BitcoinUriHookParams): string {
    const [bitcoinUri, setBitcoinUri] = useState('');

    useEffect(() => {
        if (address) {
            const baseUri = `bitcoin:${address}`;
            const params = new URLSearchParams();
            
            if (amount) {
                const formattedAmount = parseFloat(amount).toFixed(8);
                params.append('amount', formattedAmount);
            };
            if (message) params.append('message', message);

            const uri = params.toString() 
                ? `${baseUri}?${params.toString()}`
                : baseUri;
            setBitcoinUri(uri);
        };
    }, [address, amount, message]);

    return bitcoinUri;
};