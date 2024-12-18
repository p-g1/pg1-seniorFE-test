"use client";

import { useTransactionPolling } from '@/hooks/useTransactionPolling';
import { MEMPOOL_HOST } from '@/constants/constants';
import { Address } from '@/types/types';

interface TransactionStatusProps {
  address: Address;
  expectedAmount: string;
  startTime?: number;
};

export default function TransactionStatus({ 
  address, 
  expectedAmount,
  startTime = Math.floor(Date.now() / 1000)
}: TransactionStatusProps) {
    const { status, polling, lastRetryTime } = useTransactionPolling({ 
        address, 
        expectedAmount, 
        startTime 
    });

    if (status.error) {
        console.log(status.error);
        return (
            <div className="w-full p-4 bg-red-50 rounded-lg space-y-2">
                <p className="text-red-600">{status.error} {polling && "Retrying..."}</p>
                {lastRetryTime && (
                    <p className="text-sm text-gray-600">
                        Last attempt: {lastRetryTime.toLocaleTimeString()}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="w-full space-y-3">
            <h3 className="text-lg font-semibold">Transaction Status</h3>
            
            {status.received ? (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-semibold">
                                <span className="hidden sm:inline">Payment </span>Received!
                            </span>
                        </div>
                        {status.txid && (
                            <a
                                href={`${MEMPOOL_HOST}/tx/${status.txid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium inline-flex items-center space-x-2"
                            >
                                <span>View <span className="hidden sm:inline">transaction</span><span className="sm:hidden">tx</span></span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div>
                            <p className="text-sm text-gray-500" data-testid="transaction-amount-label">Amount</p>
                            <p className="font-mono text-sm text-gray-900" data-testid="transaction-amount-value">
                                {status.amount} BTC
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500" data-testid="transaction-status-label">Status</p>
                            <div className="font-medium">
                                {status.status === 'confirmed' ? (
                                    <span className="text-green-600" data-testid="transaction-status-value">
                                        Confirmed
                                    </span>
                                ) : (
                                    <span className="text-yellow-600 flex items-center space-x-2" data-testid="transaction-status-pending">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
                                        <span>Pending confirmation</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {status.senderAddress && (
                            <div>
                                <p className="text-sm text-gray-500" data-testid="transaction-from-label">From</p>
                                <p className="font-mono text-sm break-all text-gray-900" data-testid="transaction-from-value">
                                    {status.senderAddress}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-gray-500">Transaction ID</p>
                            <p className="font-mono text-sm break-all text-gray-900">{status.txid}</p>
                        </div>
                        
                        {status.timestamp && (
                            <div>
                                <p className="text-sm text-gray-500">Received</p>
                                <p className="text-sm text-gray-900">
                                    {new Date(status.timestamp * 1000).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-blue-600">Waiting for payment...</p>
                </div>
            )}
        </div>
    );
};