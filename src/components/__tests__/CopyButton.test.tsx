import { render, screen } from '@testing-library/react';
import CopyButton from '@/components/CopyButton';

describe('CopyButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = {}) => 
        render(<CopyButton onCopy={() => {}} isSuccess={false} {...props} />);

    it('should render success state', () => {
        renderComponent({ 
            isSuccess: true, 
            'data-testid': 'test-button' 
        });
        
        expect(screen.getByTestId('test-button')).toBeInTheDocument();
        expect(screen.getByRole('button').querySelector('path')).toHaveAttribute(
            'd',
            'M5 13l4 4L19 7'
        );
    });

    it('should render default state', () => {
        renderComponent();
        
        expect(screen.getByRole('button').querySelector('path')).toHaveAttribute(
            'd',
            'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
        );
    });
}); 