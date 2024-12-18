import CopyButton from '@/components/CopyButton';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Address } from '@/types/types';

interface WalletAddressProps {
  address: Address;
};

export default function WalletAddress({ address }: WalletAddressProps) {
  const { copySuccess, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="bg-gray-50 p-3 rounded-lg relative">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500">Wallet Address</p>
        <CopyButton 
          onCopy={() => address && copyToClipboard(address)}
          isSuccess={copySuccess}
          data-testid="copy-address"
        />
      </div>
      <p className="font-mono text-sm break-all text-gray-900">
        {address}
      </p>
    </div>
  );
};