import SensitiveInfo from '@/components/SensitiveInfo';
import { useVisibilityToggle } from '@/hooks/useVisibilityToggle';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface PrivateKeyDisplayProps {
  privateKey: string;
};

export default function PrivateKeyDisplay({ privateKey }: PrivateKeyDisplayProps) {
  const { isVisible, toggle } = useVisibilityToggle();
  const { copySuccess, copyToClipboard } = useCopyToClipboard();

  return (
    <SensitiveInfo
      label="Private Key"
      onCopy={() => privateKey && copyToClipboard(privateKey)}
      copySuccess={copySuccess}
      onToggleVisibility={toggle}
      isVisible={isVisible}
      testId="private-key"
    >
      <div 
        data-testid="private-key-text"
        className="font-mono text-sm break-all text-gray-900 max-w-full overflow-hidden whitespace-normal"
      >
        {isVisible ? privateKey : '•'.repeat(52)}
      </div>
    </SensitiveInfo>
  );
};