import { PropsWithChildren } from 'react';
import CopyButton from '@/components/CopyButton';

interface SensitiveInfoProps {
  label: string;
  onCopy: () => void;
  copySuccess: boolean;
  onToggleVisibility: () => void;
  isVisible: boolean;
  testId?: string;
};

export default function SensitiveInfo({ 
  label,
  children,
  onCopy,
  copySuccess,
  onToggleVisibility,
  isVisible,
  testId
}: PropsWithChildren<SensitiveInfoProps>) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg relative">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">{label}</p>
          <span className="text-xs text-red-500 font-medium">Save this!</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            data-testid={`toggle-${testId}`}
            onClick={onToggleVisibility}
            className="text-gray-500 hover:text-blue-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isVisible ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
              )}
            </svg>
          </button>
          <CopyButton 
            onCopy={onCopy}
            isSuccess={copySuccess}
            data-testid={`copy-${testId}`}
          />
        </div>
      </div>
      {children}
    </div>
  );
};