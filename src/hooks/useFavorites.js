import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing favorites
 * Persists favorites in localStorage
 */
export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('solar-system-favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to load favorites:', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('solar-system-favorites', JSON.stringify(favorites));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to save favorites:', error);
        }
    }, [favorites]);

    const toggleFavorite = useCallback((item) => {
        setFavorites(prev => {
            const exists = prev.some(f => f.id === item.id && f.type === item.type);
            if (exists) {
                return prev.filter(f => !(f.id === item.id && f.type === item.type));
            } else {
                return [...prev, { ...item, addedAt: Date.now() }];
            }
        });
    }, []);

    const isFavorite = useCallback((item) => {
        return favorites.some(f => f.id === item.id && f.type === item.type);
    }, [favorites]);

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    const removeFavorite = useCallback((item) => {
        setFavorites(prev =>
            prev.filter(f => !(f.id === item.id && f.type === item.type))
        );
    }, []);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        removeFavorite,
        count: favorites.length
    };
}
