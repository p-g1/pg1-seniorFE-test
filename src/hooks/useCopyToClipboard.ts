import { useState, useCallback } from 'react';

type CopyToClipboardResult = {
    copySuccess: boolean;
    copyToClipboard: (text: string) => Promise<void>;
};

export function useCopyToClipboard(successDuration = 2000): CopyToClipboardResult {
    const [copySuccess, setCopySuccess] = useState(false);
    
    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), successDuration);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopySuccess(false);
        }
    }, [successDuration]);
    
    return { copySuccess, copyToClipboard };
};