import { createContext, useContext, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const theme = useTheme();
    const favorites = useFavorites();
    const toast = useToast();

    const value = {
        theme,
        favorites,
        toast
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
