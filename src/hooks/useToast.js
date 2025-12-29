import { useState, useCallback } from 'react';

let toastId = 0;

/**
 * Custom hook for managing toast notifications
 */
export function useToast() {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = toastId++;
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    const error = useCallback((message, duration) => {
        return showToast(message, 'error', duration);
    }, [showToast]);

    const info = useCallback((message, duration) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    const warning = useCallback((message, duration) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        info,
        warning
    };
}
