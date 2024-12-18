export const mockAddress = "tb1q0xx3maeg8eed3daxs3fh7e5vqw4e7zyp74yufh";

export const emptyResponse = [];

export const mockUnconfirmedTransactionResponse = [
    {
        "txid": "4a2af989da549b6f9d22942978453662a0f5252871a2f4c0d9741218c53c4178",
        "version": 2,
        "locktime": 0,
        "vin": [
            {
                "txid": "e1dbe542d647807787860f0e3dffbe839926cf274bb7ac351e960ccce0c15331",
                "vout": 1,
                "prevout": {
                    "scriptpubkey": "0014a0e045e4d85d690b18d0a4c74da9feb902f890b8",
                    "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 a0e045e4d85d690b18d0a4c74da9feb902f890b8",
                    "scriptpubkey_type": "v0_p2wpkh",
                    "scriptpubkey_address": "tb1q5rsytexct45skxxs5nr5m207hyp03y9cg8rz4p",
                    "value": 1000000
                },
                "scriptsig": "",
                "scriptsig_asm": "",
                "witness": [
                    "3045022100b0e6de148fa36152e68778bbc63134b71060709f8228e4f0335403fbd7450a9b022067219a4bf0e7d46a476f8278862b0caaa09727da2343d064b7009ed60218952401",
                    "0308cf9641fdab35d019e0f219eb2bf6c10422a24c918746560e5d70cca25d849b"
                ],
                "is_coinbase": false,
                "sequence": 0
            }
        ],
        "vout": [
            {
                "scriptpubkey": "76a914b69fd2e9ed35ea6683ada2d31b791bedaf408a6388ac",
                "scriptpubkey_asm": "OP_DUP OP_HASH160 OP_PUSHBYTES_20 b69fd2e9ed35ea6683ada2d31b791bedaf408a63 OP_EQUALVERIFY OP_CHECKSIG",
                "scriptpubkey_type": "p2pkh",
                "scriptpubkey_address": "tb1q0xx3maeg8eed3daxs3fh7e5vqw4e7zyp74yufh",
                "value": 10000
            },
            {
                "scriptpubkey": "0014a0e045e4d85d690b18d0a4c74da9feb902f890b8",
                "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 a0e045e4d85d690b18d0a4c74da9feb902f890b8",
                "scriptpubkey_type": "v0_p2wpkh",
                "scriptpubkey_address": "tb1q5rsytexct45skxxs5nr5m207hyp03y9cg8rz4p",
                "value": 583464
            }
        ],
        "size": 226,
        "weight": 574,
        "sigops": 5,
        "fee": 406536,
        "status": {
            "confirmed": false
        }
    }
];

export const mockConfirmedTransactionResponse = [
    {
        "txid": "4a2af989da549b6f9d22942978453662a0f5252871a2f4c0d9741218c53c4178",
        "version": 2,
        "locktime": 0,
        "vin": [
            {
                "txid": "e1dbe542d647807787860f0e3dffbe839926cf274bb7ac351e960ccce0c15331",
                "vout": 1,
                "prevout": {
                    "scriptpubkey": "0014a0e045e4d85d690b18d0a4c74da9feb902f890b8",
                    "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 a0e045e4d85d690b18d0a4c74da9feb902f890b8",
                    "scriptpubkey_type": "v0_p2wpkh",
                    "scriptpubkey_address": "tb1q5rsytexct45skxxs5nr5m207hyp03y9cg8rz4p",
                    "value": 1000000
                },
                "scriptsig": "",
                "scriptsig_asm": "",
                "witness": [
                    "3045022100b0e6de148fa36152e68778bbc63134b71060709f8228e4f0335403fbd7450a9b022067219a4bf0e7d46a476f8278862b0caaa09727da2343d064b7009ed60218952401",
                    "0308cf9641fdab35d019e0f219eb2bf6c10422a24c918746560e5d70cca25d849b"
                ],
                "is_coinbase": false,
                "sequence": 0
            }
        ],
        "vout": [
            {
                "scriptpubkey": "76a914b69fd2e9ed35ea6683ada2d31b791bedaf408a6388ac",
                "scriptpubkey_asm": "OP_DUP OP_HASH160 OP_PUSHBYTES_20 b69fd2e9ed35ea6683ada2d31b791bedaf408a63 OP_EQUALVERIFY OP_CHECKSIG",
                "scriptpubkey_type": "p2pkh",
                "scriptpubkey_address": "tb1q0xx3maeg8eed3daxs3fh7e5vqw4e7zyp74yufh",
                "value": 10000
            },
            {
                "scriptpubkey": "0014a0e045e4d85d690b18d0a4c74da9feb902f890b8",
                "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 a0e045e4d85d690b18d0a4c74da9feb902f890b8",
                "scriptpubkey_type": "v0_p2wpkh",
                "scriptpubkey_address": "tb1q5rsytexct45skxxs5nr5m207hyp03y9cg8rz4p",
                "value": 583464
            }
        ],
        "size": 226,
        "weight": 574,
        "sigops": 5,
        "fee": 406536,
        "status": {
            "confirmed": true,
            "block_height": 57778,
            "block_hash": "0000000059c7189689b33e7771e66810ef4f66352e1eac936d8188442a408a7e",
            "block_time": Math.floor(Date.now() / 1000) + 100
        }
    }
];