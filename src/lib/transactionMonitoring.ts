import { MEMPOOL_HOST } from '../constants/constants';
import { TransactionStatus, TransactionVout, Transaction } from '@/types/types';

interface CheckTransactionParams {
  address: string;
  startTime: number;
  expectedAmount: string;
};

export default async function checkTransaction({
  address,
  startTime,
  expectedAmount
}: CheckTransactionParams): Promise<TransactionStatus> {
  try {
    const response = await fetch(
      `${MEMPOOL_HOST}/api/address/${address}/txs`
    );
    
    if (!response.ok) {
      return {
        received: false,
        error: 'API connection error. Retrying...'
      };
    };
    
    const transactions = await response.json();
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
      if (!Array.isArray(transactions)) {
        return { received: false, error: 'Invalid response format' };
      };
      return { received: false };
    };

    const relevantTx = transactions.find((tx: Transaction) => {

      const txTime = tx.status.block_time || Math.floor(Date.now() / 1000);
      const isAfterStart = txTime > startTime;

      if (!isAfterStart) {
        console.log('Transaction occurred before QR code generation');
        return false;
      };

      return true;
    });
    
    if (relevantTx) {
      const amount = relevantTx.vout.reduce((sum: number, output: TransactionVout) => 
        output.scriptpubkey_address === address ? sum + (output.value / 100000000) : sum, 0);

      const parsedExpectedAmount = parseFloat(expectedAmount);
      const amountMatches = Math.abs(amount - parsedExpectedAmount) < 0.00000001;

      return {
        received: true,
        amount,
        expectedAmount: parsedExpectedAmount,
        amountMatches,
        confirmations: relevantTx.status.confirmed ? relevantTx.status.block_height : 0,
        txid: relevantTx.txid,
        timestamp: relevantTx.status.block_time || Math.floor(Date.now() / 1000),
        senderAddress: relevantTx.vin[0]?.prevout?.scriptpubkey_address,
        status: relevantTx.status.confirmed ? 'confirmed' : 'unconfirmed'
      };
    };
    
    return { received: false };
  } catch (error) {
    console.error(error);
    return {
      received: false,
      error: 'API connection error.'
    };
  };
};