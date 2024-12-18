import { renderHook, act } from '@testing-library/react';
import { useVisibilityToggle } from '@/hooks/useVisibilityToggle';

describe('useVisibilityToggle', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderVisibilityHook = (initialState = false) => 
        renderHook(() => useVisibilityToggle(initialState));

    it('should initialize with default state', () => {
        const { result } = renderVisibilityHook();
        expect(result.current.isVisible).toBe(false);
    });

    it('should toggle visibility', () => {
        const { result } = renderVisibilityHook();
        
        act(() => {
            result.current.toggle();
        });
        expect(result.current.isVisible).toBe(true);
        
        act(() => {
            result.current.toggle();
        });
        expect(result.current.isVisible).toBe(false);
    });
}); 