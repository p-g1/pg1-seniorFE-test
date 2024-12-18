import { render, screen, fireEvent } from '@testing-library/react';
import PrivateKeyDisplay from '@/components/PrivateKeyDisplay';

describe('PrivateKeyDisplay', () => {
    const mockPrivateKey = 'test-private-key-123';

    const renderComponent = (props = {}) => 
        render(<PrivateKeyDisplay privateKey={mockPrivateKey} {...props} />);

    it('should toggle private key visibility', () => {
        renderComponent();
        
        const toggleButton = screen.getByTestId('toggle-private-key');
        const privateKeyElement = screen.getByTestId('private-key-text');

        // Initially hidden
        expect(privateKeyElement).toHaveTextContent('•'.repeat(52));

        // Show private key
        fireEvent.click(toggleButton);
        expect(privateKeyElement).toHaveTextContent(mockPrivateKey);

        // Hide private key again
        fireEvent.click(toggleButton);
        expect(privateKeyElement).toHaveTextContent('•'.repeat(52));
    });
}); 