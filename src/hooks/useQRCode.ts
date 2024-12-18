import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeHookParams {
    text: string;
};

type QRCodeHookResult = {
    qrCode: string;
    error?: string;
};

export function useQRCode({ text }: QRCodeHookParams): QRCodeHookResult {
    const [qrCode, setQrCode] = useState('');
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (!text) {
            setQrCode('');
            setError(undefined);
            return;
        };

        QRCode.toDataURL(text)
            .then(setQrCode)
            .catch(() => setError('Error generating QR code'));
    }, [text]);

    return { qrCode, error };
};