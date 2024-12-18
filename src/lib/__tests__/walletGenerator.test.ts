import createWallet from '../walletGenerator';
import { WALLET_DERIVATION_PATH } from '@/constants/constants';

// Mock tiny-secp256k1
jest.mock('tiny-secp256k1', () => ({}), { virtual: true });

jest.mock('bitcoinjs-lib', () => ({
  networks: { testnet: {} },
  payments: {
    p2wpkh: () => ({ address: 'mockedAddress' })
  }
}));

jest.mock('bip39', () => ({
  generateMnemonic: () => 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
  mnemonicToSeedSync: () => Buffer.from('mockedSeed')
}));

jest.mock('bip32', () => ({
  BIP32Factory: () => ({
    fromSeed: () => ({
      derivePath: () => ({
        publicKey: Buffer.from('mockedPublicKey'),
        toWIF: () => 'mockedPrivateKey'
      })
    })
  })
}));

describe('walletGenerator', () => {
  it('should generate valid testnet wallet', () => {
    const wallet = createWallet();
    
    expect(wallet.address).toBeDefined();
    expect(wallet.privateKey).toBeDefined();
    expect(wallet.mnemonic.split(' ')).toHaveLength(12);
    expect(wallet.path).toBe(WALLET_DERIVATION_PATH);
  });
}); 