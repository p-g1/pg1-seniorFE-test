export type Address = string;

export type Wallet = {
    address: string;
    privateKey: string;
    mnemonic: string;
    path: string;
};

export type WalletData = {
    address: Address;
    privateKey: string;
    mnemonic: string;
    path: string;
};

export type FormData = {
    amount: string;
    message: string;
};

export type QRData = {
    amount: string;
    recipientAddress: string;
    message: string;
};

export type Transaction = {
    txid: string;
    status: {
        confirmed: boolean;
        block_time?: number;
    };
    vout: TransactionVout[];
    vin: TransactionVin[];
};

export type TransactionVout = {
    scriptpubkey_address: string;
    value: number;
};

export type TransactionVin = {
    prevout: {
        scriptpubkey_address: string;
    };
};

export type TransactionStatus = {
    received: boolean;
    amount?: number;
    expectedAmount?: number;
    amountMatches?: boolean;
    confirmations?: number;
    txid?: string;
    timestamp?: number;
    error?: string;
    senderAddress?: string;
    status?: 'confirmed' | 'unconfirmed';
};