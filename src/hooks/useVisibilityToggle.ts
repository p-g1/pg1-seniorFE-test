import { useState, useCallback } from 'react';

export function useVisibilityToggle(initialState = false) {
    const [isVisible, setIsVisible] = useState(initialState);
    
    const toggle = useCallback(() => {
        setIsVisible(prev => !prev);
    }, []);
    
    return {
        isVisible,
        toggle
    };
};