import { useState, useEffect, useRef } from 'react';
import checkTransaction from '@/lib/transactionMonitoring';
import { TransactionStatus, Address } from '@/types/types';

interface TransactionPollingProps {
    address: Address;
    startTime: number;
    expectedAmount: string;
};

type TransactionPollingResult = {
    status: TransactionStatus;
    polling: boolean;
    lastRetryTime: Date | null;
};

export function useTransactionPolling({ address, startTime, expectedAmount }: TransactionPollingProps): TransactionPollingResult {
    const [status, setStatus] = useState<TransactionStatus>({ received: false });
    const [polling, setPolling] = useState(true);
    const [lastRetryTime, setLastRetryTime] = useState<Date | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const RETRY_INTERVAL = 5000;

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const result = await checkTransaction({
                    address,
                    startTime,
                    expectedAmount
                });
                
                setStatus(result);
                setLastRetryTime(new Date());

                if (result.received && result.status === 'confirmed') {
                    setPolling(false);
                    return;
                }

                // Schedule next check
                if (polling) {
                    retryTimeoutRef.current = setTimeout(checkStatus, RETRY_INTERVAL);
                };
            } catch (error) {
                console.error(error);
                setStatus({ received: false, error: 'API Error' });
                setLastRetryTime(new Date());
                
                if (polling) {
                    retryTimeoutRef.current = setTimeout(checkStatus, RETRY_INTERVAL);
                }
            }
        };

        // Start polling
        checkStatus();

        // Cleanup
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            setPolling(false);
        };
    }, [address, startTime, expectedAmount, polling]);

    return { 
        status, 
        polling,
        lastRetryTime
    };
};