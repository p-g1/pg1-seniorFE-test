import { networks, payments } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { BIP32Factory } from 'bip32';
import { Wallet } from '@/types/types';
import { WALLET_DERIVATION_PATH } from '@/constants/constants';

const bip32 = BIP32Factory(ecc);

interface WalletGeneratorParams {
  network?: typeof networks.testnet | typeof networks.bitcoin;
  path: string;
};

export default function createWallet(
  options: WalletGeneratorParams = { 
    network: networks.testnet,
    path: WALLET_DERIVATION_PATH
  }
): Wallet {
    const { network, path } = options;
    
    const mnemonic = generateMnemonic();
    const seed = mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, network);
    const child = root.derivePath(path);
    const { address } = payments.p2wpkh({ 
        pubkey: Buffer.from(child.publicKey),
        network: network 
    });

    return {
        address: address as string,
        privateKey: child.toWIF(),
        mnemonic,
        path
    };
};