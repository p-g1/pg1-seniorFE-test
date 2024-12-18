import SensitiveInfo from '@/components/SensitiveInfo';
import { useVisibilityToggle } from '@/hooks/useVisibilityToggle';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface MnemonicDisplayProps {
  mnemonic: string;
};

export default function MnemonicDisplay({ mnemonic }: MnemonicDisplayProps) {
  const { isVisible, toggle } = useVisibilityToggle();
  const { copySuccess, copyToClipboard } = useCopyToClipboard();

  return (
    <SensitiveInfo
      label="Recovery Phrase"
      onCopy={() => mnemonic && copyToClipboard(mnemonic)}
      copySuccess={copySuccess}
      onToggleVisibility={toggle}
      isVisible={isVisible}
      testId="mnemonic"
    >
      <p 
        data-testid="mnemonic-text"
        className="font-mono text-sm text-gray-900 pr-8 w-full"
      >
        {isVisible ? (
          <>
            <span className="hidden sm:inline">
              {mnemonic?.split(' ').map((word, i) => (
                <span key={i} className="whitespace-nowrap">
                  {word}
                  {i === 5 ? <br /> : ' '}
                </span>
              ))}
            </span>
            <span className="sm:hidden" data-testid="mnemonic-mobile-view">
              {mnemonic?.split(' ').map((word, i) => (
                <span key={i} className="whitespace-nowrap">
                  {word}
                  {i === 3 || i === 7 ? <br /> : ' '}
                </span>
              ))}
            </span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">
              ••••• ••••• ••••• ••••• ••••• •••••<br />
              ••••• ••••• ••••• ••••• ••••• •••••
            </span>
            <span className="sm:hidden">
              ••••• ••••• ••••• •••••<br />
              ••••• ••••• ••••• •••••<br />
              ••••• ••••• ••••• •••••
            </span>
          </>
        )}
      </p>
    </SensitiveInfo>
  );
};