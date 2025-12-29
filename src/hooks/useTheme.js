import { useState, useEffect } from 'react';

/**
 * Custom hook for managing theme (dark/light mode)
 * Persists theme preference in localStorage
 */
export function useTheme() {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, default to dark
        const savedTheme = localStorage.getItem('solar-system-theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        // Save to localStorage
        localStorage.setItem('solar-system-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return { theme, toggleTheme, setTheme };
}
