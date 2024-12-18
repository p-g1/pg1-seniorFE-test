import checkTransaction from '@/lib/transactionMonitoring';

describe('checkTransaction', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle API error', async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('API Error'));
        
        const result = await checkTransaction({
            address: 'test123',
            startTime: 1234567890,
            expectedAmount: '0.001'
        });
        expect(result.error).toBe('API connection error.');
    });

    it('should handle invalid response format', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ invalid: 'data' })
        });
        
        const result = await checkTransaction({
            address: 'test123',
            startTime: 1234567890,
            expectedAmount: '0.001'
        });
        expect(result.error).toBe('Invalid response format');
    });

    it('should handle non-matching amount', async () => {
        console.log('Setting up mock transaction with different amount');
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{
                txid: 'test-tx',
                vout: [{
                    scriptpubkey_address: 'test123',
                    value: 200000 
                }],
                status: { 
                    confirmed: true,
                    block_time: 1234567891 // Start time plus 1
                },
                vin: [{
                    prevout: {
                        scriptpubkey_address: 'senderAddress'
                    }
                }]
            }])
        });
        
        const result = await checkTransaction({
            address: 'test123',
            startTime: 1234567890,
            expectedAmount: '0.001'
        });
        console.log('Transaction check result:', result);
        
        expect(result.amountMatches).toBe(false);
    });

    it('should handle empty transaction list', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        );

        const result = await checkTransaction({
            address: 'testAddress',
            startTime: 1000,
            expectedAmount: '0.001'
        });
        expect(result).toEqual({ received: false });
    });

    it('should skip transactions that occurred before start time', async () => {
        const mockTx = {
            txid: 'test-txid',
            status: {
                block_time: 900, // Before start time
                confirmed: true
            },
            vout: [{
                scriptpubkey_address: 'testAddress',
                value: 100000 // 0.001 BTC
            }]
        };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([mockTx])
            })
        );

        const result = await checkTransaction({
            address: 'testAddress',
            startTime: 1000,
            expectedAmount: '0.001'
        });
        expect(result).toEqual({ received: false });
        expect(console.log).toHaveBeenCalledWith('Transaction occurred before QR code generation');
    });

    it('should handle unconfirmed transactions', async () => {
        const currentTime = Math.floor(Date.now() / 1000);
        const mockTx = {
            txid: 'test-txid',
            status: {
                confirmed: false
            },
            vout: [{
                scriptpubkey_address: 'testAddress',
                value: 100000 // 0.001 BTC
            }],
            vin: [{
                prevout: {
                    scriptpubkey_address: 'senderAddress'
                }
            }]
        };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([mockTx])
            })
        );

        const result = await checkTransaction({
            address: 'testAddress',
            startTime: currentTime - 100,
            expectedAmount: '0.001'
        });
        expect(result).toEqual({
            received: true,
            amount: 0.001,
            expectedAmount: 0.001,
            amountMatches: true,
            confirmations: 0,
            txid: 'test-txid',
            timestamp: expect.any(Number),
            senderAddress: 'senderAddress',
            status: 'unconfirmed'
        });
    });

    it('should handle HTTP errors', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 404
            })
        );

        const result = await checkTransaction({
            address: 'testAddress',
            startTime: 1000,
            expectedAmount: '0.001'
        });
        expect(result).toEqual({ 
            received: false, 
            error: 'API connection error. Retrying...' 
        });
    });
}); 